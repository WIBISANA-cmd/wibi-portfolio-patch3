import type { StructureResolver } from 'sanity/structure';
import { HomeIcon, TextIcon } from '@sanity/icons';

// Document types that must exist as exactly one document (singletons).
export const SINGLETON_TYPES = new Set(['landingPage', 'themeSettings']);

// Actions a singleton is allowed to keep (no create / delete / duplicate).
export const SINGLETON_ACTIONS = new Set(['publish', 'discardChanges', 'restore']);

/**
 * Custom desk structure:
 *  - "Landing Page" and "Theme Settings" are single, fixed documents (documentId pinned).
 *  - Every other schema type keeps the normal document-list behaviour.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Landing Page')
        .id('landingPage')
        .icon(HomeIcon)
        .child(S.document().schemaType('landingPage').documentId('landingPage')),
      S.listItem()
        .title('Theme Settings')
        .id('themeSettings')
        .icon(TextIcon)
        .child(S.document().schemaType('themeSettings').documentId('themeSettings').title('Theme Settings')),
      S.divider(),
      ...S.documentTypeListItems().filter((listItem) => !SINGLETON_TYPES.has(listItem.getId() as string)),
    ]);
