import { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "#components/ui/checkbox";

import type {
  BooleanQuestion,
  MultipleChoiceQuestion,
  QuestionHandlerProps,
  SingleChoiceQuestion,
} from "@/types/assessment";
import { Button } from "#components/ui/button";

const SelectHandler = ({
  payload,
  onSubmit,
}: QuestionHandlerProps<
  SingleChoiceQuestion | MultipleChoiceQuestion | BooleanQuestion
>) => {
  const { id, required, options, input_type, prompt } = payload;

  const [singleValue, setSingleValue] = useState<string>("");
  const [multipleValues, setMultipleValues] = useState<string[]>([]);
  const [booleanValue, setBooleanValue] = useState<string>("");

  const handleMultipleChange = (value: string, checked: boolean) => {
    setMultipleValues((current) =>
      checked ? [...current, value] : current.filter((item) => item !== value),
    );
  };

  const handleSubmit = () => {
    if (required) {
      if (input_type === "single_choice" && !singleValue) {
        return;
      }

      if (input_type === "multiple_choice" && multipleValues.length === 0) {
        return;
      }

      if (input_type === "boolean" && !booleanValue) {
        return;
      }
    }

    switch (input_type) {
      case "single_choice":
        onSubmit(singleValue);
        break;

      case "multiple_choice":
        onSubmit(multipleValues);
        break;

      case "boolean":
        onSubmit(booleanValue === "true");
        break;
    }
  };

  return (
    <div className="space-y-4">
      <Label className="text-lg">{prompt}</Label>

      {input_type === "single_choice" && (
        <RadioGroup
          value={singleValue}
          onValueChange={setSingleValue}
          aria-labelledby={id}
        >
          {options.map((option) => (
            <Label
              key={option.value}
              htmlFor={`${id}-${option.value}`}
              className="flex items-center gap-2 border-[0.5px] p-4 rounded-lg cursor-pointer hover:bg-secondary/30"
            >
              <RadioGroupItem
                value={option.value}
                id={`${id}-${option.value}`}
              />

              <span>{option.label}</span>
            </Label>
          ))}
        </RadioGroup>
      )}

      {input_type === "multiple_choice" && (
        <div className="space-y-3">
          {options.map((option) => {
            const checked = multipleValues.includes(option.value);

            return (
              <Label
                key={option.value}
                htmlFor={`${id}-${option.value}`}
                className="flex items-center gap-2 border-[0.5px] p-4 rounded-lg cursor-pointer hover:bg-secondary/30"
              >
                <Checkbox
                  id={`${id}-${option.value}`}
                  checked={checked}
                  onCheckedChange={(value) =>
                    handleMultipleChange(option.value, value === true)
                  }
                />

                <span>{option.label}</span>
              </Label>
            );
          })}
        </div>
      )}

      {input_type === "boolean" && (
        <RadioGroup
          value={booleanValue}
          onValueChange={setBooleanValue}
          aria-labelledby={id}
        >
          <Label
            htmlFor={`${id}-yes`}
            className="flex items-center gap-2 border-[0.5px] p-4 rounded-lg cursor-pointer hover:bg-secondary/30"
          >
            <RadioGroupItem value="true" id={`${id}-yes`} />
            <span>Yes</span>
          </Label>

          <Label
            htmlFor={`${id}-no`}
            className="flex items-center gap-2 border-[0.5px] p-4 rounded-lg cursor-pointer hover:bg-secondary/30"
          >
            <RadioGroupItem value="false" id={`${id}-no`} />
            <span>No</span>
          </Label>
        </RadioGroup>
      )}

      <div className="w-full text-end">
        <Button
          onClick={handleSubmit}
          disabled={
            required &&
            ((input_type === "single_choice" && !singleValue) ||
              (input_type === "multiple_choice" &&
                multipleValues.length === 0) ||
              (input_type === "boolean" && !booleanValue))
          }
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default SelectHandler;
