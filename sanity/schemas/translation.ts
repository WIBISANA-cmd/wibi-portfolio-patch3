import { defineType, defineField } from 'sanity';

/**
 * One document per language. Content stays authored in English everywhere else;
 * this is a plain source → target phrase list applied to the whole page at
 * render time. Anything left out simply keeps its English text.
 */
export default defineType({
  name: 'translation',
  title: 'Translation',
  type: 'document',
  fields: [
    defineField({
      name: 'language',
      title: 'Language code',
      description: 'ISO code shown in the language switcher, e.g. "id", "ja", "de".',
      type: 'string',
      validation: (rule) => rule.required().lowercase().max(5),
    }),
    defineField({
      name: 'label',
      title: 'Language name',
      description: 'Full name shown on hover, e.g. "Bahasa Indonesia".',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'entries',
      title: 'Phrases',
      description:
        'Each row replaces one exact English phrase. Copy the English text verbatim (including line breaks) into "English".',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'from', title: 'English', type: 'text', rows: 2, validation: (rule) => rule.required() }),
            defineField({ name: 'to', title: 'Translation', type: 'text', rows: 2, validation: (rule) => rule.required() }),
          ],
          preview: {
            select: { title: 'from', subtitle: 'to' },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'label', subtitle: 'language', entries: 'entries' },
    prepare: ({ title, subtitle, entries }) => ({
      title,
      subtitle: `${subtitle} · ${entries?.length ?? 0} phrases`,
    }),
  },
});
