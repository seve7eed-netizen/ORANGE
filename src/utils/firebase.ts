import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  initializeFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc, 
  writeBatch,
  onSnapshot,
  query,
  getDoc
} from 'firebase/firestore';
import { Project } from '../types';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with custom databaseId and high-compatibility HTTP long polling for sandbox environments
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, firebaseConfig.firestoreDatabaseId || '(default)');

const PROJECTS_COLLECTION = 'projects';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  }
}

/**
 * Standard Firestore error handling helper to output informative diagnostic JSONs.
 */
function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path,
    authInfo: {
      userId: null,
      email: null,
      emailVerified: null
    }
  };
  console.error('Firestore Error Info:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Automatically downsizes and compresses large base64 image strings to ensure Firestore documents remain 
 * well under the 1MB protocol size limit and pass validation.
 */
export async function compressBase64IfNeeded(base64Str: string): Promise<string> {
  if (!base64Str || !base64Str.startsWith('data:image/')) {
    return base64Str;
  }
  // If the base64 string is already reasonably small, bypass compression to save processing time
  if (base64Str.length < 150000) {
    return base64Str;
  }

  return new Promise((resolve) => {
    // Check if we are running in a browser context with canvas support
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      resolve(base64Str);
      return;
    }

    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        const MAX_RESOL = 800;
        if (width > MAX_RESOL || height > MAX_RESOL) {
          if (width > height) {
            height = Math.round((height * MAX_RESOL) / width);
            width = MAX_RESOL;
          } else {
            width = Math.round((width * MAX_RESOL) / height);
            height = MAX_RESOL;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);
          
          // Downsize using a reliable compression quality (0.50 maintains aesthetic integrity for cover images while dropping size significantly)
          const compressed = canvas.toDataURL('image/jpeg', 0.50);
          console.log(`Auto-optimized heavy local image asset: shrunk character length from ${base64Str.length} to ${compressed.length}`);
          resolve(compressed);
        } else {
          resolve(base64Str);
        }
      } catch (err) {
        console.error('Canvas processing failed in background micro-scaler:', err);
        resolve(base64Str);
      }
    };
    img.onerror = () => {
      resolve(base64Str);
    };
    img.src = base64Str;
  });
}

/**
 * Loads all projects from Firestore.
 */
export async function loadProjectsFromFirestore(): Promise<Project[]> {
  try {
    const querySnapshot = await getDocs(collection(db, PROJECTS_COLLECTION));
    const projects: Project[] = [];
    querySnapshot.forEach((docSnap) => {
      if (docSnap.id !== '__deleted_metadata__') {
        projects.push(docSnap.data() as Project);
      }
    });
    return projects;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, PROJECTS_COLLECTION);
  }
}

/**
 * Subscribes to the projects collection for real-time synchronization.
 */
export function subscribeToProjectsFromFirestore(
  onUpdate: (projects: Project[]) => void,
  onError: (error: any) => void
) {
  const q = query(collection(db, PROJECTS_COLLECTION));
  return onSnapshot(
    q,
    (snapshot) => {
      const projects: Project[] = [];
      snapshot.forEach((docSnap) => {
        if (docSnap.id !== '__deleted_metadata__') {
          projects.push(docSnap.data() as Project);
        }
      });
      onUpdate(projects);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, PROJECTS_COLLECTION);
      } catch (formattedError) {
        onError(formattedError);
      }
    }
  );
}

/**
 * Loads the list of deleted project IDs from the metadata document in Firestore.
 */
export async function getDeletedProjectIdsFromFirestore(): Promise<string[]> {
  try {
    const docRef = doc(db, PROJECTS_COLLECTION, '__deleted_metadata__');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return Array.isArray(data.deletedIds) ? data.deletedIds : [];
    }
    return [];
  } catch (e) {
    console.warn('Failed to load deleted metadata:', e);
    return [];
  }
}

/**
 * Gets the seeded status of the database from the metadata document.
 */
export async function getSeededStatusFromFirestore(): Promise<boolean> {
  try {
    const docRef = doc(db, PROJECTS_COLLECTION, '__deleted_metadata__');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return !!data.seeded;
    }
    return false;
  } catch (e) {
    console.warn('Failed to load seeded metadata:', e);
    return false;
  }
}

/**
 * Clears all deleted project IDs in the Firestore metadata document.
 */
export async function clearDeletedProjectIdsInFirestore(): Promise<void> {
  try {
    const docRef = doc(db, PROJECTS_COLLECTION, '__deleted_metadata__');
    await setDoc(docRef, { deletedIds: [], seeded: true }, { merge: true });
  } catch (e) {
    console.warn('Failed to clear deleted metadata:', e);
  }
}

