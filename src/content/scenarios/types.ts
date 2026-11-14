/**
 * Scenario domain copy.
 * Owner: Track C. Keys mirror `scenario.<id>.rN.title|description` in `src/i18n`;
 * Track B merges these objects into the dictionaries.
 */

export interface ScenarioRequirementCopy {
  title: string
  description: string
}

export interface ScenarioCopy {
  title: string
  summary: string
  brief: string
  r1: ScenarioRequirementCopy
  r2: ScenarioRequirementCopy
  r3: ScenarioRequirementCopy
  r4: ScenarioRequirementCopy
  r5: ScenarioRequirementCopy
  /** Storm Watch has a sixth requirement; Andes Flood Watch has five. */
  r6?: ScenarioRequirementCopy
}
