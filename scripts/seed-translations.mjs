// Seeds the Indonesian dictionary used by the language switcher.
// Every row maps one exact English phrase (as authored in Sanity) to its
// Indonesian text. Anything not listed here keeps its English wording.
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

const client = createClient({ projectId, dataset, apiVersion: '2024-10-01', token, useCdn: false });

// Keys mirror the English text currently published in the dataset. Edit further
// rows in the Studio (Content → Translation) — no redeploy needed.
const ID = {
  /* --------------------------------------------------------------- static UI */
  Contact: 'Kontak',
  Menu: 'Menu',
  Services: 'Layanan',
  Socials: 'Media Sosial',
  'Drop a line': 'Kirim pesan',
  'Selected Projects': 'Proyek Pilihan',
  'View Project': 'Lihat Proyek',
  'Coming Soon': 'Segera Hadir',
  'Download CV': 'Unduh CV',
  'Generating…': 'Membuat…',
  'Interested in my full resume?': 'Tertarik dengan resume lengkap saya?',
  'Download my ATS-friendly CV as PDF.': 'Unduh CV ramah-ATS saya dalam format PDF.',

  /* -------------------------------------------------------------- navigation */
  About: 'Tentang',
  Projects: 'Proyek',

  /* -------------------------------------------------------------------- hero */
  'Web & Product Oriented Developer': 'Web & Product Oriented Developer',
  "Hi, I'm Wibi.": 'Halo, saya Wibi.',
  'A comprehensive approach to web development, engineering robust backends and dynamic, interactive user interfaces.':
    'Pendekatan menyeluruh dalam pengembangan web, merancang backend yang tangguh serta antarmuka pengguna yang dinamis dan interaktif.',
  'See my work': 'Lihat karya saya',

  /* ------------------------------------------------------------------- about */
  'About me': 'Tentang saya',
  "With over 3 years of experience in web development, I focus on building products that solve real problems. As a product-oriented developer, my primary focus is bridging business needs and technical logic into elegant web solutions. I'm accustomed to managing the development pipeline from initial concept to release, ensuring every line of code written has a tangible impact on both users and system scalability.":
    'Dengan pengalaman lebih dari 3 tahun di pengembangan web, saya fokus membangun produk yang menyelesaikan masalah nyata. Sebagai developer yang berorientasi produk, fokus utama saya adalah menjembatani kebutuhan bisnis dan logika teknis menjadi solusi web yang elegan. Saya terbiasa mengelola alur pengembangan dari konsep awal hingga rilis, memastikan setiap baris kode yang ditulis berdampak nyata bagi pengguna maupun skalabilitas sistem.',
  'Years Experience': 'Tahun Pengalaman',
  'Products Shipped': 'Produk Diluncurkan',

  /* ---------------------------------------------------------------- services */
  'End-to-End Product Engineering': 'Rekayasa Produk End-to-End',
  'Architecting robust backends and stunning, interactive front-ends to deliver a complete, high-performance product experience.':
    'Merancang backend yang tangguh dan front-end interaktif yang memikat untuk menghadirkan pengalaman produk yang utuh dan berperforma tinggi.',
  'Next-Generation Web Interfaces': 'Antarmuka Web Generasi Terbaru',
  'Crafting fast, accessible, and visually striking applications with modern frameworks and pixel-perfect attention to detail.':
    'Membangun aplikasi yang cepat, mudah diakses, dan memikat secara visual dengan framework modern serta perhatian detail yang presisi.',
  'Tailored System Architecture': 'Arsitektur Sistem yang Disesuaikan',
  'Designing secure, scalable server-side foundations that power reliable and data-driven digital products.':
    'Merancang fondasi sisi server yang aman dan skalabel untuk menopang produk digital yang andal dan berbasis data.',
  'Elevating Digital Experiences': 'Meningkatkan Pengalaman Digital',
  'Bridging the gap between complex technical requirements and sleek, minimalist user interfaces.':
    'Menjembatani kebutuhan teknis yang kompleks dengan antarmuka pengguna yang ramping dan minimalis.',
  'Comprehensive Web Solutions': 'Solusi Web Menyeluruh',
  'From initial concept to seamless deployment, building scalable web applications that drive user engagement and business growth.':
    'Dari konsep awal hingga deployment yang mulus, membangun aplikasi web skalabel yang mendorong keterlibatan pengguna dan pertumbuhan bisnis.',

  /* ------------------------------------------------------------------ skills */
  'Skills & Expertise': 'Keahlian & Kompetensi',
  Frontend: 'Frontend',
  Backend: 'Backend',
  'Tools & DevOps': 'Perkakas & DevOps',
  Other: 'Lainnya',

  /* ------------------------------------------------------------- experiences */
  'Work Experience': 'Pengalaman Kerja',
  'Web Developer': 'Web Developer',
  'Web Developer (Internship)': 'Web Developer (Magang)',
  'Freelance Web Developer': 'Web Developer Lepas',
  'Personal Business': 'Usaha Pribadi',
  'Oct 2025 - Present': 'Okt 2025 - Sekarang',
  'July 2025 - Sept 2025': 'Juli 2025 - Sept 2025',
  '2023 - Present': '2023 - Sekarang',
  'Engineered and maintained scalable internal web applications using modern frameworks like Laravel and React to streamline complex enterprise workflows and enhance daily business operations.':
    'Membangun dan merawat aplikasi web internal yang skalabel menggunakan framework modern seperti Laravel dan React untuk merampingkan alur kerja perusahaan yang kompleks serta meningkatkan operasional bisnis harian.',
  'Actively contributed to the end-to-end development of data-driven web applications during an intensive 3-month internship, bridging robust Laravel backend functionality with responsive frontend components.':
    'Berkontribusi aktif dalam pengembangan end-to-end aplikasi web berbasis data selama magang intensif 3 bulan, menghubungkan fungsionalitas backend Laravel yang tangguh dengan komponen frontend yang responsif.',
  'Designed and developed bespoke, end-to-end web solutions with premium digital aesthetics, independently managing the entire product lifecycle from system architecture to final deployment for diverse clients.':
    'Merancang dan mengembangkan solusi web end-to-end yang dibuat khusus dengan estetika digital premium, mengelola seluruh siklus produk secara mandiri mulai dari arsitektur sistem hingga deployment akhir untuk berbagai klien.',

  /* ---------------------------------------------------------------- projects */
  'General Affairs System': 'Sistem General Affairs',
  'HR Information System': 'Sistem Informasi SDM',
  'Operational Management System': 'Sistem Manajemen Operasional',
  'Event Registration Management System': 'Sistem Manajemen Pendaftaran Acara',
  'Budget Management System': 'Sistem Manajemen Anggaran',
  'Zenstore E-Commerce': 'Zenstore E-Commerce',
  'Activity Tracker': 'Pelacak Aktivitas',
  'Writers Portal': 'Portal Penulis',
  'Reservation Management System': 'Sistem Manajemen Reservasi',
  'Employee Management System': 'Sistem Manajemen Karyawan',
  'CRM System': 'Sistem CRM',
  'Product Margin Management System': 'Sistem Manajemen Margin Produk',
  'Finance Management System AI Integrated': 'Sistem Manajemen Keuangan Terintegrasi AI',
  'NajminaRun (Najmina Beauty Run) is the official registration site for the "Run to Glow, Run to Grow" marathon/fun run. This event is a collaboration between Najmina Beautycare and the Blora Regency Government to celebrate Blora\'s anniversary and Najmina Beautycare\'s birthday.':
    'NajminaRun (Najmina Beauty Run) adalah situs pendaftaran resmi untuk marathon/fun run "Run to Glow, Run to Grow". Acara ini merupakan kolaborasi antara Najmina Beautycare dan Pemerintah Kabupaten Blora untuk merayakan hari jadi Blora sekaligus ulang tahun Najmina Beautycare.',
  'This application functions as a digital assistant or command center for authors to monitor the commercial performance of their books.':
    'Aplikasi ini berfungsi sebagai asisten digital atau pusat kendali bagi penulis untuk memantau performa komersial buku mereka.',
  'Deepublish Villa is a villa reservation management platform that facilitates flexible accommodation, vacation, and business travel needs in various strategic locations.':
    'Deepublish Villa adalah platform manajemen reservasi vila yang memfasilitasi kebutuhan akomodasi, liburan, dan perjalanan bisnis secara fleksibel di berbagai lokasi strategis.',
  'An integrated information system that makes it easier for Deepublish authors to manage their book assets and income in one place.':
    'Sistem informasi terintegrasi yang memudahkan penulis Deepublish mengelola aset buku dan pendapatan mereka dalam satu tempat.',

  /* ----------------------------------------------------------------- contact */
  'Let’s work together': 'Mari bekerja sama',
  "Let's work together": 'Mari bekerja sama',

  /* ------------------------------------------------------------------ footer */
  '© 2026 Wibisana. All rights reserved.': '© 2026 Wibisana. Seluruh hak cipta dilindungi.',
  'Privacy Policy': 'Kebijakan Privasi',
  'Terms of Service': 'Syarat Layanan',

  /* ---------------------------------------------------------------- cv / seo */
  'Wibi | Web & Product Oriented Developer': 'Wibi | Web & Product Oriented Developer',
  'I build robust web applications focused on great user experience, performance, and clean architecture.':
    'Saya membangun aplikasi web yang tangguh dengan fokus pada pengalaman pengguna, performa, dan arsitektur yang rapi.',
  'Experienced Web Developer with 5+ years of expertise in building high-performance, accessible, and interactive web applications using React, TypeScript, and modern frontend tools. Strong background in UI design systems and headless CMS integrations.':
    'Web Developer berpengalaman dalam membangun aplikasi web berperforma tinggi, mudah diakses, dan interaktif menggunakan React, TypeScript, serta perkakas frontend modern. Berlatar kuat di design system UI dan integrasi headless CMS.',
  "Bachelor's Informatics Technology | GPA 3.75": 'S1 Teknik Informatika | IPK 3.75',
  'Muria Kudus University': 'Universitas Muria Kudus',
  'Graduated with Cumlaude. Focused on Software Engineering and Web Technologies.':
    'Lulus dengan predikat cumlaude. Berfokus pada Rekayasa Perangkat Lunak dan Teknologi Web.',
  'Sleman, Yogyakarta': 'Sleman, Yogyakarta',
  Indonesian: 'Bahasa Indonesia',
  English: 'Bahasa Inggris',
  Native: 'Penutur asli',
  'Full Professional': 'Profesional penuh',
};

const doc = {
  _id: 'translation-id',
  _type: 'translation',
  language: 'id',
  label: 'Bahasa Indonesia',
  entries: Object.entries(ID).map(([from, to], i) => ({
    _key: `t${String(i + 1).padStart(3, '0')}`,
    from,
    to,
  })),
};

async function run() {
  console.log(`Seeding translations into dataset "${dataset}" on project "${projectId}"\n`);
  await client.createOrReplace(doc);
  console.log(`  ✓ ${doc._id} (${doc.label}, ${doc.entries.length} phrases)`);
  console.log('\nDone. The EN/ID switcher now appears in the nav.');
}

run().catch((err) => {
  console.error('\nSeed failed:', err.message);
  process.exit(1);
});
