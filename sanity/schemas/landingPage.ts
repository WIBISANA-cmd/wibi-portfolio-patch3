import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'landingPage',
  title: 'Landing Page',
  type: 'document',
  groups: [
    { name: 'preloader', title: 'Preloader' },
    { name: 'navigation', title: 'Navigation' },
    { name: 'hero', title: 'Hero' },
    { name: 'marquee', title: 'Marquee' },
    { name: 'about', title: 'About' },
    { name: 'services', title: 'Services' },
    { name: 'experiences', title: 'Experiences' },
    { name: 'projects', title: 'Projects' },
    { name: 'contact', title: 'Contact' },
    { name: 'footer', title: 'Footer' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
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
        defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
        defineField({
          name: 'headline',
          title: 'Headline',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
        defineField({ name: 'subheadline', title: 'Subheadline', type: 'text', rows: 2 }),
        defineField({
          name: 'backgroundImage',
          title: 'Background Image',
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
          name: 'services',
          title: 'Services',
          type: 'array',
          of: [{ type: 'reference', to: [{ type: 'service' }] }],
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
        defineField({
          name: 'projects',
          title: 'Projects',
          type: 'array',
          of: [{ type: 'reference', to: [{ type: 'project' }] }],
        }),
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
        defineField({ name: 'note', title: 'Optional Note', type: 'string' }),
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
