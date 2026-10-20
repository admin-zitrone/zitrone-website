/** Child process for blog-cms-outage.test.ts: runs one blog loader and prints
 * whether it resolved or rejected. */
export {}

const [, , loaderName = "", ...args] = process.argv

const loaders = (await import("../../../src/payload/loaders/blog")) as unknown as Record<
  string,
  (...input: string[]) => Promise<unknown>
> & { getBlogContentSource: () => string }

if (loaders.getBlogContentSource() !== "cms") {
  console.log(`SOURCE:${loaders.getBlogContentSource()}`)
} else {
  try {
    const result = await loaders[loaderName](...args)
    console.log(`RESOLVED:${JSON.stringify(result).slice(0, 200)}`)
  } catch {
    console.log("REJECTED")
  }
}
process.exit(0)
