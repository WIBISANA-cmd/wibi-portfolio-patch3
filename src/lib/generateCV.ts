import type {
  LandingPage,
  ExperienceDoc,
  SkillDoc,
  ProjectDoc,
  CVData,
} from './sanity.types';

/** Translate a UI string; identity when no dictionary is active. */
type Translate = (text: string) => string;

export interface CVOptions {
  /** Same dictionary the site uses, so the CV follows the language the visitor picked. */
  t?: Translate;
  /** Active language code, written to <html lang>. */
  lang?: string;
}

interface CVLabels {
  summary: string;
  experience: string;
  education: string;
  skills: string;
  projects: string;
  certifications: string;
  languages: string;
  link: string;
}

/**
 * Collect all CV data from the landing page object.
 *
 * The CV mirrors what the site shows: name, title and summary come from the
 * Hero / About sections, and the "CV / Resume Settings" values are only used
 * when those are empty. Experience, skills and projects come from their own
 * sections; contact details, education, certifications and languages from the
 * contact and CV sections. `data` is already translated by the caller.
 */
interface CVPayload {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  summary: string;
  experiences: ExperienceDoc[];
  skills: SkillDoc[];
  projects: ProjectDoc[];
  education: NonNullable<CVData['education']>;
  certifications: NonNullable<CVData['certifications']>;
  languages: NonNullable<CVData['languages']>;
  socials: { label: string; url: string }[];
  labels: CVLabels;
}

/** Same ordering as the Skills section: categories in first-seen order, then `order` inside each. */
function sortSkillsLikeSite(skills: SkillDoc[]): SkillDoc[] {
  const firstSeen = new Map<string, number>();
  skills.forEach((s, i) => !firstSeen.has(s.category) && firstSeen.set(s.category, i));
  return [...skills].sort(
    (a, b) => (firstSeen.get(a.category) ?? 0) - (firstSeen.get(b.category) ?? 0) || (a.order ?? 99) - (b.order ?? 99)
  );
}

const oneLine = (text?: string) => text?.replace(/s+/g, ' ').trim() || '';

function collectCVData(data: LandingPage, t: Translate): CVPayload {
  const cv = data.cv ?? {};
  const experiences = [...(data.experiences?.experiences ?? [])].sort(
    (a, b) => (a.order ?? 99) - (b.order ?? 99)
  );
  const skills = sortSkillsLikeSite(data.skills?.skills ?? []);
  const projects = [...(data.projects?.projects ?? [])].sort(
    (a, b) => (a.order ?? 99) - (b.order ?? 99)
  );

  return {
    fullName: oneLine(data.hero?.name) || cv.fullName || data.preloader?.wordmark || 'Your Name',
    jobTitle: data.hero?.eyebrow || cv.jobTitle || '',
    email: data.contact?.email || '',
    phone: cv.phone || '',
    location: cv.location || '',
    website: cv.website || '',
    summary: data.about?.body || cv.summary || '',
    experiences,
    skills,
    projects,
    education: cv.education ?? [],
    certifications: cv.certifications ?? [],
    languages: cv.languages ?? [],
    socials: data.contact?.socials ?? [],
    labels: {
      summary: t('Professional Summary'),
      // Headings the site sets itself win, so the CV reads like the page.
      experience: data.experiences?.heading || t('Work Experience'),
      education: data.skills?.educationHeading || t('Education'),
      skills: data.skills?.skillsHeading || t('Skills'),
      projects: data.projects?.heading || t('Projects'),
      certifications: t('Certifications'),
      languages: t('Languages'),
      link: t('Link'),
    },
  };
}

