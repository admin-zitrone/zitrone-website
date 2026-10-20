import { chromium } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const browser = await chromium.launch()
try {
  for (const [locale, width] of [['es', 390], ['en', 900]]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } })
    // Preview HTML has inlined images. No website/provider traffic is needed.
    await page.route('**/*', route => route.abort())
    for (const kind of ['sales', 'confirmation']) {
      const file = `contact-${kind}.${locale}`
      await page.setContent(await readFile(resolve('.email-previews', `${file}.html`), 'utf8'))
      await page.screenshot({ path: resolve('.email-previews', `${file}.png`), fullPage: true })
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)
      if (overflow) throw new Error(`${file}: horizontal overflow`)
      console.log(`${file}: rendered at ${width}px without overflow`)
    }
    await page.close()
  }
} finally { await browser.close() }
