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
export async function compressBase64IfNeeded(
  base64Str: string,
  maxResolution = 500,
  quality = 0.35
): Promise<string> {
  if (!base64Str || !base64Str.startsWith('data:image/')) {
    return base64Str;
  }
  // If the base64 string is already reasonably small, bypass compression to save processing time
  // 60000 characters is around ~45KB, which is completely safe for Firestore documents
  if (base64Str.length < 60000) {
    return base64Str;
  }

  return new Promise((resolve) => {
    let resolved = false;
    
    // Safety timeout: resolve with the original string if image loading hangs for > 2.5 seconds
    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        console.warn('Image compression timed out inside micro-scaler, resolving with original base64.');
        resolve(base64Str);
      }
    }, 2500);

    // Check if we are running in a browser context with canvas support
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      clearTimeout(timeout);
      resolve(base64Str);
      return;
    }

    const img = new Image();
    img.onload = () => {
      if (resolved) return;
      resolved = true;
      clearTimeout(timeout);
      try {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        const MAX_RESOL = maxResolution;
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
          ctx.imageSmoothingQuality = 'medium';
          ctx.drawImage(img, 0, 0, width, height);
          
          // Downsize using a reliable compression quality (0.35 maintains aesthetic integrity for cover images while dropping size significantly)
          const compressed = canvas.toDataURL('image/jpeg', quality);
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
      if (resolved) return;
      resolved = true;
      clearTimeout(timeout);
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
 * Removes specified project IDs from the deleted list in the Firestore metadata document.
 */
export async function undeleteProjectsInFirestore(ids: string[]): Promise<void> {
  try {
    const docRef = doc(db, PROJECTS_COLLECTION, '__deleted_metadata__');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (Array.isArray(data.deletedIds)) {
        const updatedDeletedIds = data.deletedIds.filter((id: string) => !ids.includes(id));
        await setDoc(docRef, { deletedIds: updatedDeletedIds }, { merge: true });
      }
    }
  } catch (e) {
    console.warn('Failed to undelete projects in metadata:', e);
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
 * This function compresses images down into extremely light base64 representations and saves them directly in Firestore,
 * bypassing the need for Firebase Storage.
 */
export async function seedProjectsToFirestore(projects: Project[]): Promise<void> {
  try {
    const querySnapshot = await getDocs(collection(db, PROJECTS_COLLECTION));
    
    // 1. Delete all existing project documents individually to avoid atomic batch limits
    await Promise.all(
      querySnapshot.docs.map(async (docSnap) => {
        if (docSnap.id !== '__deleted_metadata__') {
          await deleteDoc(docSnap.ref);
        }
      })
    );
 
    // 2. Process all projects and their images/videos in parallel for maximum speed and efficiency
    const processedProjects = await Promise.all(projects.map(async (project) => {
      const cloudProject = { ...project };
      
      // Compress cover image to very compact size (max resolution 380, quality 0.3)
      if (cloudProject.coverImage && cloudProject.coverImage.startsWith('data:')) {
        cloudProject.coverImage = await compressBase64IfNeeded(cloudProject.coverImage, 380, 0.30);
      }

      // Compress additional gallery images to compact size (max resolution 350, quality 0.25)
      if (cloudProject.additionalImages) {
        cloudProject.additionalImages = await Promise.all(
          cloudProject.additionalImages.map(async (imgUrl) => {
            if (imgUrl && imgUrl.startsWith('data:')) {
              return await compressBase64IfNeeded(imgUrl, 350, 0.25);
            }
            return imgUrl;
          })
        );
      }

      // Omit local raw video uploads (starts with data:video) when syncing to Cloud/Firestore to prevent crashing 1MB limit.
      // Explain to user to input youtube/vimeo/external direct URLs instead for 1:1 cloud sharing.
      if (cloudProject.videoUrl && cloudProject.videoUrl.startsWith('data:')) {
        delete cloudProject.videoUrl;
      }
      if (cloudProject.videoUrls) {
        cloudProject.videoUrls = cloudProject.videoUrls.filter(vUrl => vUrl && !vUrl.startsWith('data:'));
      }

      return cloudProject;
    }));

    // 3. Save each processed project individually using setDoc (bypasses the 10MB batch size ceiling)
    await Promise.all(
      processedProjects.map(async (cloudProject) => {
        const docRef = doc(db, PROJECTS_COLLECTION, cloudProject.id);
        await setDoc(docRef, cloudProject);
      })
    );

    // 4. Explicitly mark database as seeded in the metadata document
    const metaRef = doc(db, PROJECTS_COLLECTION, '__deleted_metadata__');
    await setDoc(metaRef, { seeded: true }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, PROJECTS_COLLECTION);
  }
}

/**
 * Saves a list of projects into Firestore, supporting a step-by-step progress tracking callback.
 */
export async function seedProjectsToFirestoreWithProgress(
  projects: Project[],
  onProgress?: (current: number) => void
): Promise<void> {
  try {
    const querySnapshot = await getDocs(collection(db, PROJECTS_COLLECTION));
    
    // 1. Delete all existing project documents individually to avoid atomic batch limits
    await Promise.all(
      querySnapshot.docs.map(async (docSnap) => {
        if (docSnap.id !== '__deleted_metadata__') {
          await deleteDoc(docSnap.ref);
        }
      })
    );
 
    let current = 0;
    // 2. Upload one by one to track progress and handle failures gracefully
    for (const project of projects) {
      const cloudProject = { ...project };
      
      // Compress cover image to very compact size (max resolution 380, quality 0.3)
      if (cloudProject.coverImage && cloudProject.coverImage.startsWith('data:')) {
        cloudProject.coverImage = await compressBase64IfNeeded(cloudProject.coverImage, 380, 0.30);
      }

      // Compress additional gallery images to compact size (max resolution 350, quality 0.25)
      if (cloudProject.additionalImages) {
        cloudProject.additionalImages = await Promise.all(
          cloudProject.additionalImages.map(async (imgUrl) => {
            if (imgUrl && imgUrl.startsWith('data:')) {
              return await compressBase64IfNeeded(imgUrl, 350, 0.25);
            }
            return imgUrl;
          })
        );
      }

      // Omit local raw video uploads (data:video) to protect Firestore document size limits
      if (cloudProject.videoUrl && cloudProject.videoUrl.startsWith('data:')) {
        delete cloudProject.videoUrl;
      }
      if (cloudProject.videoUrls) {
        cloudProject.videoUrls = cloudProject.videoUrls.filter(vUrl => vUrl && !vUrl.startsWith('data:'));
      }

      const docRef = doc(db, PROJECTS_COLLECTION, cloudProject.id);
      await setDoc(docRef, cloudProject);
      
      current++;
      if (onProgress) {
        onProgress(current);
      }
    }

    // Explicitly mark database as seeded in the metadata document
    const metaRef = doc(db, PROJECTS_COLLECTION, '__deleted_metadata__');
    await setDoc(metaRef, { seeded: true }, { merge: true });
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
    
    // Compress cover image to compact base64
    if (cloudProject.coverImage && cloudProject.coverImage.startsWith('data:')) {
      cloudProject.coverImage = await compressBase64IfNeeded(cloudProject.coverImage, 380, 0.30);
    }

    // Compress additional gallery images to compact base64
    if (cloudProject.additionalImages) {
      cloudProject.additionalImages = await Promise.all(
        cloudProject.additionalImages.map(async (imgUrl) => {
          if (imgUrl && imgUrl.startsWith('data:')) {
            return await compressBase64IfNeeded(imgUrl, 350, 0.25);
          }
          return imgUrl;
        })
      );
    }

    // Omit local raw video uploads (data:video) to protect Firestore document size limits
    if (cloudProject.videoUrl && cloudProject.videoUrl.startsWith('data:')) {
      delete cloudProject.videoUrl;
    }
    if (cloudProject.videoUrls) {
      cloudProject.videoUrls = cloudProject.videoUrls.filter(vUrl => vUrl && !vUrl.startsWith('data:'));
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

const IMGBB_COLLECTION = 'imgbb_library';

export interface ImgbbImage {
  id: string;
  url: string;
  name: string;
  projectTitle?: string;
  uploadedAt: number;
}

/**
 * Saves an uploaded ImgBB image URL and metadata to Firestore.
 */
export async function saveImgbbImageToFirestore(url: string, name: string, projectTitle = '미분류'): Promise<void> {
  try {
    const id = 'imgbb_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    const docRef = doc(db, IMGBB_COLLECTION, id);
    await setDoc(docRef, {
      id,
      url,
      name,
      projectTitle,
      uploadedAt: Date.now()
    });
  } catch (error) {
    console.warn('Failed to save ImgBB image metadata:', error);
  }
}

/**
 * Loads all uploaded ImgBB images from Firestore.
 */
export async function loadImgbbImagesFromFirestore(): Promise<ImgbbImage[]> {
  try {
    const querySnapshot = await getDocs(collection(db, IMGBB_COLLECTION));
    const list: ImgbbImage[] = [];
    querySnapshot.forEach((docSnap) => {
      list.push(docSnap.data() as ImgbbImage);
    });
    return list.sort((a, b) => b.uploadedAt - a.uploadedAt);
  } catch (error) {
    console.warn('Failed to load ImgBB images:', error);
    return [];
  }
}

/**
 * Deletes an uploaded ImgBB image log from Firestore.
 */
export async function deleteImgbbImageFromFirestore(id: string): Promise<void> {
  try {
    const docRef = doc(db, IMGBB_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.warn('Failed to delete ImgBB image reference:', error);
  }
}

