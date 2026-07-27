// Run: node scripts/test-translate.ts
import assert from 'node:assert/strict';
import { buildDict, translate } from '../src/lib/translate.ts';

const dict = buildDict([
  { from: 'About me', to: 'Tentang saya' },
  { from: 'Contact', to: 'Kontak' },
  { from: '', to: 'ignored' },
  { from: 'no target' },
]);

assert.equal(dict.size, 2);

const source = {
  _id: 'landingPage',
  _type: 'landingPage',
  about: { heading: 'About me', body: '  About me  ', url: 'About me' },
  navigation: { links: [{ label: 'Contact', url: '#contact' }] },
  hero: { backgroundImage: { alt: 'About me' }, ctaHref: '#projects', ctaLabel: 'Untranslated' },
  cv: { showDownloadButton: true, phone: 'Contact' },
};
const out = translate(source, dict);

assert.equal(out.about.heading, 'Tentang saya');
assert.equal(out.about.body, 'Tentang saya', 'padded strings should still match');
assert.equal(out.about.url, 'About me', 'url must never be translated');
assert.equal(out.navigation.links[0].label, 'Kontak');
assert.equal(out.navigation.links[0].url, '#contact');
assert.equal(out.hero.backgroundImage.alt, 'About me', 'image objects are left alone');
assert.equal(out.hero.ctaLabel, 'Untranslated', 'missing entries fall back to source');
assert.equal(out.cv.phone, 'Contact', 'phone must never be translated');
assert.equal(out.cv.showDownloadButton, true, 'non-strings pass through');
assert.equal(out._id, 'landingPage');
assert.notEqual(out, source, 'returns a copy');

// Empty dictionary is the identity (source language).
assert.equal(translate(source, buildDict([])), source);

console.log('✓ translate');
