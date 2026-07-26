// One-off migration: pushes the content that used to be hardcoded in the React
// sections into real Sanity documents (uploading every external image as a
// Sanity asset along the way). Safe to re-run — every document uses a fixed
// _id and createOrReplace, so re-running just updates the same records.
import { createClient } from '@sanity/client';
import { config as loadEnv } from 'dotenv';
import { readFileSync } from 'node:fs';
import path from 'node:path';

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

async function uploadLocalImage(filePath, filename, alt) {
  const buffer = readFileSync(filePath);
  const asset = await client.assets.upload('image', buffer, { filename, contentType: 'image/jpeg' });
  return { _type: 'image', asset: { _type: 'reference', _ref: asset._id }, alt };
}

/* --------------------------------------------------------------- SERVICES */

const SERVICES = [
  {
    _id: 'service-01',
    orderNumber: 1,
    title: 'Frontend Development',
    description: 'Building responsive, performant, and accessible user interfaces using modern frameworks like React, Vue, or Next.js.'
  },
  {
    _id: 'service-02',
    orderNumber: 2,
    title: 'Backend Architecture',
    description: 'Designing scalable APIs and databases using Node.js, Python, or Go to power complex web applications.'
  },
  {
    _id: 'service-03',
    orderNumber: 3,
    title: 'Product Strategy',
    description: 'Collaborating with stakeholders to define product roadmaps, user journeys, and core features that drive business value.'
  },
  {
    _id: 'service-04',
    orderNumber: 4,
    title: 'UI/UX Implementation',
    description: 'Translating high-fidelity designs into pixel-perfect, interactive web experiences with smooth animations and transitions.'
  },
  {
    _id: 'service-05',
    orderNumber: 5,
    title: 'System Integration',
    description: 'Connecting various third-party services, payment gateways, and CMS platforms into a unified product ecosystem.'
  },
];

/* ----------------------------------------------------------- EXPERIENCES */

const EXPERIENCES = [
  {
    _id: 'experience-01',
    order: 1,
    role: 'Senior Product Engineer',
    company: 'TechFlow Solutions',
    duration: '2023 - Present',
    description: 'Leading the development of core product features, optimizing performance, and architecting scalable frontend systems.'
  },
  {
    _id: 'experience-02',
    order: 2,
    role: 'Fullstack Developer',
    company: 'Innovate Digital',
    duration: '2020 - 2023',
    description: 'Built and maintained end-to-end web applications, integrating complex APIs and managing database structures.'
  },
  {
    _id: 'experience-03',
    order: 3,
    role: 'Frontend Web Developer',
    company: 'Creative Agency',
    duration: '2018 - 2020',
    description: 'Developed responsive websites with a strong focus on user experience, web accessibility, and performance optimization.'
  }
];

/* --------------------------------------------------------------- PROJECTS */

