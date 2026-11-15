/**
 * Ambient layer switch. Home and the app shell are never affected.
 * Disabled for the submission: ambient rasters would need their own watermark.
 * Game screens use AiBackdrop, which carries a visible AI-generated badge.
 */
export const ENABLE_VISUAL_LAYER = false
