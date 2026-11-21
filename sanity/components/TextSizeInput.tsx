import { Button, Flex, Text, TextInput } from '@sanity/ui';
import { set, unset, type NumberInputProps } from 'sanity';
import { SIZE_DEFAULT, SIZE_MAX, SIZE_MIN, SIZE_STEP } from '../../src/lib/fontRegistry';

/**
 * Text size as a percentage of the design's size: a slider for quick changes,
 * a number box for exact values, and a reset back to the design default.
 * An empty field means "design default" (100%), same as typing 100.
 */
export function TextSizeInput(props: NumberInputProps) {
  const { value, onChange, readOnly } = props;
  const current = typeof value === 'number' ? value : SIZE_DEFAULT;
  const changed = typeof value === 'number' && value !== SIZE_DEFAULT;

  const commit = (next: number) => {
    // 100 is the default — store nothing rather than a redundant number.
    onChange(Number.isFinite(next) && next !== SIZE_DEFAULT ? set(Math.round(next)) : unset());
  };

  return (
    <Flex align="center" gap={3}>
      <input
        type="range"
        min={SIZE_MIN}
        max={SIZE_MAX}
        step={SIZE_STEP}
        value={Math.min(SIZE_MAX, Math.max(SIZE_MIN, current))}
        disabled={readOnly}
        aria-label="Text size in percent"
        onChange={(event) => commit(Number(event.currentTarget.value))}
        style={{ flex: 1, minWidth: 0, accentColor: 'var(--card-focus-ring-color, #2276fc)' }}
      />
      <div style={{ width: '6.5rem' }}>
        <TextInput
          type="number"
          inputMode="numeric"
          min={SIZE_MIN}
          max={SIZE_MAX}
          step={1}
          value={current}
          readOnly={readOnly}
          suffix={
            <Text size={1} muted style={{ paddingRight: 8 }}>
              %
            </Text>
          }
          onChange={(event) => {
            const raw = event.currentTarget.value;
            if (raw === '') return commit(SIZE_DEFAULT);
            commit(Number(raw));
          }}
        />
      </div>
      <Button
        mode="bleed"
        tone="default"
        fontSize={1}
        text="Reset"
        disabled={readOnly || !changed}
        onClick={() => commit(SIZE_DEFAULT)}
      />
    </Flex>
  );
}
