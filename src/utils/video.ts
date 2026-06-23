/**
 * Helper utility to convert normal YouTube, Vimeo, or Google Drive URLs into their correct embeddable iframe src format.
 * Enables users to use copy-pasted URLs directly without needing to manually generate the /embed/ version.
 */
export function getEmbedUrl(url: string | undefined): string {
  if (!url) return '';

  const trimmed = url.trim();

  // 1. Check if it's already an embed link
  if (trimmed.includes('/embed/') || trimmed.includes('player.vimeo.com/video/') || trimmed.includes('/preview')) {
    return trimmed;
  }

  // 2. Google Drive Links (Extract file ID and convert to preview link)
  if (trimmed.includes('drive.google.com') || trimmed.includes('docs.google.com')) {
    const fileIdMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
    }
    const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idMatch && idMatch[1]) {
      return `https://drive.google.com/file/d/${idMatch[1]}/preview`;
    }
  }

  // 3. YouTube normal links
  if (trimmed.includes('youtube.com') || trimmed.includes('youtu.be')) {
    let videoId = '';
    
    if (trimmed.includes('youtube.com/watch')) {
      try {
        const urlParts = trimmed.split('?');
        const urlParams = new URLSearchParams(urlParts[1] || '');
        videoId = urlParams.get('v') || '';
      } catch (e) {
        // Fallback split
        const match = trimmed.match(/[?&]v=([^&#]+)/);
        if (match) videoId = match[1];
      }
    } else if (trimmed.includes('youtu.be/')) {
      // Short url e.g. https://youtu.be/dQw4w9WgXcQ?si=...
      const parts = trimmed.split('youtu.be/');
      if (parts[1]) {
        videoId = parts[1].split('?')[0].split('#')[0];
      }
    } else if (trimmed.includes('youtube.com/shorts/')) {
      // Shorts support e.g. https://youtube.com/shorts/dQw4w9WgXcQ
      const parts = trimmed.split('/shorts/');
      if (parts[1]) {
        videoId = parts[1].split('?')[0].split('#')[0];
      }
    }

    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
  }

  // 4. Vimeo normal links
  if (trimmed.includes('vimeo.com')) {
    const parts = trimmed.split('vimeo.com/');
    if (parts[1]) {
      const vimeoId = parts[1].split('?')[0].split('#')[0];
      return `https://player.vimeo.com/video/${vimeoId}`;
    }
  }

  return trimmed;
}

/**
 * Handles Dropbox and direct file link conversion for direct streaming inside native <video> components.
 */
export function getDirectVideoUrl(url: string | undefined): string {
  if (!url) return '';
  const trimmed = url.trim();

  // Convert Dropbox share links to raw direct media streams
  if (trimmed.includes('dropbox.com')) {
    if (trimmed.includes('?dl=0')) {
      return trimmed.replace('?dl=0', '?raw=1');
    } else if (trimmed.includes('&dl=0')) {
      return trimmed.replace('&dl=0', '&raw=1');
    } else if (!trimmed.includes('raw=1') && !trimmed.includes('dl=1')) {
      return trimmed.includes('?') ? `${trimmed}&raw=1` : `${trimmed}?raw=1`;
    }
  }

  return trimmed;
}

/**
 * Robustly determines whether a video URL requires an iframe player (YouTube, Vimeo, Google Drive)
 * or can be natively played via deep-linked storage in the browser's styled <video> tag.
 */
export function shouldUseIframe(url: string | undefined): boolean {
  if (!url) return false;
  const lowercaseUrl = url.toLowerCase().trim();

  // 1. Explicit video streaming aggregators require iframe players
  if (
    lowercaseUrl.includes('youtube.com') ||
    lowercaseUrl.includes('youtu.be') ||
    lowercaseUrl.includes('vimeo.com')
  ) {
    return true;
  }

  // 2. Personal storage web pages (Google Drive, OneDrive) require iframes
  if (
    lowercaseUrl.includes('drive.google.com') ||
    lowercaseUrl.includes('docs.google.com') ||
    lowercaseUrl.includes('onedrive.live.com') ||
    lowercaseUrl.includes('1drv.ms') ||
    lowercaseUrl.includes('sharepoint.com')
  ) {
    return true;
  }

  // 3. Existing embeds
  if (lowercaseUrl.includes('/embed/') || lowercaseUrl.includes('player.vimeo.com/video/')) {
    return true;
  }

  // 4. Otherwise, if it's a raw video file stream or Data URI, it goes to <video>
  // Let's check common file formats (excluding query parameters to support signatures/authentication tokens)
  if (lowercaseUrl.startsWith('data:video/')) {
    return false;
  }

  const cleanPath = lowercaseUrl.split('?')[0];
  if (
    cleanPath.endsWith('.mp4') ||
    cleanPath.endsWith('.mov') ||
    cleanPath.endsWith('.webm') ||
    cleanPath.endsWith('.ogg') ||
    cleanPath.endsWith('.m4v') ||
    cleanPath.endsWith('.avi')
  ) {
    return false;
  }

  // Dropbox files with raw parameter can be played via native video
  if (lowercaseUrl.includes('dropbox.com') && (lowercaseUrl.includes('raw=1') || lowercaseUrl.includes('dl=1'))) {
    return false;
  }

  // Default fallback: If it's a Dropbox link, we will convert it to a video element source
  if (lowercaseUrl.includes('dropbox.com')) {
    return false;
  }

  // General default fallback: render direct links with video tags, standard URLs otherwise
  return false;
}
