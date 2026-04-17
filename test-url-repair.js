// Test URL repair function
const repairCloudinaryUrl = (url) => {
  if (!url || !url.includes('res.cloudinary.com')) {
    return url;
  }

  const cleanedUrl = url.split('?')[0].split('#')[0];
  const cloudMatch = cleanedUrl.match(/^https:\/\/res\.cloudinary\.com\/([^\/]+)\/image\/upload\/(.+)$/);
  if (!cloudMatch) return url;

  const cloudName = cloudMatch[1];
  let rest = cloudMatch[2];

  // Check if rest starts with transformation params (q_75,f_auto,w_400, etc)
  if (/^[a-z]_\d+/.test(rest)) {
    // Malformed URL: q_75,f_auto,w_400,g_auto,...ents/gallery/imageID
    // Extract everything after the last comma that's followed by a path or filename
    const lastCommaIndex = rest.lastIndexOf(',');
    if (lastCommaIndex !== -1) {
      rest = rest.substring(lastCommaIndex + 1);
    }
  }

  return `https://res.cloudinary.com/${cloudName}/image/upload/${rest}`;
};

// Test cases based on your error screenshots
const testUrls = [
  'https://res.cloudinary.com/djvccbmtx/image/upload/q_75,f_auto,w_400,g_auto,ents/gallery/ca9...',
  'https://res.cloudinary.com/djvccbmtx/image/upload/q_75,f_auto,w_400,g_auto,ents/gallery/Wedding_image_28',
  'https://res.cloudinary.com/djvccbmtx/image/upload/v1775312277/GalleryHero_j8bvra.jpg', // Normal URL
];

console.log('Testing URL repair function:\n');
testUrls.forEach((url) => {
  const repaired = repairCloudinaryUrl(url);
  console.log('Original:', url.substring(0, 80) + '...');
  console.log('Repaired:', repaired.substring(0, 80) + '...');
  console.log('');
});
