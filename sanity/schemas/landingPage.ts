import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'landingPage',
  title: 'Landing Page',
  type: 'document',
  // Grouped into tabs so the single document stays easy to navigate.
  groups: [
    { name: 'preloader', title: 'Preloader' },
    { name: 'hero', title: 'Hero' },
    { name: 'marquee', title: 'Marquee' },
    { name: 'about', title: 'About' },
    { name: 'services', title: 'Services' },
    { name: 'projects', title: 'Projects' },
  ],
  fields: [
    /* ----------------------------------------------------------- PRELOADER */
    defineField({
      name: 'preloader',
      title: 'Preloader',
      type: 'preloader',
      group: 'preloader',
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
          name: 'navLinks',
          title: 'Navbar Links',
          type: 'array',
          of: [{ type: 'string' }],
          initialValue: ['About', 'Price', 'Projects', 'Contact'],
        }),
        defineField({
          name: 'heading',
          title: 'Main Heading',
          type: 'string',
          description: 'e.g. "Hi, i’m wibi"',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'description',
          title: 'Bottom-left Description',
          type: 'text',
          rows: 2,
        }),
        defineField({
          name: 'portrait',
          title: 'Portrait Image',
          type: 'image',
          options: { hotspot: true },
        }),
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
          name: 'row1',
          title: 'Row 1 (scrolls right)',
          type: 'array',
          of: [{ type: 'reference', to: [{ type: 'marqueeImage' }] }],
        }),
        defineField({
          name: 'row2',
          title: 'Row 2 (scrolls left)',
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
        defineField({
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'About me',
        }),
        defineField({
          name: 'paragraph',
          title: 'Animated Paragraph',
          type: 'text',
          rows: 4,
        }),
        // The four decorative 3D slots are pinned to fixed corners by the
        // design, so only the asset is editable here (no coordinates needed).
        defineField({
          name: 'moonIcon',
          title: 'Decorative — Moon (top-left)',
          type: 'image',
          options: { hotspot: true },
        }),
        defineField({
          name: 'legoIcon',
          title: 'Decorative — Lego (top-right)',
          type: 'image',
          options: { hotspot: true },
        }),
        defineField({
          name: 'object1',
          title: 'Decorative — Object (bottom-left)',
          type: 'image',
          options: { hotspot: true },
        }),
        defineField({
          name: 'group1',
          title: 'Decorative — Group (bottom-right)',
          type: 'image',
          options: { hotspot: true },
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
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Services',
        }),
        defineField({
          name: 'items',
          title: 'Services',
          type: 'array',
          of: [{ type: 'reference', to: [{ type: 'service' }] }],
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
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Project',
        }),
        defineField({
          name: 'items',
          title: 'Projects (drag to reorder)',
          type: 'array',
          of: [{ type: 'reference', to: [{ type: 'project' }] }],
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
