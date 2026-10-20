import type { GlobalConfig } from "payload"

import {
  CtaBlock,
  FaqBlock,
  FeaturedMediaBlock,
  HeroBlock,
  OperatingSystemBlock,
  ProfilerBlock,
  ProofBentoBlock,
  ServiceSystemSliderBlock,
  ServicesCarouselBlock,
  StoriesBlock,
} from "../blocks"
import { seoField } from "../fields/seo"
import { revalidateHomeGlobal } from "../hooks/revalidate"
import { contentEditorAccess } from "../access/roles"

export const Home: GlobalConfig = {
  slug: "home",
  label: { en: "Homepage", es: "Página principal" },
  versions: { drafts: { autosave: true } },
  access: { read: () => true, update: contentEditorAccess },
  admin: {
    group: "Pages",
    description:
      "Edit the homepage section by section. Each block controls one visible part of the page.",
  },
  fields: [
    {
      name: "meta",
      type: "group",
      label: "Page title and search preview",
      fields: [
        { name: "title", type: "text", label: "Browser / search title", localized: true, required: true },
        { name: "description", type: "textarea", label: "Search description", localized: true, required: true },
        { name: "siteName", type: "text", label: "Site name", localized: true },
        { name: "ogImage", type: "upload", label: "Share image", relationTo: "media" },
      ],
    },
    {
      name: "sections",
      type: "blocks",
      label: "Homepage sections",
      localized: true,
      minRows: 1,
      admin: { description: "Reorder sections by dragging. Edit each block to change what visitors see." },
      blocks: [
        HeroBlock,
        ServicesCarouselBlock,
        ProofBentoBlock,
        FeaturedMediaBlock,
        OperatingSystemBlock,
        ServiceSystemSliderBlock,
        ProfilerBlock,
        StoriesBlock,
        FaqBlock,
        CtaBlock,
      ],
    },
    seoField,
  ],
  hooks: {
    afterChange: [revalidateHomeGlobal],
  },
}
