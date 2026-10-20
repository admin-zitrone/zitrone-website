import { getPayload } from "payload"

import payloadConfig from "../../src/payload/payload.config"

async function main() {
  const payload = await getPayload({ config: payloadConfig })
  const result = await payload.find({ collection: "media", limit: 5 })
  for (const doc of result.docs) {
    console.log(JSON.stringify(doc, null, 2))
    break
  }
  process.exit(0)
}

main()
