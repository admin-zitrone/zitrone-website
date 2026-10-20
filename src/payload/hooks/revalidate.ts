import { revalidatePath } from "next/cache"

import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from "payload"

const LOCALES = ["en", "es"] as const

function safeRevalidate(path: string, type?: "layout" | "page") {
  if (process.env.PAYLOAD_DISABLE_REVALIDATE === "true") {
    return
  }

  try {
    revalidatePath(path, type)
  } catch (error) {
    console.warn(`[revalidate] skipped ${path}:`, error)
  }
}

/* The home content also renders the navigation and footer of every page and the
   shared sections of the service pages (getResolvedHomeContent in
   /[locale]/layout), so a change to it refreshes the whole locale tree, not
   only the home URLs. */
function revalidateHome() {
  safeRevalidate("/[locale]", "layout")
  // The bare domain redirects into a locale but is cached on its own.
  safeRevalidate("/")
}

/** Every blog page (index, articles, categories, authors, reviewers) in both
    locales, then the sitemap that lists them.

    revalidatePath works on the route file structure, not on URLs: the blog
    layout lives at `/[locale]/blog`, and that pattern with type "layout" is
    the tag every blog page carries (`_N_T_/[locale]/blog/layout`). A literal
    `/es/blog` + "layout" targets a layout that does not exist and silently
    invalidates nothing, which left unpublished articles cached. Slugs are
    localized, so a post's other-locale URL is not on `doc`; the layout
    pattern covers old and new URLs alike. */
function revalidateBlogTree() {
  safeRevalidate("/[locale]/blog", "layout")
  // The sitemap lists every post; it is outside the blog subtree.
  safeRevalidate("/sitemap.xml")
}

/* Categories and site settings render in the header, filters and footer of
   every blog page, not only the index. */
const revalidateBlogIndex = revalidateBlogTree

function revalidateGlobalPage(path: string) {
  for (const locale of LOCALES) {
    safeRevalidate(`/${locale}/${path}`)
  }
}

export const revalidateHomeCollection: CollectionAfterChangeHook = () => {
  revalidateHome()
}

export const revalidateHomeOnDelete: CollectionAfterDeleteHook = () => {
  revalidateHome()
}

export const revalidateHomeGlobal: GlobalAfterChangeHook = () => {
  revalidateHome()
}

export const revalidateAllPages: GlobalAfterChangeHook = () => {
  revalidateHome()
  revalidateBlogIndex()
  revalidateGlobalPage("privacy-notice")
}

export const revalidateBlogPostCollection: CollectionAfterChangeHook = () => {
  revalidateBlogTree()
}

export const revalidateBlogPostOnDelete: CollectionAfterDeleteHook = () => {
  revalidateBlogTree()
}

export const revalidateBlogIndexGlobal: GlobalAfterChangeHook = () => {
  revalidateBlogIndex()
}

export const revalidateBlogIndexCollection: CollectionAfterChangeHook = () => {
  revalidateBlogIndex()
}

export const revalidateBlogIndexOnDelete: CollectionAfterDeleteHook = () => {
  revalidateBlogIndex()
}

export const revalidatePrivacyGlobal: GlobalAfterChangeHook = () => {
  revalidateGlobalPage("privacy-notice")
}
