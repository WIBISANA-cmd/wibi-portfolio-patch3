import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({
      name: 'orderNumber',
      title: 'Order Number',
      type: 'number',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      description: 'Icon shown in the circle of the work-process list.',
      type: 'string',
      options: {
        list: [
          { title: 'Search / Discover', value: 'search' },
          { title: 'Lightbulb / Ideate', value: 'idea' },
          { title: 'Pen / Design', value: 'design' },
          { title: 'Code / Develop', value: 'code' },
          { title: 'Send / Deliver', value: 'launch' },
          { title: 'Layers', value: 'layers' },
          { title: 'Server', value: 'server' },
          { title: 'Database', value: 'database' },
          { title: 'Monitor', value: 'monitor' },
          { title: 'Rocket', value: 'rocket' },
        ],
      },
    }),
    defineField({
      name: 'image',
      title: 'Optional Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt text',
          validation: (rule) => rule.required(),
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
      media: 'image',
    },
  },
});
