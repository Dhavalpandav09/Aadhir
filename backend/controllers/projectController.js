const Project = require('../models/Project');
const { cloudinary, getFileUrl, hasCloudinary, isVideoFile } = require('../config/cloudinary');

const toBool = (v) => {
  if (v === undefined || v === null) return undefined;
  if (typeof v === 'boolean') return v;
  return String(v).toLowerCase() === 'true';
};

// Helper: parse YouTube / Vimeo embed URLs
const detectVideoType = (url) => {
  if (!url) return 'upload';
  if (/youtube\.com|youtu\.be/i.test(url)) return 'youtube';
  if (/vimeo\.com/i.test(url))             return 'vimeo';
  return 'upload';
};

const toEmbedUrl = (url) => {
  if (!url) return url;
  // YouTube short → embed
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  // Vimeo → embed
  const vmMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vmMatch) return `https://player.vimeo.com/video/${vmMatch[1]}`;
  return url;
};

// ── GET /api/projects  (public — published only) ──────────────────────────────
const getProjects = async (req, res) => {
  try {
    const { featured, category, limit = 20, page = 1 } = req.query;
    const filter = { published: true };
    if (featured === 'true') filter.featured = true;
    if (category)            filter.category = category;

    const skip = (Number(page) - 1) * Number(limit);
    const [projects, total] = await Promise.all([
      Project.find(filter).sort({ date: -1 }).skip(skip).limit(Number(limit)),
      Project.countDocuments(filter),
    ]);
    res.json({ projects, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// ── GET /api/projects/admin/all  (admin — all including drafts) ───────────────
const getAllProjects = async (req, res) => {
  try {
    const { limit = 100, page = 1 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const [projects, total] = await Promise.all([
      Project.find({}).sort({ date: -1 }).skip(skip).limit(Number(limit)),
      Project.countDocuments({}),
    ]);
    res.json({ projects, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// ── GET /api/projects/:id  (public) ──────────────────────────────────────────
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// ── POST /api/projects  (admin) ───────────────────────────────────────────────
const createProject = async (req, res) => {
  try {
    const { title, location, date, description, category } = req.body;
    const featured  = toBool(req.body.featured) ?? false;
    const published = toBool(req.body.published) ?? true;

    if (!title)       return res.status(400).json({ error: 'Title is required' });
    if (!location)    return res.status(400).json({ error: 'Location is required' });
    if (!date)        return res.status(400).json({ error: 'Date is required' });
    if (!description) return res.status(400).json({ error: 'Description is required' });

    // ── Cover image (file upload OR URL) ──
    let cover = req.body.coverUrl ? req.body.coverUrl.trim() : '';
    let coverCloudinaryId = '';

    if (req.files?.cover?.[0]) {
      cover             = getFileUrl(req, req.files.cover[0]);
      coverCloudinaryId = req.files.cover[0].filename || '';
    }
    if (!cover) return res.status(400).json({ error: 'Cover image is required — upload a file or provide a URL' });

    // ── Gallery photos (uploaded files) ──
    let photos = [], photoCloudinaryIds = [];
    if (req.files?.photos) {
      const imgFiles = req.files.photos.filter(f => !isVideoFile(f));
      photos             = imgFiles.map(f => getFileUrl(req, f));
      photoCloudinaryIds = imgFiles.map(f => f.filename || '');
    }
    // Also accept comma-separated photo URLs
    if (req.body.photoUrls) {
      const extra = req.body.photoUrls.split(',').map(u => u.trim()).filter(Boolean);
      photos = [...photos, ...extra];
    }

    // ── Videos ──
    let videos = [];

    // Uploaded video files
    if (req.files?.videos) {
      const vidFiles = req.files.videos;
      videos = vidFiles.map(f => ({
        url:          getFileUrl(req, f),
        title:        f.originalname || 'Video',
        type:         'upload',
        cloudinaryId: f.filename || '',
      }));
    }

    // Also videos from the photos field that happened to be video files
    if (req.files?.photos) {
      const vidFiles = req.files.photos.filter(f => isVideoFile(f));
      vidFiles.forEach(f => {
        videos.push({ url: getFileUrl(req, f), title: f.originalname || 'Video', type: 'upload', cloudinaryId: f.filename || '' });
      });
    }

    // YouTube / Vimeo embed URLs (comma-separated)
    if (req.body.videoUrls) {
      const urls = req.body.videoUrls.split(',').map(u => u.trim()).filter(Boolean);
      urls.forEach(url => {
        videos.push({ url: toEmbedUrl(url), title: '', type: detectVideoType(url), cloudinaryId: '' });
      });
    }

    const project = await Project.create({
      title, location, date, description, category,
      featured, published,
      cover, coverCloudinaryId,
      photos, photoCloudinaryIds,
      videos,
    });

    res.status(201).json(project);
  } catch (err) {
    console.error('createProject error:', err);
    res.status(500).json({ error: err.message });
  }
};

// ── PUT /api/projects/:id  (admin) ────────────────────────────────────────────
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    if (req.body.title       !== undefined) project.title       = req.body.title;
    if (req.body.location    !== undefined) project.location    = req.body.location;
    if (req.body.date        !== undefined) project.date        = req.body.date;
    if (req.body.description !== undefined) project.description = req.body.description;
    if (req.body.category    !== undefined) project.category    = req.body.category;
    if (req.body.featured    !== undefined) project.featured    = toBool(req.body.featured);
    if (req.body.published   !== undefined) project.published   = toBool(req.body.published);

    // Replace cover
    if (req.files?.cover?.[0]) {
      if (hasCloudinary && project.coverCloudinaryId) {
        try { await cloudinary.uploader.destroy(project.coverCloudinaryId); } catch (_) {}
      }
      project.cover             = getFileUrl(req, req.files.cover[0]);
      project.coverCloudinaryId = req.files.cover[0].filename || '';
    } else if (req.body.coverUrl?.trim()) {
      project.cover = req.body.coverUrl.trim();
      project.coverCloudinaryId = '';
    }

    // Append new gallery photos
    if (req.files?.photos) {
      const imgFiles = req.files.photos.filter(f => !isVideoFile(f));
      project.photos             = [...(project.photos || []),             ...imgFiles.map(f => getFileUrl(req, f))];
      project.photoCloudinaryIds = [...(project.photoCloudinaryIds || []), ...imgFiles.map(f => f.filename || '')];

      // Uploaded videos mixed in the photos field
      const vidFiles = req.files.photos.filter(f => isVideoFile(f));
      vidFiles.forEach(f => {
        project.videos.push({ url: getFileUrl(req, f), title: f.originalname || 'Video', type: 'upload', cloudinaryId: f.filename || '' });
      });
    }

    // Append uploaded video files
    if (req.files?.videos) {
      req.files.videos.forEach(f => {
        project.videos.push({ url: getFileUrl(req, f), title: f.originalname || 'Video', type: 'upload', cloudinaryId: f.filename || '' });
      });
    }

    // Append embed URLs
    if (req.body.videoUrls) {
      const urls = req.body.videoUrls.split(',').map(u => u.trim()).filter(Boolean);
      urls.forEach(url => {
        project.videos.push({ url: toEmbedUrl(url), title: '', type: detectVideoType(url), cloudinaryId: '' });
      });
    }

    await project.save();
    res.json(project);
  } catch (err) {
    console.error('updateProject error:', err);
    res.status(500).json({ error: err.message });
  }
};

// ── DELETE /api/projects/:id  (admin) ─────────────────────────────────────────
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    if (hasCloudinary) {
      const ids = [
        project.coverCloudinaryId,
        ...(project.photoCloudinaryIds || []),
        ...(project.videos || []).map(v => v.cloudinaryId).filter(Boolean),
      ].filter(Boolean);
      await Promise.allSettled(ids.map(id => cloudinary.uploader.destroy(id)));
    }

    await project.deleteOne();
    res.json({ message: 'Project deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

module.exports = { getProjects, getAllProjects, getProjectById, createProject, updateProject, deleteProject };