/**
 * Marks a project ID as deleted in the Firestore metadata document.
 */
export async function markProjectAsDeletedInFirestore(id: string): Promise<void> {
  try {
    const docRef = doc(db, PROJECTS_COLLECTION, '__deleted_metadata__');
    const docSnap = await getDoc(docRef);
    let deletedIds: string[] = [];
    let seeded = false;
    if (docSnap.exists()) {
      const data = docSnap.data();
      seeded = !!data.seeded;
      if (Array.isArray(data.deletedIds)) {
        deletedIds = data.deletedIds;
      }
    }
    if (!deletedIds.includes(id)) {
      deletedIds = [...deletedIds, id];
      await setDoc(docRef, { deletedIds, seeded: true }, { merge: true });
    }
  } catch (e) {
    console.warn('Failed to save deleted metadata:', e);
  }
}

/**
 * Saves a list of projects into Firestore in a single batch.
 */
export async function seedProjectsToFirestore(projects: Project[]): Promise<void> {
  try {
    const batch = writeBatch(db);
    
    const querySnapshot = await getDocs(collection(db, PROJECTS_COLLECTION));
    querySnapshot.forEach((docSnap) => {
      if (docSnap.id !== '__deleted_metadata__') {
        batch.delete(docSnap.ref);
      }
    });

    for (const project of projects) {
      const docRef = doc(db, PROJECTS_COLLECTION, project.id);
      const cloudProject = { ...project };
      if (cloudProject.videoUrl && cloudProject.videoUrl.startsWith('data:')) {
        delete cloudProject.videoUrl;
      }
      if (cloudProject.videoUrls) {
        cloudProject.videoUrls = cloudProject.videoUrls.filter(url => !url.startsWith('data:'));
        if (cloudProject.videoUrls.length === 0) {
          delete cloudProject.videoUrls;
        }
      }
      if (cloudProject.coverImage && cloudProject.coverImage.startsWith('data:')) {
        cloudProject.coverImage = await compressBase64IfNeeded(cloudProject.coverImage);
      }
      if (cloudProject.additionalImages) {
        const compressedList: string[] = [];
        for (const imgUrl of cloudProject.additionalImages) {
          if (imgUrl && imgUrl.startsWith('data:')) {
            compressedList.push(await compressBase64IfNeeded(imgUrl));
          } else {
            compressedList.push(imgUrl);
          }
        }
        cloudProject.additionalImages = compressedList;
      }
      batch.set(docRef, cloudProject);
    }

    // Explicitly mark database as seeded in the metadata document
    const metaRef = doc(db, PROJECTS_COLLECTION, '__deleted_metadata__');
    batch.set(metaRef, { seeded: true }, { merge: true });

    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, PROJECTS_COLLECTION);
  }
}

/**
 * Saves or updates a single project in Firestore.
 */
export async function saveProjectToFirestore(project: Project): Promise<void> {
  const path = `${PROJECTS_COLLECTION}/${project.id}`;
  try {
    const docRef = doc(db, PROJECTS_COLLECTION, project.id);
    const cloudProject = { ...project };
    if (cloudProject.videoUrl && cloudProject.videoUrl.startsWith('data:')) {
      delete cloudProject.videoUrl;
    }
    if (cloudProject.videoUrls) {
      cloudProject.videoUrls = cloudProject.videoUrls.filter(url => !url.startsWith('data:'));
      if (cloudProject.videoUrls.length === 0) {
        delete cloudProject.videoUrls;
      }
    }
    if (cloudProject.coverImage && cloudProject.coverImage.startsWith('data:')) {
      cloudProject.coverImage = await compressBase64IfNeeded(cloudProject.coverImage);
    }
    if (cloudProject.additionalImages) {
      const compressedList: string[] = [];
      for (const imgUrl of cloudProject.additionalImages) {
        if (imgUrl && imgUrl.startsWith('data:')) {
          compressedList.push(await compressBase64IfNeeded(imgUrl));
        } else {
          compressedList.push(imgUrl);
        }
      }
      cloudProject.additionalImages = compressedList;
    }
    await setDoc(docRef, cloudProject, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Deletes a single project from Firestore.
 */
export async function deleteProjectFromFirestore(projectId: string): Promise<void> {
  const path = `${PROJECTS_COLLECTION}/${projectId}`;
  try {
    const docRef = doc(db, PROJECTS_COLLECTION, projectId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
