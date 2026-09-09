import { cn } from "#lib/utils";

interface ProgressBarProps {
  currentStep: number;
  steps: string[];
}

const ProgressBar = ({ currentStep, steps }: ProgressBarProps) => {
  return (
    <div className="flex w-full max-w-64 items-center">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const reached = stepNumber <= currentStep;
        const isLast = index === steps.length - 1;

        return (
          <div
            key={step}
            className={cn("flex flex-1 items-center", isLast ? "flex-0" : "")}
          >
            {/* Indicator */}
            <div className="flex flex-col items-center gap-1">
              <div
                className={`rounded-full transition-all ${
                  reached
                    ? "size-3 bg-primary"
                    : "size-2 bg-muted-foreground/30"
                }`}
              />
            </div>

            {/* Connector */}
            {!isLast && (
              <div
                className={`mx-2 h-px flex-1 transition-colors ${
                  stepNumber < currentStep
                    ? "bg-primary"
                    : "bg-muted-foreground/20"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProgressBar;
