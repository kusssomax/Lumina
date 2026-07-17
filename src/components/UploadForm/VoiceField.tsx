import { Check } from "lucide-react"
import type { Control } from "react-hook-form"

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import type { BookUploadValues } from "./upload-form.schema"
import type { VoiceOption } from "./voices"
import { VOICES_FEMALE, VOICES_MALE } from "./voices"

type VoiceFieldProps = {
  control: Control<BookUploadValues>
}

function VoiceAvatar({ name }: { name: string }) {
  return (
    <div
      className="shrink-0 flex items-center justify-center font-medium"
      style={{
        width: "34px",
        height: "34px",
        borderRadius: "50%",
        background: "linear-gradient(135deg, var(--surface-3), var(--surface-2))",
        fontSize: "13px",
        color: "var(--text-2)",
        border: "1px solid var(--border)",
      }}
    >
      {name[0].toUpperCase()}
    </div>
  )
}

function VoiceOptionCards({
  voices,
  selectedId,
}: {
  voices: VoiceOption[]
  selectedId: string
}) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {voices.map((v) => {
        const isSelected = selectedId === v.id
        return (
          <label
            key={v.id}
            htmlFor={`voice-${v.id}`}
            className="relative flex gap-[10px] cursor-pointer transition-all duration-200"
            style={{
              padding: "11px 13px",
              border: `1px solid ${isSelected ? "var(--primary)" : "var(--border)"}`,
              borderRadius: "10px",
              background: isSelected ? "rgba(200,149,108,0.06)" : "var(--surface-2)",
            }}
          >
            <RadioGroupItem
              value={v.id}
              id={`voice-${v.id}`}
              className="sr-only"
            />
            <VoiceAvatar name={v.name} />
            <div className="flex-1 min-w-0 pt-0.5">
              <p style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-1)" }}>{v.name}</p>
              <p style={{ fontSize: "11px", color: "var(--text-3)", marginTop: "2px" }}>{v.description}</p>
            </div>
            {/* Checkmark badge */}
            {isSelected && (
              <div
                className="absolute top-2 right-2 flex items-center justify-center"
                style={{
                  width: "17px",
                  height: "17px",
                  borderRadius: "50%",
                  background: "#3a9e5a",
                }}
              >
                <Check size={10} strokeWidth={3} color="#fff" />
              </div>
            )}
          </label>
        )
      })}
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
          {/* Section label */}
          <div className="mb-[9px]">
            <span
              className="uppercase font-medium"
              style={{ fontSize: "11px", color: "var(--text-3)", letterSpacing: "0.08em" }}
            >
              Assistant Voice <span style={{ color: "var(--primary)" }}>*</span>
            </span>
          </div>

          <FormDescription className="sr-only">
            Select one assistant voice for synthesis
          </FormDescription>

          <div
            style={{
              background: "var(--surface-1)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              padding: "20px",
            }}
          >
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="flex flex-col gap-5"
              >
                <div className="space-y-2">
                  <p style={{ fontSize: "11px", color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Male
                  </p>
                  <VoiceOptionCards voices={VOICES_MALE} selectedId={field.value} />
                </div>
                <div className="space-y-2">
                  <p style={{ fontSize: "11px", color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Female
                  </p>
                  <VoiceOptionCards voices={VOICES_FEMALE} selectedId={field.value} />
                </div>
              </RadioGroup>
            </FormControl>
          </div>

          <FormMessage />
        </FormItem>
      )}
    />
  )
}
