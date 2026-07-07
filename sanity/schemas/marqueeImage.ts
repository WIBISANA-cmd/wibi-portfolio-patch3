import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'marqueeImage',
  title: 'Marquee Image',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      description: 'Label used only inside the Studio to identify this tile',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: 'title', media: 'image' },
    prepare({ title, media }) {
      return { title: title || 'Marquee tile', media };
    },
  },
});
