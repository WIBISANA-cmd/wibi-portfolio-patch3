// One-off migration: pushes the content that used to be hardcoded in the React
// sections into real Sanity documents (uploading every external image as a
// Sanity asset along the way). Safe to re-run — every document uses a fixed
// _id and createOrReplace, so re-running just updates the same records.
import { createClient } from '@sanity/client';
import { config as loadEnv } from 'dotenv';

loadEnv();

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET || process.env.VITE_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_TOKEN;

if (!projectId) {
  console.error('Missing SANITY_STUDIO_PROJECT_ID / VITE_SANITY_PROJECT_ID in .env');
  process.exit(1);
}
if (!token) {
  console.error(
    'Missing SANITY_API_TOKEN in .env — create one at https://sanity.io/manage ' +
      '(project → API → Tokens → Add API token, role "Editor" or "Administrator").'
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-10-01',
  token,
  useCdn: false,
});

const assetCache = new Map();

async function uploadImage(url, filename, alt) {
  if (assetCache.has(url)) return { ...assetCache.get(url), alt };
  console.log(`  uploading ${filename} ...`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const contentType = res.headers.get('content-type') || 'image/png';
  const asset = await client.assets.upload('image', buffer, { filename, contentType });
  const ref = { _type: 'image', asset: { _type: 'reference', _ref: asset._id } };
  assetCache.set(url, ref);
  return { ...ref, alt };
}

/* --------------------------------------------------------------- SERVICES */

const SERVICES = [
  {
    _id: 'service-01',
    orderNumber: 1,
    title: '3D Modeling',
    description:
      'Creation of detailed objects, characters, or environments tailored to specific client needs, ideal for games, products, and visualizations.',
  },
  {
    _id: 'service-02',
    orderNumber: 2,
    title: 'Rendering',
    description:
      'High-quality, photorealistic renders that showcase designs with custom lighting, textures, and materials to bring concepts to life.',
  },
  {
    _id: 'service-03',
    orderNumber: 3,
    title: 'Motion Design',
    description:
      'Dynamic animations and motion graphics that add energy and storytelling to brands, products, and digital experiences.',
  },
  {
    _id: 'service-04',
    orderNumber: 4,
    title: 'Branding',
    description:
      'Crafting cohesive visual identities — from logos to full brand systems — that communicate a clear and memorable presence.',
  },
  {
    _id: 'service-05',
    orderNumber: 5,
    title: 'Web Design',
    description:
      'Designing clean, modern, and conversion-focused websites with attention to layout, typography, and user experience.',
  },
];

/* ----------------------------------------------------------- EXPERIENCES */

const EXPERIENCES = [
  {
    _id: 'experience-01',
    order: 1,
    role: 'Senior Motion Designer',
    company: 'Nextlevel Studio',
    duration: '2023 - Present',
    description: 'Leading motion design projects, collaborating with cross-functional teams to deliver high-quality animations and visual effects.'
  },
  {
    _id: 'experience-02',
    order: 2,
    role: '3D Artist',
    company: 'Aura Agency',
    duration: '2021 - 2023',
    description: 'Created 3D models and environments for various commercial projects and games.'
  },
  {
    _id: 'experience-03',
    order: 3,
    role: 'Web Designer',
    company: 'Freelance',
    duration: '2019 - 2021',
    description: 'Designed and developed websites for small businesses, focusing on user experience and brand identity.'
  }
];

/* --------------------------------------------------------------- PROJECTS */

const PROJECTS = [
  {
    _id: 'project-01',
    order: 1,
    category: 'Client',
    title: 'Nextlevel Studio',
    year: '2023',
    imageUrl:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85',
  },
  {
    _id: 'project-02',
    order: 2,
    category: 'Personal',
    title: 'Aura Brand Identity',
    year: '2024',
    imageUrl:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85',
  },
  {
    _id: 'project-03',
    order: 3,
    category: 'Client',
    title: 'Solaris Digital',
    year: '2024',
    imageUrl:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85',
  },
];

/* --------------------------------------------------------------- MARQUEE */

const MARQUEE_IMAGES = [
  'https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif',
  'https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif',
  'https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif',
  'https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif',
  'https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif',
  'https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif',
  'https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif',
  'https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif',
];


/* ------------------------------------------------------------------ HERO */

const HERO = {
  eyebrow: 'Design & Motion Studio',
  headline: 'Hi, I’m Wibi',
  subheadline: 'A digital creator driven by crafting striking and unforgettable interactive experiences.',
  portraitUrl:
    'https://shrug-person-78902957.figma.site/_components/v2/d24c01ad3a56fc65e942a1f501eb73db42d7cf9a/Rectangle_40443.81459862.png',
  ctaLabel: 'See my work',
  ctaHref: '#projects',
};

/* ----------------------------------------------------------------- ABOUT */

const ABOUT = {
  heading: 'About me',
  body: "With more than five years of experience in design, I focus on branding, web design, and user experience. I truly enjoy working with businesses that aim to stand out and present their best image. Let's build something incredible together!",
  imageUrl: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png',
  stats: [
    { value: '5+', label: 'Years Experience' },
    { value: '40+', label: 'Projects Completed' },
  ]
};

async function run() {
  console.log(`Seeding dataset "${dataset}" on project "${projectId}"\n`);

  console.log('Services:');
  for (const doc of SERVICES) {
    await client.createOrReplace({ _type: 'service', ...doc });
    console.log(`  ✓ ${doc._id}`);
  }

  console.log('\nExperiences:');
  for (const doc of EXPERIENCES) {
    await client.createOrReplace({ _type: 'experience', ...doc });
    console.log(`  ✓ ${doc._id}`);
  }

  console.log('\nProjects (uploading images, this can take a moment):');
  const projectDocs = [];
  for (const p of PROJECTS) {
    const image = await uploadImage(p.imageUrl, `${p._id}-thumb.webp`, p.title);
    const doc = {
      _id: p._id,
      _type: 'project',
      order: p.order,
      category: p.category,
      year: p.year,
      title: p.title,
      image,
    };
    await client.createOrReplace(doc);
    projectDocs.push(doc);
    console.log(`  ✓ ${p._id} (${p.title})`);
  }

  console.log('\nMarquee tiles (uploading GIFs):');
  const marqueeDocs = [];
  for (let i = 0; i < MARQUEE_IMAGES.length; i++) {
    const id = `marquee-${String(i + 1).padStart(2, '0')}`;
    const image = await uploadImage(MARQUEE_IMAGES[i], `${id}.gif`, 'Marquee thumbnail');
    const doc = { _id: id, _type: 'marqueeImage', label: id, image };
    await client.createOrReplace(doc);
    marqueeDocs.push(doc);
    console.log(`  ✓ ${id}`);
  }

  console.log('\nHero + About assets:');
  const portrait = await uploadImage(HERO.portraitUrl, 'hero-portrait.png', 'Wibi Portrait');
  const aboutMedia = await uploadImage(ABOUT.imageUrl, 'about-media.png', 'About Media Image');
  
  console.log('\nLanding page singleton:');
  await client.createOrReplace({
    _id: 'landingPage',
    _type: 'landingPage',
    preloader: {
      enabled: true,
      wordmark: 'WIBISANA',
      durationMs: 2000
    },
    hero: {
      eyebrow: HERO.eyebrow,
      headline: HERO.headline,
      subheadline: HERO.subheadline,
      backgroundImage: portrait,
      ctaLabel: HERO.ctaLabel,
      ctaHref: HERO.ctaHref,
    },
    marquee: {
      items: marqueeDocs.map((m) => ({ _type: 'reference', _ref: m._id, _key: m._id })),
    },
    about: {
      heading: ABOUT.heading,
      body: ABOUT.body,
      image: aboutMedia,
      stats: ABOUT.stats,
    },
    services: {
      services: SERVICES.map((s) => ({ _type: 'reference', _ref: s._id, _key: s._id })),
    },
    experiences: {
      heading: 'Work Experience',
      experiences: EXPERIENCES.map((e) => ({ _type: 'reference', _ref: e._id, _key: e._id })),
    },
    projects: {
      projects: projectDocs.map((p) => ({ _type: 'reference', _ref: p._id, _key: p._id })),
    },
    contact: {
      heading: 'Let’s work together',
      email: 'hello@wibisana.com',
      socials: [
        { _key: 'tw', label: 'Twitter', url: 'https://twitter.com' },
        { _key: 'in', label: 'LinkedIn', url: 'https://linkedin.com' },
        { _key: 'ig', label: 'Instagram', url: 'https://instagram.com' }
      ]
    },
    footer: {
      tagline: 'Wibisana',
      copyright: '© 2026 Wibisana. All rights reserved.',
      links: [
        { _key: 'l1', label: 'Privacy Policy', url: '#' },
        { _key: 'l2', label: 'Terms of Service', url: '#' }
      ]
    },
    seo: {
      title: 'Wibi | Design & Motion Studio',
      description: 'A digital creator driven by crafting striking and unforgettable interactive experiences.',
      ogImage: portrait
    }
  });
  console.log('  ✓ landingPage');

  console.log('\nDone. Open the Studio (npm run studio) to review/edit the seeded content.');
}

run().catch((err) => {
  console.error('\nSeed failed:', err.message);
  process.exit(1);
});
