// cloudinaryHelpers.js
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dfovmrebt';

export const getCloudinaryUrl = (imageObj, options = {}) => {
  const { 
    width, 
    height, 
    quality = 'auto', 
    format = 'auto', // Default f_auto akan menangani ekstensi file
    crop = 'fill',
    gravity = 'auto'
  } = options;

  // Build transformations
  const transformations = [];
  
  // Urutan transformasi penting di Cloudinary
  if (crop) transformations.push(`c_${crop}`);
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (gravity) transformations.push(`g_${gravity}`);
  if (quality) transformations.push(`q_${quality}`);
  
  // f_auto sangat penting karena kita menghapus ekstensi file manual
  transformations.push(`f_${format}`); 
  transformations.push('dpr_auto');

  const transformationStr = transformations.join(',');
  const baseUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;
  
  // Jika di data nanti tidak ada version, ini akan return string kosong (aman)
  const versionPart = imageObj.version ? `${imageObj.version}/` : '';

  // PERUBAHAN DISINI: 
  // Hapus ".${imageObj.format}" di akhir. 
  // Cloudinary akan generate format sesuai browser user karena ada 'f_auto' di atas.
  return `${baseUrl}/${transformationStr}/${versionPart}${imageObj.publicId}`;
};

// Helper khusus untuk ProjectDetail (Tidak perlu diubah, tapi akan ikut terupdate logikanya)
export const getProjectImage = (imageObj, size = 'medium') => {
  const sizes = {
    // TAMBAHKAN INI: Ukuran sangat kecil untuk efek sensor pixel
    tiny: { width: 20, quality: 'auto' }, 
    
    small: { width: 400, quality: '60' },
    medium: { width: 800, quality: '70' },
    large: { width: 1200, quality: '80' }
  };
  // Fallback ke medium jika size tidak ditemukan
  return getCloudinaryUrl(imageObj, sizes[size] || sizes.medium);
};

export const getImageSrcSet = (imageObj) => {
  return `
    ${getCloudinaryUrl(imageObj, { width: 400, quality: '60' })} 400w,
    ${getCloudinaryUrl(imageObj, { width: 800, quality: '70' })} 800w,
    ${getCloudinaryUrl(imageObj, { width: 1200, quality: '80' })} 1200w
  `;
};