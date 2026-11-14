/**
 * Brand mark: a planet, an orbit and a warm "milky" point at apogee.
 * Decorative only — always accompanied by the wordmark text in the header.
 */
export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      role="img"
      aria-label="Milky Mission"
    >
      <circle cx="30" cy="34" r="12" stroke="var(--color-ink)" strokeWidth="2.5" />
      <ellipse
        cx="32"
        cy="30"
        rx="22"
        ry="9"
        stroke="var(--color-ion)"
        strokeWidth="2"
        transform="rotate(-18 32 30)"
      />
      <circle cx="50" cy="22" r="4" fill="var(--color-milk)" />
    </svg>
  )
}
