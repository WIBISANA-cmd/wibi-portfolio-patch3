import React, { useState } from 'react';
import { Badge, Box, Button, Card, Flex, Inline, Stack, Text, TextInput } from '@sanity/ui';
import { DesktopIcon, MobileDeviceIcon, ResetIcon, TabletDeviceIcon } from '@sanity/icons';
import { set, unset, useFormValue, type ObjectInputProps } from 'sanity';
import {
  DEFAULT_BREAKPOINTS,
  SIZE_DEFAULT,
  SIZE_MAX,
  SIZE_MIN,
  SIZE_STEP,
  type ScreenDevice,
} from '../../src/lib/fontRegistry';

interface SizeValue {
  desktop?: number;
  tablet?: number;
  mobile?: number;
}

/**
 * Responsive text size editor:
 * Allows user to customize text size across Desktop, Tablet, and Mobile screen sizes
 * with live inheritance, dynamic breakpoint indicators, and live sample preview.
 */
export function TextSizeInput(props: ObjectInputProps<SizeValue>) {
  const { value, onChange, readOnly } = props;
  const [activeDevice, setActiveDevice] = useState<ScreenDevice>('desktop');

  // Read current screen breakpoints from form state so labels update dynamically
  const formMobile = useFormValue(['screenMobile']) as number | undefined;
  const formTablet = useFormValue(['screenTablet']) as number | undefined;

  const mobileBp =
    typeof formMobile === 'number' && Number.isFinite(formMobile)
      ? formMobile
      : DEFAULT_BREAKPOINTS.mobile;
  const tabletBp =
    typeof formTablet === 'number' && Number.isFinite(formTablet)
      ? formTablet
      : DEFAULT_BREAKPOINTS.tablet;

  // Handle legacy single number values gracefully if encountered
  const normalizedValue: SizeValue =
    typeof value === 'number'
      ? { desktop: value }
      : (value as SizeValue) ?? {};

  const desktopVal = normalizedValue.desktop;
  const tabletVal = normalizedValue.tablet;
  const mobileVal = normalizedValue.mobile;

  // Inheritance chain:
  // Desktop falls back to SIZE_DEFAULT (100)
  // Tablet falls back to Desktop
  // Mobile falls back to Tablet (or Desktop)
  const effectiveDesktop = typeof desktopVal === 'number' ? desktopVal : SIZE_DEFAULT;
  const effectiveTablet = typeof tabletVal === 'number' ? tabletVal : effectiveDesktop;
  const effectiveMobile = typeof mobileVal === 'number' ? mobileVal : effectiveTablet;

  const isDesktopCustom = typeof desktopVal === 'number' && desktopVal !== SIZE_DEFAULT;
  const isTabletCustom = typeof tabletVal === 'number';
  const isMobileCustom = typeof mobileVal === 'number';

  // Current active device values
  const currentEffective =
    activeDevice === 'desktop'
      ? effectiveDesktop
      : activeDevice === 'tablet'
      ? effectiveTablet
      : effectiveMobile;

  const isCurrentCustom =
    activeDevice === 'desktop'
      ? isDesktopCustom
      : activeDevice === 'tablet'
      ? isTabletCustom
      : isMobileCustom;

  // Update helper
  const updateDeviceValue = (device: ScreenDevice, nextNumber?: number) => {
    const next: SizeValue = { ...normalizedValue };

    if (device === 'desktop') {
      if (typeof nextNumber === 'number' && nextNumber !== SIZE_DEFAULT) {
        next.desktop = Math.round(nextNumber);
      } else {
        delete next.desktop;
      }
    } else if (device === 'tablet') {
      if (typeof nextNumber === 'number' && nextNumber !== effectiveDesktop) {
        next.tablet = Math.round(nextNumber);
      } else {
        delete next.tablet;
      }
    } else if (device === 'mobile') {
      if (typeof nextNumber === 'number' && nextNumber !== effectiveTablet) {
        next.mobile = Math.round(nextNumber);
      } else {
        delete next.mobile;
      }
    }

    // Clean up empty objects
    if (next.desktop === undefined && next.tablet === undefined && next.mobile === undefined) {
      onChange(unset());
    } else {
      onChange(set(next));
    }
  };

  const commitSlider = (num: number) => {
    updateDeviceValue(activeDevice, clampSize(num));
  };

  const resetCurrent = () => {
    updateDeviceValue(activeDevice, undefined);
  };

  return (
    <Stack space={3}>
      {/* Device Switcher Tabs */}
      <Flex gap={2} wrap="wrap" align="center">
        {/* Desktop Tab */}
        <Button
          mode={activeDevice === 'desktop' ? 'default' : 'bleed'}
          tone={activeDevice === 'desktop' ? 'primary' : 'default'}
          fontSize={1}
          padding={2}
          icon={DesktopIcon}
          onClick={() => setActiveDevice('desktop')}
          text={`Desktop (> ${tabletBp}px)`}
        />
        {isDesktopCustom && (
          <Badge tone="primary" size={1} padding={1}>
            {desktopVal}%
          </Badge>
        )}

        {/* Tablet Tab */}
        <Button
          mode={activeDevice === 'tablet' ? 'default' : 'bleed'}
          tone={activeDevice === 'tablet' ? 'primary' : 'default'}
          fontSize={1}
          padding={2}
          icon={TabletDeviceIcon}
          onClick={() => setActiveDevice('tablet')}
          text={`Tablet (≤ ${tabletBp}px)`}
        />
        {isTabletCustom ? (
          <Badge tone="caution" size={1} padding={1}>
            {tabletVal}%
          </Badge>
        ) : (
          <Badge tone="default" size={1} padding={1} muted>
            Inherit ({effectiveDesktop}%)
          </Badge>
        )}

        {/* Mobile Tab */}
        <Button
          mode={activeDevice === 'mobile' ? 'default' : 'bleed'}
          tone={activeDevice === 'mobile' ? 'primary' : 'default'}
          fontSize={1}
          padding={2}
          icon={MobileDeviceIcon}
          onClick={() => setActiveDevice('mobile')}
          text={`Mobile (≤ ${mobileBp}px)`}
        />
        {isMobileCustom ? (
          <Badge tone="caution" size={1} padding={1}>
            {mobileVal}%
          </Badge>
        ) : (
          <Badge tone="default" size={1} padding={1} muted>
            Inherit ({effectiveTablet}%)
          </Badge>
        )}
      </Flex>

      {/* Active Device Controls */}
      <Card padding={3} radius={2} tone="transparent" border>
        <Stack space={3}>
          <Flex align="center" gap={3}>
            {/* Slider */}
            <input
              type="range"
              min={SIZE_MIN}
              max={SIZE_MAX}
              step={SIZE_STEP}
              value={currentEffective}
              disabled={readOnly}
              aria-label={`Text size for ${activeDevice}`}
              onChange={(e) => commitSlider(Number(e.currentTarget.value))}
              style={{
                flex: 1,
                minWidth: 0,
                accentColor: isCurrentCustom
                  ? 'var(--card-focus-ring-color, #2276fc)'
                  : '#8e9aa8',
              }}
            />

            {/* Numeric Input */}
            <div style={{ width: '6.5rem' }}>
              <TextInput
                type="number"
                inputMode="numeric"
                min={SIZE_MIN}
                max={SIZE_MAX}
                step={1}
                value={currentEffective}
                readOnly={readOnly}
                suffix={
                  <Text size={1} muted style={{ paddingRight: 8 }}>
                    %
                  </Text>
                }
                onChange={(e) => {
                  const raw = e.currentTarget.value;
                  if (raw === '') return resetCurrent();
                  commitSlider(Number(raw));
                }}
              />
            </div>

            {/* Reset Button */}
            <Button
              mode="bleed"
              tone={isCurrentCustom ? 'caution' : 'default'}
              fontSize={1}
              icon={ResetIcon}
              text={activeDevice === 'desktop' ? 'Reset' : 'Inherit'}
              title={
                activeDevice === 'desktop'
                  ? 'Reset to 100% default'
                  : 'Remove override and inherit size'
              }
              disabled={readOnly || !isCurrentCustom}
              onClick={resetCurrent}
            />
          </Flex>

          {/* Contextual Status / Helper */}
          <Flex justify="space-between" align="center">
            <Inline space={2}>
              <Text size={1} muted>
                {activeDevice === 'desktop' && (
                  <>
                    {isDesktopCustom
                      ? `Custom Desktop size: ${desktopVal}% (Standard: ${SIZE_DEFAULT}%)`
                      : `Standard design size (${SIZE_DEFAULT}%).`}
                  </>
                )}
                {activeDevice === 'tablet' && (
                  <>
                    {isTabletCustom ? (
                      <span style={{ color: 'var(--card-focus-ring-color, #2276fc)' }}>
                        Custom Tablet override: {tabletVal}%
                      </span>
                    ) : (
                      `Inheriting from Desktop (${effectiveDesktop}%). Drag slider to override for Tablet.`
                    )}
                  </>
                )}
                {activeDevice === 'mobile' && (
                  <>
                    {isMobileCustom ? (
                      <span style={{ color: 'var(--card-focus-ring-color, #2276fc)' }}>
                        Custom Mobile override: {mobileVal}%
                      </span>
                    ) : (
                      `Inheriting from ${
                        isTabletCustom ? 'Tablet' : 'Desktop'
                      } (${effectiveMobile}%). Drag slider to override for Mobile.`
                    )}
                  </>
                )}
              </Text>
            </Inline>

            {/* Live Size Preview Badge */}
            <Badge tone={currentEffective === 100 ? 'default' : 'primary'} size={1}>
              Scale: {(currentEffective / 100).toFixed(2)}x
            </Badge>
          </Flex>

          {/* Miniature Live Sample Text Preview */}
          <Card
            padding={3}
            radius={2}
            tone="inherit"
            style={{
              backgroundColor: 'var(--card-bg-color, #f4f6fa)',
              overflow: 'hidden',
              minHeight: '2.5rem',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontSize: `${Math.max(10, Math.min(36, 14 * (currentEffective / 100)))}px`,
                lineHeight: 1.25,
                fontWeight: 600,
                transition: 'font-size 0.15s ease',
              }}
            >
              The quick brown fox jumps over the lazy dog ({currentEffective}%)
            </span>
          </Card>
        </Stack>
      </Card>
    </Stack>
  );
}

function clampSize(value: number): number {
  if (!Number.isFinite(value)) return SIZE_DEFAULT;
  return Math.min(SIZE_MAX, Math.max(SIZE_MIN, value));
}
