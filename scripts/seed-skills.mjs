// Seed script for Sanity CMS Skills section & CV settings
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

/* ----------------------------------------------------------------- SKILLS DATA */

const SKILLS = [
  // Frontend
  { _id: 'skill-01', name: 'React / Next.js', category: 'Frontend', proficiency: 95, order: 1 },
  { _id: 'skill-02', name: 'TypeScript', category: 'Frontend', proficiency: 90, order: 2 },
  { _id: 'skill-03', name: 'Tailwind CSS', category: 'Frontend', proficiency: 95, order: 3 },
  { _id: 'skill-04', name: 'GSAP Animation', category: 'Frontend', proficiency: 85, order: 4 },
  { _id: 'skill-05', name: 'Vue.js', category: 'Frontend', proficiency: 80, order: 5 },

  // Backend
  { _id: 'skill-06', name: 'Node.js / Express', category: 'Backend', proficiency: 88, order: 1 },
  { _id: 'skill-07', name: 'PostgreSQL / Prisma', category: 'Backend', proficiency: 82, order: 2 },
  { _id: 'skill-08', name: 'REST & GraphQL APIs', category: 'Backend', proficiency: 90, order: 3 },
  { _id: 'skill-09', name: 'Sanity CMS (GROQ)', category: 'Backend', proficiency: 85, order: 4 },

  // Tools & Others
  { _id: 'skill-10', name: 'Git & GitHub Workflow', category: 'Tools & DevOps', proficiency: 92, order: 1 },
  { _id: 'skill-11', name: 'Docker / Dokploy', category: 'Tools & DevOps', proficiency: 78, order: 2 },
  { _id: 'skill-12', name: 'Figma to Code', category: 'Tools & DevOps', proficiency: 90, order: 3 },
  { _id: 'skill-13', name: 'Vite / Webpack', category: 'Tools & DevOps', proficiency: 85, order: 4 },
];

/* ------------------------------------------------------------------ CV DATA */

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

async function run() {
  console.log(`Seeding skills & CV data to dataset "${dataset}" on project "${projectId}"\n`);

  console.log('Skills:');
  const skillRefs = [];
  for (const skill of SKILLS) {
    await client.createOrReplace({
      _type: 'skill',
      ...skill,
    });
    skillRefs.push({ _type: 'reference', _ref: skill._id, _key: skill._id });
    console.log(`  ✓ ${skill._id} (${skill.name} - ${skill.category})`);
  }

  console.log('\nUpdating landingPage document with skills & CV data:');
  await client
    .patch('landingPage')
    .set({
      skills: {
        heading: 'Skills & Expertise',
        skills: skillRefs,
      },
      cv: CV_DATA,
    })
    .commit();

  console.log('  ✓ landingPage updated');
  console.log('\nSuccess! All skills and CV seed data have been pushed to Sanity CMS.');
}

run().catch((err) => {
  console.error('\nSeed failed:', err.message);
  process.exit(1);
});
