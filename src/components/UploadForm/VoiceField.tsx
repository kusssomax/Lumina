import type { Control } from "react-hook-form"

import { Field, FieldTitle } from "@/components/ui/field"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"

import type { BookUploadValues } from "./upload-form.schema"
import type { VoiceOption } from "./voices"
import { VOICES_FEMALE, VOICES_MALE } from "./voices"

const voiceCardClassName =
  "flex gap-3 rounded-lg border border-border bg-card p-4 transition-colors focus-within:ring-2 focus-within:ring-ring/50"

type VoiceFieldProps = {
  control: Control<BookUploadValues>
}

function VoiceOptionCards({
  voices,
  selectedId,
}: {
  voices: VoiceOption[]
  selectedId: string
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {voices.map((v) => (
        <div
          key={v.id}
          className={cn(
            voiceCardClassName,
            selectedId === v.id &&
              "border-primary bg-secondary/40 ring-1 ring-primary/20"
          )}
        >
          <RadioGroupItem
            value={v.id}
            id={`voice-${v.id}`}
            className="mt-0.5"
          />
          <label
            htmlFor={`voice-${v.id}`}
            className="flex min-w-0 flex-1 cursor-pointer flex-col gap-1"
          >
            <span className="font-medium text-foreground">{v.name}</span>
            <span className="text-sm text-muted-foreground">
              {v.description}
            </span>
          </label>
        </div>
      ))}
    </div>
  )
}

export function VoiceField({ control }: VoiceFieldProps) {
  return (
    <FormField
      control={control}
      name="persona"
      render={({ field }) => (
        <FormItem>
          <Field>
            <FormLabel className="text-base">
              Choose Assistant Voice
            </FormLabel>
            <FormDescription className="sr-only">
              Select one assistant voice for synthesis
            </FormDescription>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="flex flex-col gap-6"
              >
                <div className="space-y-3">
                  <FieldTitle className="text-muted-foreground">
                    Male voices
                  </FieldTitle>
                  <VoiceOptionCards
                    voices={VOICES_MALE}
                    selectedId={field.value}
                  />
                </div>
                <div className="space-y-3">
                  <FieldTitle className="text-muted-foreground">
                    Female voices
                  </FieldTitle>
                  <VoiceOptionCards
                    voices={VOICES_FEMALE}
                    selectedId={field.value}
                  />
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </Field>
        </FormItem>
      )}
    />
  )
}
