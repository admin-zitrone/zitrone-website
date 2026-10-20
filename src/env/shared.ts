type EnvMap = Record<string, string | undefined>

export class EnvValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "EnvValidationError"
  }
}

function formatError(key: string, message: string) {
  return `Invalid environment variable ${key}: ${message}`
}

export function readOptionalString(env: EnvMap, key: string) {
  const value = env[key]?.trim()
  return value ? value : undefined
}

export function readString(
  env: EnvMap,
  key: string,
  options: {
    defaultValue?: string
    pattern?: RegExp
    description?: string
  } = {},
) {
  const { defaultValue, pattern, description } = options
  const value = readOptionalString(env, key) ?? defaultValue

  if (!value) {
    throw new EnvValidationError(formatError(key, "value is required"))
  }

  if (pattern && !pattern.test(value)) {
    throw new EnvValidationError(
      formatError(key, description || `value does not match ${pattern}`),
    )
  }

  return value
}

export function readBoolean(env: EnvMap, key: string, defaultValue = false) {
  const value = readOptionalString(env, key)

  if (!value) {
    return defaultValue
  }

  if (value === "1" || value === "true") {
    return true
  }

  if (value === "0" || value === "false") {
    return false
  }

  throw new EnvValidationError(
    formatError(key, "expected boolean value 'true', 'false', '1', or '0'"),
  )
}

export function readNumberInRange(
  env: EnvMap,
  key: string,
  options: {
    defaultValue?: number
    min: number
    max: number
  },
) {
  const value = readOptionalString(env, key)

  if (!value) {
    return options.defaultValue ?? options.min
  }

  const parsed = Number(value)

  if (!Number.isFinite(parsed) || parsed < options.min || parsed > options.max) {
    throw new EnvValidationError(
      formatError(key, `expected a number between ${options.min} and ${options.max}`),
    )
  }

  return parsed
}

function normalizeBaseUrl(value: string) {
  return value.endsWith("/") ? value.slice(0, -1) : value
}

export function readOptionalUrl(env: EnvMap, key: string) {
  const value = readOptionalString(env, key)

  if (!value) {
    return undefined
  }

  try {
    return normalizeBaseUrl(new URL(value).toString())
  } catch {
    throw new EnvValidationError(formatError(key, "expected a valid absolute URL"))
  }
}

export function readUrl(
  env: EnvMap,
  key: string,
  options: {
    defaultValue?: string
  } = {},
) {
  const value = readOptionalString(env, key) ?? options.defaultValue

  if (!value) {
    throw new EnvValidationError(formatError(key, "value is required"))
  }

  try {
    return normalizeBaseUrl(new URL(value).toString())
  } catch {
    throw new EnvValidationError(formatError(key, "expected a valid absolute URL"))
  }
}

export function readOriginList(env: EnvMap, key: string) {
  const value = readOptionalString(env, key)

  if (!value) {
    return [] as string[]
  }

  return value.split(",").map((candidate) => {
    const trimmed = candidate.trim()

    try {
      return new URL(trimmed).origin
    } catch {
      throw new EnvValidationError(
        formatError(key, `contains an invalid origin: "${trimmed}"`),
      )
    }
  })
}

export function validateCompleteGroup(
  env: EnvMap,
  keys: string[],
  label: string,
) {
  const present = keys.filter((key) => Boolean(readOptionalString(env, key)))

  if (present.length > 0 && present.length !== keys.length) {
    throw new EnvValidationError(
      `${label} must be configured as a complete group. Present: ${present.join(", ")}`,
    )
  }
}
