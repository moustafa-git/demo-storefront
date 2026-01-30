import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import React from "react"
import { SKIN_TONE_OPTIONS, getSkinToneById } from "@lib/util/skin-tone-analyzer"
import SkinToneSelector from "./skin-tone-selector"

type OptionSelectProps = {
  option: HttpTypes.StoreProductOption
  current: string | undefined
  updateOption: (title: string, value: string) => void
  title: string
  disabled: boolean
  "data-testid"?: string
}

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
  "data-testid": dataTestId,
  disabled,
}) => {
  const filteredOptions = (option.values ?? []).map((v) => v.value)
  
  // Check if this option is related to skin tone
  const isSkinToneOption = () => {
    const optionTitle = title.toLowerCase()
    // More flexible: match more keywords
    return (
      optionTitle.includes('skin tone') ||
      optionTitle.includes('skin') ||
      optionTitle.includes('tone') ||
      optionTitle.includes('complexion') ||
      optionTitle.includes('color') ||
      optionTitle.includes('shade')
    )
  }

  // If it's a skin tone option, use the specialized selector
  if (isSkinToneOption()) {
    return (
      <SkinToneSelector
        option={option}
        current={current}
        updateOption={updateOption}
        title={title}
        disabled={disabled}
        data-testid={dataTestId}
      />
    )
  }

  // Default option selector for non-skin tone options
  return (
    <div className="flex flex-col gap-y-3">
      <span className="text-sm">Select {title}</span>
      <div
        className="flex flex-wrap justify-between gap-2"
        data-testid={dataTestId}
      >
        {filteredOptions.map((v) => {
          return (
            <button
              onClick={() => updateOption(option.id, v)}
              key={v}
              className={clx(
                "border-ui-border-base bg-ui-bg-subtle border text-small-regular h-10 rounded-rounded p-2 flex-1 ",
                {
                  "border-ui-border-interactive": v === current,
                  "hover:shadow-elevation-card-rest transition-shadow ease-in-out duration-150":
                    v !== current,
                }
              )}
              disabled={disabled}
              data-testid="option-button"
            >
              {v}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default OptionSelect
