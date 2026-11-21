import { Select, Stack, Text } from '@sanity/ui';
import { set, unset, useFormValue, type StringInputProps } from 'sanity';
import { DEFAULT_FONTS, FONT_OPTIONS, FONT_ROLES, findSlotByField } from '../../src/lib/fontRegistry';

/** Name of the font a field falls back to when left on "Default". */
function defaultFontFor(fieldName: string): string | undefined {
  const slot = findSlotByField(fieldName);
  if (slot) return DEFAULT_FONTS[slot.role];
  const role = FONT_ROLES.find((r) => `${r}Font` === fieldName);
  return role ? DEFAULT_FONTS[role] : undefined;
}

interface CustomFontRow {
  fontName?: string;
  fontFile?: { asset?: unknown };
}

/**
 * Font dropdown for Theme Settings: the built-in Google Fonts plus every font
 * uploaded under "Custom Fonts". It reads the draft, so a font shows up here as
 * soon as it has a name and a file — no need to publish first.
 */
export function FontSelectInput(props: StringInputProps) {
  const { value, onChange, readOnly, path } = props;
  const fieldName = String(path[path.length - 1] ?? '');
  const defaultFont = defaultFontFor(fieldName);
  const rows = useFormValue(['customFonts']) as CustomFontRow[] | undefined;

  const customNames = [
    ...new Set(
      (rows ?? [])
        .filter((row) => row.fontName?.trim() && row.fontFile?.asset)
        .map((row) => row.fontName!.trim())
    ),
  ];

  const isKnown = !value || FONT_OPTIONS.some((o) => o.value === value) || customNames.includes(value);

  return (
    <Stack space={3}>
      <Select
        value={value ?? ''}
        readOnly={readOnly}
        onChange={(event) => {
          const next = event.currentTarget.value;
          onChange(next ? set(next) : unset());
        }}
      >
        <option value="">{defaultFont ? `Default — ${defaultFont}` : 'Default'}</option>
        {customNames.length > 0 && (
          <optgroup label="Your custom fonts">
            {customNames.map((name) => (
              <option key={name} value={name}>
                {name} — custom
              </option>
            ))}
          </optgroup>
        )}
        <optgroup label="Google Fonts">
          {FONT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.title}
            </option>
          ))}
        </optgroup>
        {!isKnown && <option value={value}>{value} (not found)</option>}
      </Select>
      {!isKnown && (
        <Text size={1} muted>
          This custom font is no longer in the "Custom Fonts" list (or has no file). The site falls back to the default
          font until you pick another one or re-add it.
        </Text>
      )}
    </Stack>
  );
}