const PROJECTS = [
  {
    _id: 'project-01',
    order: 1,
    techstack: ['React', 'Next.js', 'TailwindCSS', 'TypeScript'],
    title: 'Nextlevel Studio',
    imageUrl:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85',
  },
  {
    _id: 'project-02',
    order: 2,
    techstack: ['Vue.js', 'Figma', 'Node.js'],
    title: 'Aura Brand Identity',
    imageUrl:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85',
  },
  {
    _id: 'project-03',
    order: 3,
    techstack: ['Three.js', 'WebGL', 'React'],
    title: 'Solaris Digital',
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
  eyebrow: 'Web & Product Developer',
  headline: 'Building digital\nproducts that\nscale.',
  subheadline: 'I build robust web applications focused on great user experience, performance, and clean architecture.',
  portraitUrl:
    'https://shrug-person-78902957.figma.site/_components/v2/d24c01ad3a56fc65e942a1f501eb73db42d7cf9a/Rectangle_40443.81459862.png',
  ctaLabel: 'See my work',
  ctaHref: '#projects',
};

/* ------------------------------------------------------------------ SKILLS */

const SKILLS = [
  { _id: 'skill-01', name: 'React / Next.js', category: 'Frontend', proficiency: 95, order: 1 },
  { _id: 'skill-02', name: 'TypeScript', category: 'Frontend', proficiency: 90, order: 2 },
  { _id: 'skill-03', name: 'Tailwind CSS', category: 'Frontend', proficiency: 95, order: 3 },
  { _id: 'skill-04', name: 'GSAP Animation', category: 'Frontend', proficiency: 85, order: 4 },
  { _id: 'skill-05', name: 'Vue.js', category: 'Frontend', proficiency: 80, order: 5 },

  { _id: 'skill-06', name: 'Node.js / Express', category: 'Backend', proficiency: 88, order: 1 },
  { _id: 'skill-07', name: 'PostgreSQL / Prisma', category: 'Backend', proficiency: 82, order: 2 },
  { _id: 'skill-08', name: 'REST & GraphQL APIs', category: 'Backend', proficiency: 90, order: 3 },
  { _id: 'skill-09', name: 'Sanity CMS (GROQ)', category: 'Backend', proficiency: 85, order: 4 },

  { _id: 'skill-10', name: 'Git & GitHub Workflow', category: 'Tools & DevOps', proficiency: 92, order: 1 },
  { _id: 'skill-11', name: 'Docker / Dokploy', category: 'Tools & DevOps', proficiency: 78, order: 2 },
  { _id: 'skill-12', name: 'Figma to Code', category: 'Tools & DevOps', proficiency: 90, order: 3 },
  { _id: 'skill-13', name: 'Vite / Webpack', category: 'Tools & DevOps', proficiency: 85, order: 4 },
];

const CV_DATA = {
  fullName: 'Wibisana',
  jobTitle: 'Senior Frontend & Web Developer',
  phone: '+62 812-3456-7890',
  location: 'Jakarta, Indonesia',
  website: 'https://wibisana.dev',
  summary: 'Experienced Web Developer with 5+ years of expertise in building high-performance, accessible, and interactive web applications using React, TypeScript, and modern frontend tools. Strong background in UI design systems and headless CMS integrations.',
  education: [
    {
      _key: 'edu-1',
      degree: 'B.S. in Computer Science',
      institution: 'State University',
      year: '2016 - 2020',
      description: 'Graduated with Honors. Focused on Software Engineering and Web Technologies.',
    },
  ],
  certifications: [
    {
      _key: 'cert-1',
      name: 'AWS Certified Cloud Practitioner',
      issuer: 'Amazon Web Services',
      year: '2023',
    },
    {
      _key: 'cert-2',
      name: 'Meta Front-End Developer Professional Certificate',
      issuer: 'Coursera / Meta',
      year: '2022',
    },
  ],
  languages: [
    { _key: 'lang-1', language: 'Indonesian', level: 'Native' },
    { _key: 'lang-2', language: 'English', level: 'Full Professional' },
  ],
  showDownloadButton: true,
};

/* ----------------------------------------------------------------- ABOUT */

const ABOUT = {
  heading: 'About me',
  body: "With over 5 years of experience in web development, I focus on building products that solve real problems. I truly enjoy translating complex requirements into simple, beautiful, and performant web applications. Let's build something incredible together!",
  imageUrl: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png',
  stats: [
    { value: '5+', label: 'Years Experience' },
    { value: '40+', label: 'Products Shipped' },
  ]
};

async function run() {
  console.log(`Seeding dataset "${dataset}" on project "${projectId}"\n`);

  console.log('Services:');
  for (const doc of SERVICES) {
    await client.createOrReplace({ _type: 'service', ...doc });
    console.log(`  ✓ ${doc._id}`);
  }

  console.log('\nSkills:');
  const skillDocs = [];
  for (const s of SKILLS) {
    await client.createOrReplace({ _type: 'skill', ...s });
    skillDocs.push(s);
    console.log(`  ✓ ${s._id} (${s.name})`);
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
      techstack: p.techstack,
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

  console.log('\nBranding assets:');
  const logoPath = path.join(process.cwd(), 'public', 'wblogo.jpg');
  const logo = await uploadLocalImage(logoPath, 'wblogo.jpg', 'WIBISANA Logo');

  console.log('\nLanding page singleton:');
  await client.createOrReplace({
    _id: 'landingPage',
    _type: 'landingPage',
    branding: {
      logo,
      favicon: logo,
    },
    preloader: {
      enabled: true,
      wordmark: 'WIBISANA',
      durationMs: 2000
    },
    navigation: {
      links: [
        { _key: 'n1', label: 'About', url: '#about' },
        { _key: 'n2', label: 'Services', url: '#services' },
        { _key: 'n3', label: 'Projects', url: '#projects' }
      ]
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
    skills: {
      heading: 'Skills & Expertise',
      skills: SKILLS.map((s) => ({ _type: 'reference', _ref: s._id, _key: s._id })),
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
    cv: CV_DATA,
    seo: {
      title: 'Wibi | Web & Product Developer',
      description: 'I build robust web applications focused on great user experience, performance, and clean architecture.',
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