/** Group skills by category. */
function groupSkills(skills: SkillDoc[]): Map<string, string[]> {
  const map = new Map<string, string[]>();
  for (const s of skills) {
    const cat = s.category || 'Other';
    if (!map.has(cat)) map.set(cat, []);
    map.get(cat)!.push(s.name);
  }
  return map;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Generate ATS-friendly CV HTML.
 * Uses semantic HTML, simple styling, and avoids tables/graphics
 * so Applicant Tracking Systems can parse it correctly.
 */
function buildATSHtml(d: CVPayload, lang: string): string {
  const L = d.labels;
  const contactParts: string[] = [];
  if (d.email) contactParts.push(`<a href="mailto:${escapeHtml(d.email)}">${escapeHtml(d.email)}</a>`);
  if (d.phone) contactParts.push(escapeHtml(d.phone));
  if (d.location) contactParts.push(escapeHtml(d.location));
  if (d.website) contactParts.push(`<a href="${escapeHtml(d.website)}">${escapeHtml(d.website)}</a>`);
  d.socials.forEach((s) => {
    contactParts.push(`<a href="${escapeHtml(s.url)}">${escapeHtml(s.label)}</a>`);
  });

  const skillGroups = groupSkills(d.skills);

  return `<!DOCTYPE html>
<html lang="${escapeHtml(lang)}">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${escapeHtml(d.fullName)} — CV</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 10.5pt;
    line-height: 1.5;
    color: #1a1a1a;
    background: #ffffff;
    max-width: 800px;
    margin: 0 auto;
    padding: 40px 48px;
  }

  @media print {
    body { padding: 0; max-width: none; }
    @page { margin: 0.6in 0.55in; size: A4; }
    a { color: #1a1a1a !important; text-decoration: none !important; }
    .no-print { display: none !important; }
  }

  h1 {
    font-size: 22pt;
    font-weight: 700;
    letter-spacing: -0.02em;
    margin-bottom: 2px;
  }

  h2 {
    font-size: 11pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #1a1a1a;
    border-bottom: 1.5px solid #1a1a1a;
    padding-bottom: 4px;
    margin-top: 18px;
    margin-bottom: 10px;
  }

  h3 {
    font-size: 10.5pt;
    font-weight: 600;
    margin-bottom: 1px;
  }

  .subtitle {
    font-size: 11pt;
    font-weight: 500;
    color: #444;
    margin-bottom: 6px;
  }

  .contact-line {
    font-size: 9.5pt;
    color: #444;
    margin-top: 4px;
    word-spacing: 2px;
  }

  .contact-line a { color: #444; text-decoration: none; }
  .contact-line span + span::before { content: ' | '; color: #999; }

  .entry { margin-bottom: 10px; }
  .entry-header { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 4px; }
  .entry-header .duration { font-size: 9.5pt; color: #666; font-weight: 400; white-space: nowrap; }

  .entry p, .entry ul {
    font-size: 10.5pt;
    color: #333;
    margin-top: 3px;
  }

  ul { padding-left: 18px; }
  li { margin-bottom: 2px; }

  .skills-group { margin-bottom: 6px; }
  .skills-group strong { font-weight: 600; }
  .skills-group span { color: #333; }

  .projects-grid { display: flex; flex-direction: column; gap: 6px; }
</style>
</head>
<body>

<!-- HEADER -->
<header>
  <h1>${escapeHtml(d.fullName)}</h1>
  ${d.jobTitle ? `<div class="subtitle">${escapeHtml(d.jobTitle)}</div>` : ''}
  ${contactParts.length > 0 ? `<div class="contact-line">${contactParts.map(p => `<span>${p}</span>`).join('')}</div>` : ''}
</header>

${d.summary ? `
<!-- PROFESSIONAL SUMMARY -->
<section>
  <h2>${escapeHtml(L.summary)}</h2>
  <p>${escapeHtml(d.summary)}</p>
</section>
` : ''}

${d.experiences.length > 0 ? `
<!-- WORK EXPERIENCE -->
<section>
  <h2>${escapeHtml(L.experience)}</h2>
  ${d.experiences.map(exp => `
  <div class="entry">
    <div class="entry-header">
      <h3>${escapeHtml(exp.role)} — ${escapeHtml(exp.company)}</h3>
      <span class="duration">${escapeHtml(exp.duration)}</span>
    </div>
    ${exp.description ? `<p>${escapeHtml(exp.description)}</p>` : ''}
  </div>`).join('')}
</section>
` : ''}

${d.education.length > 0 ? `
<!-- EDUCATION -->
<section>
  <h2>${escapeHtml(L.education)}</h2>
  ${d.education.map(edu => `
  <div class="entry">
    <div class="entry-header">
      <h3>${escapeHtml(edu.degree || '')}${edu.institution ? ` — ${escapeHtml(edu.institution)}` : ''}</h3>
      ${edu.year ? `<span class="duration">${escapeHtml(edu.year)}</span>` : ''}
    </div>
    ${edu.description ? `<p>${escapeHtml(edu.description)}</p>` : ''}
  </div>`).join('')}
</section>
` : ''}

${d.skills.length > 0 ? `
<!-- SKILLS -->
<section>
  <h2>${escapeHtml(L.skills)}</h2>
  ${Array.from(skillGroups.entries()).map(([cat, names]) => `
  <div class="skills-group">
    <strong>${escapeHtml(cat)}:</strong> <span>${names.map(n => escapeHtml(n)).join(', ')}</span>
  </div>`).join('')}
</section>
` : ''}

${d.projects.length > 0 ? `
<!-- PROJECTS -->
<section>
  <h2>${escapeHtml(L.projects)}</h2>
  <div class="projects-grid">
    ${d.projects.map(proj => `
    <div class="entry">
      <div class="entry-header">
        <h3>${escapeHtml(proj.title)}${proj.category ? ` <span style="font-weight:400;color:#666;font-size:9.5pt">· ${escapeHtml(proj.category)}</span>` : ''}${proj.techstack && proj.techstack.length > 0 ? ` <span style="font-weight:400;color:#666;font-size:9.5pt">(${proj.techstack.map(t => escapeHtml(t)).join(', ')})</span>` : ''}</h3>
        ${proj.url ? `<a href="${escapeHtml(proj.url)}" style="font-size:9.5pt;color:#666;">↗ ${escapeHtml(L.link)}</a>` : ''}
      </div>
      ${proj.description ? `<p>${escapeHtml(proj.description)}</p>` : ''}
    </div>`).join('')}
  </div>
</section>
` : ''}

${d.certifications.length > 0 ? `
<!-- CERTIFICATIONS -->
<section>
  <h2>${escapeHtml(L.certifications)}</h2>
  ${d.certifications.map(cert => `
  <div class="entry">
    <div class="entry-header">
      <h3>${escapeHtml(cert.name || '')}</h3>
      ${cert.year ? `<span class="duration">${escapeHtml(cert.year)}</span>` : ''}
    </div>
    ${cert.issuer ? `<p>${escapeHtml(cert.issuer)}</p>` : ''}
  </div>`).join('')}
</section>
` : ''}

${d.languages.length > 0 ? `
<!-- LANGUAGES -->
<section>
  <h2>${escapeHtml(L.languages)}</h2>
  <p>${d.languages.map(l => `${escapeHtml(l.language || '')}${l.level ? ` (${escapeHtml(l.level)})` : ''}`).join(', ')}</p>
</section>
` : ''}

</body>
</html>`;
}

/**
 * Opens the generated ATS-friendly CV in a new browser tab and triggers
 * the print dialog so the user can save it as PDF.
 */
export function downloadCV(data: LandingPage, { t = (text) => text, lang = 'en' }: CVOptions = {}): void {
  const payload = collectCVData(data, t);
  const html = buildATSHtml(payload, lang);

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);

  const win = window.open(url, '_blank');
  if (win) {
    win.addEventListener('load', () => {
      setTimeout(() => {
        win.print();
      }, 500);
    });
  }

  // Clean up the object URL after a delay
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
