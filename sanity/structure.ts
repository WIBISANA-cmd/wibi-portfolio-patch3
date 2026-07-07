import type { StructureResolver } from 'sanity/structure';

// Document types that must exist as exactly one document (singletons).
export const SINGLETON_TYPES = new Set(['landingPage']);

// Actions a singleton is allowed to keep (no create / delete / duplicate).
export const SINGLETON_ACTIONS = new Set(['publish', 'discardChanges', 'restore']);

/**
 * Custom desk structure:
 *  - "Landing Page" is rendered as a single, fixed document (documentId pinned).
 *  - Every other schema type keeps the normal document-list behaviour.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Landing Page')
        .id('landingPage')
        .child(
          S.document().schemaType('landingPage').documentId('landingPage')
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) => !SINGLETON_TYPES.has(listItem.getId() as string)
      ),
    ]);
