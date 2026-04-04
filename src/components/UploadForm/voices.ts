import type { VoiceId } from "./upload-form.schema"

export type VoiceOption = {
  id: VoiceId
  name: string
  description: string
  group: "male" | "female"
}

export const VOICES: VoiceOption[] = [
  {
    id: "dave",
    name: "Dave",
    description: "Steady, clear delivery for focused interviews.",
    group: "male",
  },
  {
    id: "daniel",
    name: "Daniel",
    description: "Warm baritone suited to long-form conversations.",
    group: "male",
  },
  {
    id: "chris",
    name: "Chris",
    description: "Upbeat and articulate for energetic sessions.",
    group: "male",
  },
  {
    id: "rachel",
    name: "Rachel",
    description: "Friendly and precise for approachable guidance.",
    group: "female",
  },
  {
    id: "sarah",
    name: "Sarah",
    description: "Calm and expressive for reflective discussions.",
    group: "female",
  },
]

export const VOICES_MALE = VOICES.filter((v) => v.group === "male")
export const VOICES_FEMALE = VOICES.filter((v) => v.group === "female")
