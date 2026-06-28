const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const hasCloudinary = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name'
);

// ── Local disk fallback ───────────────────────────────────────────────────────
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const imageFilter = (req, file, cb) => {
  const ok = /jpeg|jpg|png|webp|gif/i;
  if (ok.test(path.extname(file.originalname)) && ok.test(file.mimetype)) cb(null, true);
  else cb(new Error('Only image files allowed (jpg, jpeg, png, webp)'));
};

const mediaFilter = (req, file, cb) => {
  const imgOk   = /jpeg|jpg|png|webp|gif/i;
  const videoOk = /mp4|mov|avi|mkv|webm/i;
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
  if (imgOk.test(ext) || videoOk.test(ext)) cb(null, true);
  else cb(new Error('Only image or video files allowed'));
};

let uploadPhoto, uploadProject;

if (hasCloudinary) {
  const { CloudinaryStorage } = require('multer-storage-cloudinary');

  const photoStorage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'marcus-photography/portfolio',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ width: 1200, crop: 'limit', quality: 'auto:good' }],
    },
  });

  // Project storage accepts images AND videos (resource_type auto)
  const projectStorage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
      const isVideo = /mp4|mov|avi|mkv|webm/i.test(path.extname(file.originalname));
      return {
        folder: isVideo ? 'marcus-photography/projects/videos' : 'marcus-photography/projects',
        resource_type: isVideo ? 'video' : 'image',
        allowed_formats: isVideo
          ? ['mp4', 'mov', 'webm']
          : ['jpg', 'jpeg', 'png', 'webp'],
        ...(isVideo
          ? {}
          : { transformation: [{ width: 1600, crop: 'limit', quality: 'auto:good' }] }),
      };
    },
  });

  uploadPhoto   = multer({ storage: photoStorage,   limits: { fileSize: 15 * 1024 * 1024 }, fileFilter: imageFilter });
  uploadProject = multer({ storage: projectStorage, limits: { fileSize: 200 * 1024 * 1024 }, fileFilter: mediaFilter });
  console.log('✅ Cloudinary storage active (images + videos)');
} else {
  uploadPhoto   = multer({ storage: diskStorage, limits: { fileSize: 15 * 1024 * 1024 },  fileFilter: imageFilter });
  uploadProject = multer({ storage: diskStorage, limits: { fileSize: 200 * 1024 * 1024 }, fileFilter: mediaFilter });
  console.log('⚠️  Cloudinary not configured — using local disk storage');
}

const getFileUrl = (req, file) => {
  if (hasCloudinary) return file.path;
  return `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
};

const isVideoFile = (file) =>
  /mp4|mov|avi|mkv|webm/i.test(path.extname(file.originalname || ''));

module.exports = { cloudinary, uploadPhoto, uploadProject, getFileUrl, hasCloudinary, isVideoFile };
