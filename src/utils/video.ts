/**
 * Helper utility to convert normal YouTube or Vimeo URLs into their correct embeddable iframe src format.
 * Enables users to use copy-pasted URLs directly without needing to manually generate the /embed/ version.
 */
export function getEmbedUrl(url: string | undefined): string {
  if (!url) return '';

  const trimmed = url.trim();

  // 1. Check if it's already an embed link
  if (trimmed.includes('/embed/') || trimmed.includes('player.vimeo.com/video/')) {
    return trimmed;
  }

  // 2. Data URI (like direct recording uploaded) or direct mp4/quicktime/webm videofiles
  if (trimmed.startsWith('data:video/') || trimmed.endsWith('.mp4') || trimmed.endsWith('.mov') || trimmed.endsWith('.webm') || trimmed.endsWith('.ogg')) {
    return trimmed;
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
