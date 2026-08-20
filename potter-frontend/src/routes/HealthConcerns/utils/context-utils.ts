type ConcernAnswers = {
  symptoms?: string;
  duration?: string;
  care_changes?: string;
  additional_context?: string;
};

const symptomLabels: Record<string, string> = {
  leaf_drop: "leaves are falling off",
  yellowing: "the leaves are turning yellow",
  wilting: "the leaves are wilting or drooping",
  spots: "there are spots or discoloration",
  pests: "there may be pests or insects",
  growth: "there are unusual growth changes",
  stem: "there are changes to the stem",
  soil: "there are changes to the soil",
};

const durationLabels: Record<string, string> = {
  today: "today",
  few_days: "a few days",
  week: "about a week",
  few_weeks: "a few weeks",
  month_plus: "more than a month",
  unsure: "an unknown period of time",
};

const careChangeLabels: Record<string, string> = {
  watering: "watering",
  light: "light or location",
  soil: "soil or repotting",
  fertilizer: "fertilizer or nutrients",
  temperature: "temperature or environment",
  none: "no recent care changes",
  unsure: "an unknown care change",
};

export function generateInitialContext(answers: ConcernAnswers): string {
  const parts: string[] = [];

  if (answers.symptoms) {
    const symptom = symptomLabels[answers.symptoms] ?? answers.symptoms;

    parts.push(`The user reports that ${symptom}.`);
  }

  if (answers.duration) {
    const duration = durationLabels[answers.duration] ?? answers.duration;

    parts.push(`This has been happening for ${duration}.`);
  }

  if (answers.care_changes) {
    const change =
      careChangeLabels[answers.care_changes] ?? answers.care_changes;

    parts.push(`The user reports a recent change involving ${change}.`);
  }

  if (answers.additional_context) {
    parts.push(`Additional context: ${answers.additional_context}.`);
  }

  return parts.join(" ");
}
