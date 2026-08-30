import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type {
  NumberQuestion,
  QuestionHandlerProps,
  TextQuestion,
} from "@/types/assessment";

const InputHandler = ({
  payload,
  onSubmit,
}: QuestionHandlerProps<TextQuestion | NumberQuestion>) => {
  const { id, required, input_type, prompt } = payload;

  const [value, setValue] = useState("");

  const handleSubmit = () => {
    if (required && !value.trim()) {
      return;
    }

    if (input_type === "number") {
      const numberValue = Number(value);

      if (Number.isNaN(numberValue)) {
        return;
      }

      onSubmit(numberValue, String(numberValue));
      return;
    }

    onSubmit(value.trim(), value.trim());
  };

  const isInvalid = required && value.trim().length === 0;

  return (
    <div className="space-y-4">
      <Label className="text-lg" htmlFor={id}>
        {prompt}
      </Label>

      <Input
        id={id}
        type={input_type === "number" ? "number" : "text"}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        aria-required={required}
        aria-invalid={isInvalid}
      />

      <button type="button" onClick={handleSubmit} disabled={isInvalid}>
        Continue
      </button>
    </div>
  );
};

export default InputHandler;
