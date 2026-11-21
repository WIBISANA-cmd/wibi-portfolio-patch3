import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'landingPage',
  title: 'Landing Page',
  type: 'document',
  groups: [
    { name: 'branding', title: 'Branding' },
    { name: 'preloader', title: 'Preloader' },
    { name: 'navigation', title: 'Navigation' },
    { name: 'hero', title: 'Hero' },
    { name: 'marquee', title: 'Marquee' },
    { name: 'about', title: 'About' },
    { name: 'services', title: 'Services' },
    { name: 'skills', title: 'Skills' },
    { name: 'experiences', title: 'Experiences' },
    { name: 'projects', title: 'Projects' },
    { name: 'quote', title: 'Quote' },
    { name: 'contact', title: 'Contact' },
    { name: 'footer', title: 'Footer' },
    { name: 'cv', title: 'CV / Resume' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    /* ------------------------------------------------------------ BRANDING */
    defineField({
      name: 'branding',
      title: 'Branding',
      type: 'object',
      group: 'branding',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: 'logo',
          title: 'Logo',
          description: 'Shown in the nav bar and footer.',
          type: 'image',
          options: { hotspot: true },
          fields: [{ name: 'alt', type: 'string', title: 'Alt text', validation: (rule) => rule.required() }]
        }),
        defineField({
          name: 'favicon',
          title: 'Favicon',
          description: 'Browser tab icon. Use a square image (e.g. 512x512).',
          type: 'image',
          fields: [{ name: 'alt', type: 'string', title: 'Alt text', validation: (rule) => rule.required() }]
        }),
      ],
    }),

    /* ----------------------------------------------------------- PRELOADER */
    defineField({
      name: 'preloader',
      title: 'Preloader',
      type: 'object',
      group: 'preloader',
      fields: [
        defineField({ name: 'enabled', title: 'Enabled', type: 'boolean', initialValue: true }),
        defineField({ name: 'wordmark', title: 'Wordmark', type: 'string', initialValue: 'WIBISANA' }),
        defineField({ name: 'durationMs', title: 'Duration (ms)', type: 'number', initialValue: 2000 }),
      ]
    }),

    /* ---------------------------------------------------------- NAVIGATION */
    defineField({
      name: 'navigation',
      title: 'Navigation Bar',
      type: 'object',
      group: 'navigation',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: 'label',
          title: 'Top-left Label (accent)',
          description: 'First line of the small label in the top-left corner, e.g. "Web Developer". Falls back to the preloader wordmark.',
          type: 'string',
        }),
        defineField({
          name: 'sublabel',
          title: 'Top-left Sub-label',
          description: 'Second line under the label, e.g. "Digital Creator".',
          type: 'string',
        }),
        defineField({
          name: 'links',
          title: 'Nav Links',
          description: 'Links shown in the main site navigation (e.g. About, Services, Projects).',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'label', type: 'string', title: 'Label' },
                { name: 'url', type: 'string', title: 'URL / Anchor' }
              ]
            }
          ]
        }),
      ],
    }),

    /* ---------------------------------------------------------------- HERO */
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      group: 'hero',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: 'backgroundWord',
          title: 'Background Word',
          description: 'Giant word printed behind the portrait, e.g. "PORTFOLIO".',
          type: 'string',
        }),
        defineField({
          name: 'headline',
          title: 'Greeting (script line)',
          description: "Handwritten line above the name, e.g. \"Hello, I'm\".",
          type: 'string',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'name',
          title: 'Display Name',
          description: 'Big condensed name. Put a line break where it should wrap. Falls back to CV → Full Name.',
          type: 'text',
          rows: 2,
        }),
        defineField({
          name: 'eyebrow',
          title: 'Role / Title',
          description: 'Accent-coloured role shown under the name.',
          type: 'string',
        }),
        defineField({ name: 'subheadline', title: 'Intro Paragraph', type: 'text', rows: 3 }),
        defineField({
          name: 'locationNote',
          title: 'Location Note',
          description: 'Small line with a globe icon, e.g. "Available worldwide".',
          type: 'string',
        }),
        defineField({
          name: 'tagline',
          title: 'Side Tagline',
          description: 'Short line next to the sparkle badge, e.g. "Turning ideas into powerful digital experiences."',
          type: 'text',
          rows: 2,
        }),
        defineField({
          name: 'availability',
          title: 'Availability Badge',
          description: 'Shown in the top bar and the contact section, e.g. "Available for freelance".',
          type: 'string',
        }),
        defineField({
          name: 'backgroundImage',
          title: 'Portrait',
          description: 'Cut-out portrait (transparent PNG works best). It stands in front of the background word.',
          type: 'image',
          options: { hotspot: true },
          fields: [{ name: 'alt', type: 'string', title: 'Alt text', validation: (rule) => rule.required() }]
        }),
        defineField({ name: 'ctaLabel', title: 'CTA Label', type: 'string' }),
        defineField({ name: 'ctaHref', title: 'CTA Href', type: 'string' }),
      ],
    }),

    /* ------------------------------------------------------------- MARQUEE */
    defineField({
      name: 'marquee',
      title: 'Marquee Section',
      type: 'object',
      group: 'marquee',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: 'items',
          title: 'Marquee Items',
          type: 'array',
          of: [{ type: 'reference', to: [{ type: 'marqueeImage' }] }],
        }),
      ],
    }),

    /* --------------------------------------------------------------- ABOUT */
    defineField({
      name: 'about',
      title: 'About Section',
      type: 'object',
      group: 'about',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: 'heading', title: 'Heading', type: 'string' }),
        defineField({ name: 'body', title: 'Body Text', type: 'text', rows: 4 }),
        defineField({
          name: 'image',
          title: 'Media Image',
          type: 'image',
          options: { hotspot: true },
          fields: [{ name: 'alt', type: 'string', title: 'Alt text', validation: (rule) => rule.required() }]
        }),
        defineField({
          name: 'stats',
          title: 'Stats',
          description: 'Shown on the right side of the hero, e.g. "3+" / "Years Experience".',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'value', type: 'string', title: 'Value' },
                { name: 'label', type: 'string', title: 'Label' }
              ]
            }
          ]
        }),
      ],
    }),

    /* ------------------------------------------------------------ SERVICES */
    defineField({
      name: 'services',
      title: 'Services Section',
      type: 'object',
      group: 'services',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: 'heading',
          title: 'Heading',
          description: 'e.g. "Work Process".',
          type: 'string',
        }),
        defineField({
          name: 'services',
          title: 'Services / Process Steps',
          type: 'array',
          of: [{ type: 'reference', to: [{ type: 'service' }] }],
        }),
      ],
    }),

    /* -------------------------------------------------------------- SKILLS */
    defineField({
      name: 'skills',
      title: 'Skills Section',
      type: 'object',
      group: 'skills',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: 'heading', title: 'Heading', type: 'string', initialValue: 'Skills & Expertise' }),
        defineField({
          name: 'educationHeading',
          title: 'Education Sub-heading',
          description: 'Label above the education list (entries come from CV → Education & Certifications).',
          type: 'string',
        }),
        defineField({
          name: 'skillsHeading',
          title: 'Skills Sub-heading',
          description: 'Label above the skill tags.',
          type: 'string',
        }),
        defineField({
          name: 'skills',
          title: 'Skills',
          type: 'array',
          of: [{ type: 'reference', to: [{ type: 'skill' }] }],
        }),
      ],
    }),

    /* --------------------------------------------------------- EXPERIENCES */
    defineField({
      name: 'experiences',
      title: 'Experiences Section',
      type: 'object',
      group: 'experiences',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: 'heading', title: 'Heading', type: 'string', initialValue: 'Work Experience' }),
        defineField({
          name: 'experiences',
          title: 'Experiences',
          type: 'array',
          of: [{ type: 'reference', to: [{ type: 'experience' }] }],
        }),
      ],
    }),

    /* ------------------------------------------------------------ PROJECTS */
    defineField({
      name: 'projects',
      title: 'Projects Section',
      type: 'object',
      group: 'projects',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: 'heading', title: 'Heading', type: 'string', description: 'e.g. "Selected Projects".' }),
        defineField({
          name: 'featuredCount',
          title: 'Projects shown before "View all"',
          type: 'number',
          initialValue: 3,
          validation: (rule) => rule.min(1).integer(),
        }),
        defineField({ name: 'viewAllLabel', title: '"View all" Label', type: 'string' }),
        defineField({ name: 'showLessLabel', title: '"Show less" Label', type: 'string' }),
        defineField({
          name: 'projects',
          title: 'Projects',
          type: 'array',
          of: [{ type: 'reference', to: [{ type: 'project' }] }],
        }),
      ],
    }),

    /* --------------------------------------------------------------- QUOTE */
    defineField({
      name: 'quote',
      title: 'Quote Panel',
      description: 'Accent panel next to the work process.',
      type: 'object',
      group: 'quote',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: 'text', title: 'Quote', type: 'text', rows: 3 }),
        defineField({ name: 'signature', title: 'Signature', description: 'Rendered in a handwritten font.', type: 'string' }),
        defineField({ name: 'footnote', title: 'Footnote', type: 'string' }),
      ],
    }),

    /* ------------------------------------------------------------- CONTACT */
    defineField({
      name: 'contact',
      title: 'Contact Section',
      type: 'object',
      group: 'contact',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: 'heading', title: 'Heading', type: 'string' }),
        defineField({ name: 'email', title: 'Email Address', type: 'string' }),
        defineField({
          name: 'socials',
          title: 'Social Links',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'label', type: 'string', title: 'Label' },
                { name: 'url', type: 'url', title: 'URL' }
              ]
            }
          ]
        }),
        defineField({ name: 'note', title: 'Intro Paragraph', type: 'text', rows: 3 }),
        defineField({
          name: 'image',
          title: 'Showcase Image',
          description: 'Optional visual on the right (e.g. a laptop mockup of your work).',
          type: 'image',
          options: { hotspot: true },
          fields: [{ name: 'alt', type: 'string', title: 'Alt text', validation: (rule) => rule.required() }]
        }),
      ],
    }),

    /* -------------------------------------------------------------- FOOTER */
    defineField({
      name: 'footer',
      title: 'Footer',
      type: 'object',
      group: 'footer',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: 'tagline', title: 'Tagline / Wordmark', type: 'string' }),
        defineField({ name: 'copyright', title: 'Copyright', type: 'string' }),
        defineField({
          name: 'links',
          title: 'Links',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'label', type: 'string', title: 'Label' },
                { name: 'url', type: 'string', title: 'URL' }
              ]
            }
          ]
        }),
      ],
    }),

    /* ---------------------------------------------------------- CV / RESUME */
    defineField({
      name: 'cv',
      title: 'CV / Resume Settings',
      description: 'Configure the downloadable ATS-friendly CV. Data is pulled dynamically from other sections.',
      type: 'object',
      group: 'cv',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: 'fullName', title: 'Full Name', type: 'string' }),
        defineField({ name: 'jobTitle', title: 'Job Title / Headline', type: 'string' }),
        defineField({ name: 'phone', title: 'Phone Number', type: 'string' }),
        defineField({ name: 'location', title: 'Location', type: 'string' }),
        defineField({ name: 'website', title: 'Website URL', type: 'string' }),
        defineField({ name: 'summary', title: 'Professional Summary', type: 'text', rows: 4 }),
        defineField({
          name: 'education',
          title: 'Education',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'degree', type: 'string', title: 'Degree' },
                { name: 'institution', type: 'string', title: 'Institution' },
                { name: 'year', type: 'string', title: 'Year / Duration' },
                { name: 'description', type: 'text', title: 'Description' },
              ],
            },
          ],
        }),
        defineField({
          name: 'certifications',
          title: 'Certifications',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'name', type: 'string', title: 'Certification Name' },
                { name: 'issuer', type: 'string', title: 'Issuing Organization' },
                { name: 'year', type: 'string', title: 'Year' },
              ],
            },
          ],
        }),
        defineField({
          name: 'languages',
          title: 'Languages',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'language', type: 'string', title: 'Language' },
                { name: 'level', type: 'string', title: 'Proficiency Level' },
              ],
            },
          ],
        }),
        defineField({
          name: 'showDownloadButton',
          title: 'Show Download CV Button',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({ name: 'buttonLabel', title: 'Download Button Label', type: 'string' }),
      ],
    }),

    /* ----------------------------------------------------------------- SEO */
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      group: 'seo',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: 'title', title: 'Meta Title', type: 'string' }),
        defineField({ name: 'description', title: 'Meta Description', type: 'text', rows: 2 }),
        defineField({
          name: 'ogImage',
          title: 'OG Image',
          type: 'image',
          fields: [{ name: 'alt', type: 'string', title: 'Alt text', validation: (rule) => rule.required() }]
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Landing Page' };
    },
  },
});
