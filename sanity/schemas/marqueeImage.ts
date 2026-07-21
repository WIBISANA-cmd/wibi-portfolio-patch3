import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'marqueeImage',
  title: 'Marquee Image',
  type: 'document',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'Optional text label',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt text',
          validation: (rule) => rule.required()
        }
      ],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: 'label', media: 'image' },
    prepare({ title, media }) {
      return { title: title || 'Marquee Image', media };
    },
  },
});
