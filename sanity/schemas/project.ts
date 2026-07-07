import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'number',
      title: 'Project Number',
      type: 'string',
      description: 'e.g. "01"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'projectType',
      title: 'Project Type',
      type: 'string',
      options: {
        list: [
          { title: 'Client', value: 'Client' },
          { title: 'Personal', value: 'Personal' },
        ],
        layout: 'radio',
      },
      initialValue: 'Client',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'linkButton',
      title: 'Live Project Link',
      type: 'url',
      description: 'Destination for the "Live Project" button',
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'object',
      options: { collapsed: false, collapsible: false },
      fields: [
        defineField({
          name: 'col1_image1',
          title: 'Column 1 — Top Image',
          type: 'image',
          options: { hotspot: true },
        }),
        defineField({
          name: 'col1_image2',
          title: 'Column 1 — Bottom Image',
          type: 'image',
          options: { hotspot: true },
        }),
        defineField({
          name: 'col2_image',
          title: 'Column 2 — Tall Image',
          type: 'image',
          options: { hotspot: true },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      number: 'number',
      subtitle: 'projectType',
      media: 'images.col2_image',
    },
    prepare({ title, number, subtitle, media }) {
      return {
        title: `${number ?? '--'} · ${title ?? 'Untitled'}`,
        subtitle,
        media,
      };
    },
  },
});
