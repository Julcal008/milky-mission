/** Tiny className joiner. Avoids pulling a dependency for two contributors. */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}
