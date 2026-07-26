import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'skill',
  title: 'Skill',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Skill Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      description: 'Group skills by category (e.g. Frontend, Backend, Design, Tools).',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'proficiency',
      title: 'Proficiency (%)',
      description: 'Skill proficiency level from 0 to 100.',
      type: 'number',
      validation: (rule) => rule.min(0).max(100),
    }),
    defineField({
      name: 'order',
      title: 'Order',
      description: 'Lower numbers appear first within a category.',
      type: 'number',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'category',
    },
  },
});
