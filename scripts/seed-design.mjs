// Fills the fields added for the portfolio redesign (hero background word,
// availability badge, quote panel, section headings, service icons …).
// Uses setIfMissing everywhere: anything already filled in the Studio is left
// untouched, so it is safe to re-run. Edit the values below or in the Studio.
import { createClient } from '@sanity/client';
import { config as loadEnv } from 'dotenv';

loadEnv();

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET || process.env.VITE_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !token) {
  console.error('Missing SANITY_STUDIO_PROJECT_ID / VITE_SANITY_PROJECT_ID or SANITY_API_TOKEN in .env');
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: '2024-10-01', token, useCdn: false });

const LANDING = {
  'navigation.label': 'Web Developer',
  'navigation.sublabel': 'Product Oriented',
  'hero.backgroundWord': 'PORTFOLIO',
  'hero.name': 'Dwi Agus\nWibisana',
  'hero.locationNote': 'Available worldwide',
  'hero.tagline': 'Turning ideas into powerful digital experiences.',
  'hero.availability': 'Available for freelance',
  'projects.heading': 'Selected Projects',
  'projects.featuredCount': 3,
  'projects.viewAllLabel': 'View all projects',
  'projects.showLessLabel': 'Show less',
  'skills.educationHeading': 'Education',
  'skills.skillsHeading': 'Skills',
  'services.heading': 'Services',
  'quote.text': 'Good design is not just how it looks, but how it works.',
  'quote.signature': 'Wibi',
  'quote.footnote': "Let's create something great together.",
  'contact.note': "I'm currently open for new projects and collaborations. Let's create something amazing that drives results.",
  'cv.buttonLabel': 'Download CV',
};

/** Icons for the services, in the order they appear on the landing page. */
const SERVICE_ICONS = ['code', 'monitor', 'server', 'design', 'launch'];

/** Indonesian phrases for the new UI strings (added only when missing). */
const ID_ENTRIES = {
  'Web Developer': 'Web Developer',
  'Product Oriented': 'Berorientasi Produk',
  'Available worldwide': 'Tersedia di seluruh dunia',
  'Turning ideas into powerful digital experiences.': 'Mengubah ide menjadi pengalaman digital yang kuat.',
  'Available for freelance': 'Tersedia untuk freelance',
  'View all projects': 'Lihat semua proyek',
  'Show less': 'Tampilkan lebih sedikit',
  Education: 'Pendidikan',
  Skills: 'Keahlian',
  'Good design is not just how it looks, but how it works.':
    'Desain yang baik bukan hanya soal tampilan, tetapi bagaimana ia bekerja.',
  "Let's create something great together.": 'Mari ciptakan sesuatu yang hebat bersama.',
  "I'm currently open for new projects and collaborations. Let's create something amazing that drives results.":
    'Saat ini saya terbuka untuk proyek dan kolaborasi baru. Mari ciptakan sesuatu yang luar biasa dan berdampak.',
  'Close menu': 'Tutup menu',
};

async function main() {
  // Parent objects must exist before nested setIfMissing paths can apply.
  const parents = {};
  for (const path of Object.keys(LANDING)) parents[path.split('.')[0]] = {};

  await client.patch('landingPage').setIfMissing(parents).commit();
  await client.patch('landingPage').setIfMissing(LANDING).commit();
  console.log('✓ landingPage: new design fields filled where empty');

  const serviceIds = await client.fetch(`*[_type == "landingPage"][0].services.services[]._ref`);
  if (serviceIds?.length) {
    const tx = client.transaction();
    serviceIds.forEach((id, i) => {
      if (SERVICE_ICONS[i]) tx.patch(id, (p) => p.setIfMissing({ icon: SERVICE_ICONS[i] }));
    });
    await tx.commit();
    console.log(`✓ services: icons set on ${Math.min(serviceIds.length, SERVICE_ICONS.length)} item(s) where empty`);
  }

  const idDoc = await client.fetch(`*[_type == "translation" && language == "id"][0]{ _id, entries }`);
  if (idDoc) {
    const existing = new Set((idDoc.entries ?? []).map((e) => e.from?.trim()));
    const additions = Object.entries(ID_ENTRIES)
      .filter(([from]) => !existing.has(from))
      .map(([from, to], i) => ({ _key: `design-${Date.now()}-${i}`, from, to }));
    if (additions.length) {
      await client.patch(idDoc._id).setIfMissing({ entries: [] }).append('entries', additions).commit();
    }
    console.log(`✓ translation (id): ${additions.length} phrase(s) added`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
