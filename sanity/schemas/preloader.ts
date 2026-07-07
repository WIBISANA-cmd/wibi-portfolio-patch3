import { defineType, defineField } from 'sanity';

// Reusable hex validator so the color string fields stay clean (#RGB / #RRGGBB).
const hexColor = (rule: import('sanity').StringRule) =>
  rule.regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, {
    name: 'hex color',
    invert: false,
  });

export default defineType({
  name: 'preloader',
  title: 'Preloader',
  type: 'object',
  options: { collapsible: true, collapsed: false },
  fields: [
    defineField({
      name: 'isEnabled',
      title: 'Enable Preloader',
      type: 'boolean',
      description: 'Turn the cinematic loading screen on or off.',
      initialValue: true,
    }),
    defineField({
      name: 'loadingWords',
      title: 'Loading Words',
      type: 'array',
      of: [{ type: 'string' }],
      description:
        'Words that flash in sequence before the reveal (end with the name, e.g. "Jack").',
      initialValue: ['3D Modeling', 'Rendering', 'Motion Design', 'Jack'],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: 'animationDuration',
      title: 'Word Duration (ms)',
      type: 'number',
      description: 'How long each word stays on screen, in milliseconds.',
      initialValue: 600,
      validation: (rule) => rule.min(150).max(3000),
    }),
    defineField({
      name: 'preloaderBgColor',
      title: 'Background Color',
      type: 'string',
      description: 'Hex color, e.g. #0C0C0C',
      initialValue: '#0C0C0C',
      validation: hexColor,
    }),
    defineField({
      name: 'preloaderTextColor',
      title: 'Text Color',
      type: 'string',
      description: 'Hex color, e.g. #D7E2EA',
      initialValue: '#D7E2EA',
      validation: hexColor,
    }),
  ],
});
