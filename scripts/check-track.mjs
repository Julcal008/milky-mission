#!/usr/bin/env node
/**
 * Track guard — blocks commits that touch files outside your track.
 * Owner: Integrator.
 *
 * Setup (once per clone):
 *   git config --local milky.track core|experience|data|all
 *   git config --local core.hooksPath .githooks
 *
 * `all` is reserved for the integrator. Emergencies can bypass with
 * `git commit --no-verify`, but the human must approve it.
 */
import { execSync } from 'node:child_process'

const TRACKS = {
  core: {
    label: 'Track A — Core & Simulation',
    paths: [
      'src/engine/',
      'src/store/mission.ts',
      'docs/CONTRACT.md',
      'docs/state/core.md',
    ],
  },
  experience: {
    label: 'Track B — Experience & Visual',
    paths: [
      'src/app/',
      'src/ui/',
      'src/styles/',
      'src/i18n/',
      'src/store/ui.ts',
      'public/',
      'docs/DESIGN_SYSTEM.md',
      'docs/state/experience.md',
    ],
  },
  data: {
    label: 'Track C — Data & Content',
    paths: [
      'src/data/',
      'src/content/',
      'docs/GAME_DATA.md',
      'docs/NASA_DATA.md',
      'docs/DATA_PROVENANCE.md',
      'docs/SUBMISSION_EN.md',
      'docs/state/data.md',
    ],
  },
  all: { label: 'Integrator', paths: [''] },
}

const VALID = Object.keys(TRACKS).join(' | ')

function git(args) {
  return execSync(`git ${args}`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
}

function configuredTrack() {
  try {
    return git('config --get milky.track').trim()
  } catch {
    return ''
  }
}

const track = configuredTrack()

if (!track) {
  console.error('\n[track guard] No track configured for this clone.')
  console.error('Run one of these, then commit again:')
  console.error('  git config --local milky.track core        # Track A')
  console.error('  git config --local milky.track experience  # Track B')
  console.error('  git config --local milky.track data        # Track C')
  console.error('  git config --local milky.track all         # integrator only\n')
  process.exit(1)
}

if (!TRACKS[track]) {
  console.error(`\n[track guard] Unknown track "${track}". Valid values: ${VALID}\n`)
  process.exit(1)
}

if (track === 'all') {
  process.exit(0)
}

const spec = TRACKS[track]
let staged = ''
try {
  staged = git('diff --cached --name-only --diff-filter=ACMRD')
} catch {
  staged = ''
}

const files = staged
  .split('\n')
  .map((file) => file.trim())
  .filter(Boolean)

const isAllowed = (file) => spec.paths.some((prefix) => file === prefix || file.startsWith(prefix))
const offending = files.filter((file) => !isAllowed(file))

if (offending.length > 0) {
  console.error(`\n[track guard] ${spec.label} cannot commit these files:\n`)
  for (const file of offending) {
    console.error(`  - ${file}`)
  }
  console.error('\nAllowed paths for your track:')
  for (const prefix of spec.paths) {
    console.error(`  + ${prefix}`)
  }
  console.error('\nMove the change to its owner, or set the correct track with:')
  console.error(`  git config --local milky.track ${VALID}\n`)
  console.error('Never bypass this with --no-verify unless a human explicitly approves.\n')
  process.exit(1)
}

console.log(`[track guard] ${spec.label}: ${files.length} file(s) inside scope.`)
