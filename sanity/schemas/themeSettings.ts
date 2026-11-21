import { defineArrayMember, defineField, defineType } from 'sanity';
import {
  CONTENT_GROUPS,
  CONTENT_SLOTS,
  DEFAULT_FONTS,
  FONT_ROLES,
  FONT_ROLE_LABELS,
  SIZE_DEFAULT,
  SIZE_MAX,
  SIZE_MIN,
  slotFieldName,
  slotSizeFieldName,
  type FontRole,
} from '../../src/lib/fontRegistry';
import { FontSelectInput } from '../components/FontSelectInput';
import { TextSizeInput } from '../components/TextSizeInput';

/** Letters, numbers, spaces, dashes and underscores — safe inside a CSS font-family. */
const FONT_NAME_PATTERN = /^[A-Za-z0-9][A-Za-z0-9 _-]*$/;

const WEIGHTS = [100, 200, 300, 400, 500, 600, 700, 800, 900].map((w) => ({ title: String(w), value: w }));

/** One dropdown per piece of content. Empty = the design's own font for it. */
function contentFontField(slot: (typeof CONTENT_SLOTS)[number]) {
  return defineField({
    name: slotFieldName(slot.key),
    title: slot.label,
    description: `Design default: ${DEFAULT_FONTS[slot.role]}. Fonts you upload under "Custom Fonts" also appear here.`,
    type: 'string',
    group: 'fonts',
    fieldset: slot.group,
    components: { input: FontSelectInput },
  });
}

/** One slider per piece of content. Empty / 100 = the design's own size. */
function contentSizeField(slot: (typeof CONTENT_SLOTS)[number]) {
  return defineField({
    name: slotSizeFieldName(slot.key),
    title: slot.label,
    description: `${SIZE_DEFAULT}% = the design's size. Applies on every screen size.`,
    type: 'number',
    group: 'sizes',
    fieldset: `size-${slot.group}`,
    components: { input: TextSizeInput },
    validation: (rule) => rule.min(SIZE_MIN).max(SIZE_MAX),
  });
}

/**
 * Legacy per-role fonts. Superseded by the per-content fields; kept only so
 * values saved earlier still apply. Hidden unless they hold a value.
 */
function legacyRoleField(role: FontRole, name: string) {
  return defineField({
    name,
    title: `Base font — ${FONT_ROLE_LABELS[role]}`,
    description:
      'Applies to any content of this kind that is left on "Default". Prefer setting the font per content above; clear this to remove it.',
    type: 'string',
    group: 'fonts',
    fieldset: 'legacy',
    components: { input: FontSelectInput },
    hidden: ({ value }) => !value,
  });
}

interface CustomFontValue {
  fontName?: string;
  usage?: string[];
}

export default defineType({
  name: 'themeSettings',
  title: 'Theme Settings',
  type: 'document',
  groups: [
    { name: 'fonts', title: 'Fonts', default: true },
    { name: 'sizes', title: 'Text Sizes' },
    { name: 'custom', title: 'Custom Fonts' },
  ],
  fieldsets: [
    ...CONTENT_GROUPS.map((group) => ({
      name: group.name,
      title: group.title,
      options: { collapsible: true, collapsed: group.name !== 'hero' },
    })),
    ...CONTENT_GROUPS.map((group) => ({
      name: `size-${group.name}`,
      title: group.title,
      options: { collapsible: true, collapsed: group.name !== 'hero' },
    })),
    { name: 'legacy', title: 'Base fonts (legacy)', options: { collapsible: true, collapsed: true } },
  ],
  fields: [
    ...CONTENT_SLOTS.map(contentFontField),
    ...CONTENT_SLOTS.map(contentSizeField),

    legacyRoleField('body', 'bodyFont'),
    legacyRoleField('heading', 'headingFont'),
    legacyRoleField('display', 'displayFont'),
    legacyRoleField('script', 'scriptFont'),

    defineField({
      name: 'customFonts',
      title: 'Custom Fonts (upload)',
      description:
        'Upload your own font files. Add one row per file — e.g. "Brand Sans" 400 and "Brand Sans" 700 — using the same Font Name. Once a row has a name and a file, the font appears in every dropdown on the Fonts tab.',
      type: 'array',
      group: 'custom',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'customFont',
          fields: [
            defineField({
              name: 'fontName',
              title: 'Font Name',
              description: 'Family name used in CSS. Letters, numbers, spaces, "-" and "_" only.',
              type: 'string',
              validation: (rule) =>
                rule
                  .required()
                  .max(60)
                  .regex(FONT_NAME_PATTERN, { name: 'font name' }),
            }),
            defineField({
              name: 'fontFile',
              title: 'Font File',
              description: '.woff2 (recommended), .woff or .ttf',
              type: 'file',
              options: { accept: '.woff2,.woff,.ttf' },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'weight',
              title: 'Weight',
              type: 'number',
              options: { list: WEIGHTS },
              initialValue: 400,
            }),
            defineField({
              name: 'style',
              title: 'Style',
              type: 'string',
              options: { list: ['normal', 'italic'], layout: 'radio', direction: 'horizontal' },
              initialValue: 'normal',
            }),
            defineField({
              name: 'usage',
              title: 'Use this font for (legacy)',
              description:
                'Optional. Prefer picking the font in the Fonts tab — it shows up in each dropdown once it has a name and a file.',
              hidden: ({ parent }) => !(parent as CustomFontValue | undefined)?.usage?.length,
              type: 'array',
              of: [{ type: 'string' }],
              options: {
                list: FONT_ROLES.map((role) => ({ title: FONT_ROLE_LABELS[role], value: role })),
                layout: 'grid',
              },
            }),
          ],
          preview: {
            select: { title: 'fontName', weight: 'weight', style: 'style', usage: 'usage', file: 'fontFile.asset.originalFilename' },
            prepare: ({ title, weight, style, usage, file }) => ({
              title: `${title || 'Untitled font'} · ${weight ?? 400}${style === 'italic' ? ' italic' : ''}`,
              subtitle: [usage?.length ? `Used for: ${usage.join(', ')}` : 'Not applied', file].filter(Boolean).join(' — '),
            }),
          },
        }),
      ],
      // A role can only point at one family; several files of that family are fine.
      validation: (rule) =>
        rule.custom((value: CustomFontValue[] | undefined) => {
          if (!value?.length) return true;
          for (const role of FONT_ROLES) {
            const families = new Set(
              value.filter((f) => f.usage?.includes(role) && f.fontName).map((f) => f.fontName!.trim().toLowerCase())
            );
            if (families.size > 1) {
              return `Only one custom font family can be used for "${FONT_ROLE_LABELS[role]}".`;
            }
          }
          return true;
        }),
    }),
  ],
  preview: {
    select: { name: 'heroNameFont', title: 'sectionTitleFont', custom: 'customFonts' },
    prepare: ({ name, title, custom }) => ({
      title: 'Theme Settings',
      subtitle: `Hero name: ${name || DEFAULT_FONTS.display} · Section titles: ${title || DEFAULT_FONTS.heading} · ${custom?.length ?? 0} custom font(s)`,
    }),
  },
});
