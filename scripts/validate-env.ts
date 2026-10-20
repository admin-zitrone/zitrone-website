import { assertLaunchEnvironment, serverEnv } from "../src/env/server"

const isLaunchMode = process.argv.includes("--launch")

if (isLaunchMode) {
  assertLaunchEnvironment()
}

console.log(
  [
    "Environment validation passed.",
    `mode=${isLaunchMode ? "launch" : "runtime"}`,
    `sentryBuildCredentials=${serverEnv.hasSentryBuildCredentials}`,
  ].join(" "),
)
