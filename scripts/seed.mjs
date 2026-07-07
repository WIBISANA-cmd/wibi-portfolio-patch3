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

async function uploadImage(url, filename) {
  if (assetCache.has(url)) return assetCache.get(url);
  console.log(`  uploading ${filename} ...`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const contentType = res.headers.get('content-type') || 'image/png';
  const asset = await client.assets.upload('image', buffer, { filename, contentType });
  const ref = { _type: 'image', asset: { _type: 'reference', _ref: asset._id } };
  assetCache.set(url, ref);
  return ref;
}

/* --------------------------------------------------------------- SERVICES */

const SERVICES = [
  {
    _id: 'service-01',
    number: '01',
    name: '3D Modeling',
    description:
      'Creation of detailed objects, characters, or environments tailored to specific client needs, ideal for games, products, and visualizations.',
  },
  {
    _id: 'service-02',
    number: '02',
    name: 'Rendering',
    description:
      'High-quality, photorealistic renders that showcase designs with custom lighting, textures, and materials to bring concepts to life.',
  },
  {
    _id: 'service-03',
    number: '03',
    name: 'Motion Design',
    description:
      'Dynamic animations and motion graphics that add energy and storytelling to brands, products, and digital experiences.',
  },
  {
    _id: 'service-04',
    number: '04',
    name: 'Branding',
    description:
      'Crafting cohesive visual identities — from logos to full brand systems — that communicate a clear and memorable presence.',
  },
  {
    _id: 'service-05',
    number: '05',
    name: 'Web Design',
    description:
      'Designing clean, modern, and conversion-focused websites with attention to layout, typography, and user experience.',
  },
];

/* --------------------------------------------------------------- PROJECTS */

const PROJECTS = [
  {
    _id: 'project-01',
    number: '01',
    projectType: 'Client',
    title: 'Nextlevel Studio',
    images: {
      col1_image1:
        'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85',
      col1_image2:
        'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85',
      col2_image:
        'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85',
    },
  },
  {
    _id: 'project-02',
    number: '02',
    projectType: 'Personal',
    title: 'Aura Brand Identity',
    images: {
      col1_image1:
        'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85',
      col1_image2:
        'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85',
      col2_image:
        'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85',
    },
  },
  {
    _id: 'project-03',
    number: '03',
    projectType: 'Client',
    title: 'Solaris Digital',
    images: {
      col1_image1:
        'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85',
      col1_image2:
        'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85',
      col2_image:
        'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85',
    },
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
  'https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif',
  'https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif',
  'https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif',
  'https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif',
  'https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif',
  'https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif',
  'https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif',
  'https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif',
  'https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif',
  'https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif',
  'https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif',
  'https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif',
  'https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif',
];

const ROW_1_COUNT = 11; // matches the front-end's slice(0, 11) / slice(11)

/* ------------------------------------------------------------------ HERO */

const HERO = {
  navLinks: ['About', 'Price', 'Projects', 'Contact'],
  heading: 'Hi, i’m wibi',
  description: 'a 3d creator driven by crafting striking and unforgettable projects',
  portraitUrl:
    'https://shrug-person-78902957.figma.site/_components/v2/d24c01ad3a56fc65e942a1f501eb73db42d7cf9a/Rectangle_40443.81459862.png',
};

/* ----------------------------------------------------------------- ABOUT */

const ABOUT = {
  title: 'About me',
  paragraph:
    "With more than five years of experience in design, i focus on branding, web design, and user experience, i truly enjoy working with businesses that aim to stand out and present their best image. Let's build something incredible together!",
  moonUrl:
    'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png',
  legoUrl:
    'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png',
  object1Url:
    'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png',
  group1Url:
    'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png',
};

async function run() {
  console.log(`Seeding dataset "${dataset}" on project "${projectId}"\n`);

  console.log('Services:');
  for (const doc of SERVICES) {
    await client.createOrReplace({ _type: 'service', ...doc });
    console.log(`  ✓ ${doc._id}`);
  }

  console.log('\nProjects (uploading images, this can take a moment):');
  const projectDocs = [];
  for (const p of PROJECTS) {
    const images = {
      col1_image1: await uploadImage(p.images.col1_image1, `${p._id}-col1-1.webp`),
      col1_image2: await uploadImage(p.images.col1_image2, `${p._id}-col1-2.webp`),
      col2_image: await uploadImage(p.images.col2_image, `${p._id}-col2.webp`),
    };
    const doc = {
      _id: p._id,
      _type: 'project',
      number: p.number,
      projectType: p.projectType,
      title: p.title,
      images,
    };
    await client.createOrReplace(doc);
    projectDocs.push(doc);
    console.log(`  ✓ ${p._id} (${p.title})`);
  }

  console.log('\nMarquee tiles (uploading GIFs):');
  const marqueeDocs = [];
  for (let i = 0; i < MARQUEE_IMAGES.length; i++) {
    const id = `marquee-${String(i + 1).padStart(2, '0')}`;
    const image = await uploadImage(MARQUEE_IMAGES[i], `${id}.gif`);
    const doc = { _id: id, _type: 'marqueeImage', title: id, image };
    await client.createOrReplace(doc);
    marqueeDocs.push(doc);
    console.log(`  ✓ ${id}`);
  }
  const row1Docs = marqueeDocs.slice(0, ROW_1_COUNT);
  const row2Docs = marqueeDocs.slice(ROW_1_COUNT);

  console.log('\nHero + About assets:');
  const portrait = await uploadImage(HERO.portraitUrl, 'hero-portrait.png');
  const moonIcon = await uploadImage(ABOUT.moonUrl, 'about-moon.png');
  const legoIcon = await uploadImage(ABOUT.legoUrl, 'about-lego.png');
  const object1 = await uploadImage(ABOUT.object1Url, 'about-object1.png');
  const group1 = await uploadImage(ABOUT.group1Url, 'about-group1.png');

  console.log('\nLanding page singleton:');
  await client.createOrReplace({
    _id: 'landingPage',
    _type: 'landingPage',
    hero: {
      navLinks: HERO.navLinks,
      heading: HERO.heading,
      description: HERO.description,
      portrait,
    },
    about: {
      title: ABOUT.title,
      paragraph: ABOUT.paragraph,
      moonIcon,
      legoIcon,
      object1,
      group1,
    },
    services: {
      title: 'Services',
      items: SERVICES.map((s) => ({ _type: 'reference', _ref: s._id, _key: s._id })),
    },
    projects: {
      title: 'Project',
      items: projectDocs.map((p) => ({ _type: 'reference', _ref: p._id, _key: p._id })),
    },
    marquee: {
      row1: row1Docs.map((m) => ({ _type: 'reference', _ref: m._id, _key: m._id })),
      row2: row2Docs.map((m) => ({ _type: 'reference', _ref: m._id, _key: m._id })),
    },
  });
  console.log('  ✓ landingPage');

  console.log('\nDone. Open the Studio (npm run studio) to review/edit the seeded content.');
}

run().catch((err) => {
  console.error('\nSeed failed:', err.message);
  process.exit(1);
});
