const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Photo    = require('../models/Photo');
const Project  = require('../models/Project');
const Enquiry  = require('../models/Enquiry');

const seedPhotos = [
  { title: 'Golden Hour Vows',    src: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800', category: 'Wedding',    location: 'Tuscany, Italy',         featured: true },
  { title: 'Eternal Promise',     src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800', category: 'Wedding',    location: 'Santorini, Greece' },
  { title: 'Whispers at Dusk',    src: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800', category: 'Pre-wedding',location: 'Paris, France' },
  { title: 'Lovers Stroll',       src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800', category: 'Pre-wedding',location: 'Prague, Czech Republic' },
  { title: 'Grand Gala',          src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800', category: 'Events',     location: 'Mumbai, India' },
  { title: 'Corporate Summit',    src: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800', category: 'Events',     location: 'Dubai, UAE' },
  { title: 'Soul Exposed',        src: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800', category: 'Portraits',  location: 'New York, USA' },
  { title: 'Grace and Light',     src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800', category: 'Portraits',  location: 'London, UK' },
  { title: 'Mountain Solitude',   src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', category: 'Nature',     location: 'Swiss Alps' },
  { title: 'Emerald Valley',      src: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800', category: 'Nature',     location: 'New Zealand' },
  { title: 'Avant-Garde',         src: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800', category: 'Fashion',    location: 'Milan, Italy',           featured: true },
  { title: 'Urban Elegance',      src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800', category: 'Fashion',    location: 'Tokyo, Japan' },
];

const seedProjects = [
  {
    title: 'Aria & James Wedding',
    location: 'Villa Borghese, Rome',
    date: new Date('2025-03-15'),
    description: 'A breathtaking wedding ceremony set against the timeless backdrop of Rome\'s historic gardens. Every moment captured with cinematic precision.',
    cover: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1200',
    photos: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=600',
      'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=600',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600',
    ],
    category: 'Wedding',
    featured: true,
  },
  {
    title: 'Zara Fashion Campaign',
    location: 'Tokyo Street Studio',
    date: new Date('2025-02-08'),
    description: 'A bold editorial shoot blending Japanese street culture with high fashion aesthetics. Shot over three days across Shibuya and Harajuku.',
    cover: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200',
    photos: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600',
    ],
    category: 'Fashion',
    featured: true,
  },
  {
    title: 'Summit Tech Conference',
    location: 'Dubai Convention Centre',
    date: new Date('2025-01-22'),
    description: 'Full coverage of the region\'s largest tech summit. From keynotes to candid networking moments.',
    cover: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200',
    photos: [
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
    ],
    category: 'Events',
  },
];

const seedEnquiries = [
  { name: 'Priya Sharma', email: 'priya@example.com', phone: '+91 98765 43210', eventType: 'Wedding',  eventDate: new Date('2025-12-20'), message: 'Looking for full-day wedding coverage.', contacted: false },
  { name: 'Alex Chen',    email: 'alex@example.com',  phone: '+1 555 0123',     eventType: 'Fashion',  eventDate: new Date('2025-04-15'), message: 'Need editorial shots for my collection.', contacted: true  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('🔌 Connected to MongoDB');

  await Photo.deleteMany({});
  await Project.deleteMany({});
  await Enquiry.deleteMany({});
  console.log('🗑  Cleared existing data');

  await Photo.insertMany(seedPhotos);
  await Project.insertMany(seedProjects);
  await Enquiry.insertMany(seedEnquiries);
  console.log('🌱 Seed data inserted');

  await mongoose.disconnect();
  console.log('✅ Done!');
}

seed().catch(err => { console.error(err); process.exit(1); });
