import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({
      name: 'number',
      title: 'Sequence Number',
      type: 'string',
      description: 'e.g. "01"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Service Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: 'name', number: 'number', subtitle: 'description' },
    prepare({ title, number, subtitle }) {
      return { title: `${number ?? '--'} · ${title ?? 'Untitled'}`, subtitle };
    },
  },
});
