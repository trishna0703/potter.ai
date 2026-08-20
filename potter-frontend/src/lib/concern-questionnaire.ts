export const QUESTIONNAIRE = [
  {
    name: "symptoms",
    required: true,
    prompt: "What are you noticing with your plant?",
    description: "Choose the symptoms that best describe the problem.",
    choices: [
      {
        value: "yellowing",
        label: "Leaves are turning yellow",
        description: "Some or all leaves are becoming yellow or pale.",
      },
      {
        value: "wilting",
        label: "Leaves are wilting or drooping",
        description: "The plant looks limp, weak, or unusually droopy.",
      },
      {
        value: "spots",
        label: "Spots or discoloration",
        description: "You notice brown, black, white, or unusual marks.",
      },
      {
        value: "leaf_drop",
        label: "Leaves are falling off",
        description: "The plant is losing leaves unexpectedly.",
      },
      {
        value: "growth",
        label: "Unusual or slow growth",
        description:
          "The plant isn't growing normally or new growth looks unusual.",
      },
      {
        value: "pests",
        label: "I see pests or insects",
        description: "You notice bugs, webbing, eggs, or other signs of pests.",
      },
      {
        value: "stem",
        label: "Something looks wrong with the stem",
        description:
          "The stem is soft, damaged, discolored, or changing shape.",
      },
      {
        value: "soil",
        label: "Something looks wrong with the soil",
        description:
          "You notice mold, unusual moisture, odor, or other soil changes.",
      },
    ],
    input: {
      label: "Something else",
      placeholder: "Describe what you're noticing…",
    },
  },
  {
    name: "duration",
    required: true,
    prompt: "How long has this been happening?",
    description: "An approximate timeframe is enough.",
    choices: [
      {
        value: "today",
        label: "Today",
      },
      {
        value: "few_days",
        label: "A few days",
      },
      {
        value: "week",
        label: "About a week",
      },
      {
        value: "few_weeks",
        label: "A few weeks",
      },
      {
        value: "month_plus",
        label: "More than a month",
      },
      {
        value: "unsure",
        label: "I'm not sure",
      },
    ],
  },
  {
    name: "care_changes",
    required: false,
    prompt: "Have you changed anything about the plant's care recently?",
    description: "For example, watering, light, location, soil, or fertilizer.",
    choices: [
      {
        value: "watering",
        label: "Watering",
      },
      {
        value: "light",
        label: "Light or location",
      },
      {
        value: "soil",
        label: "Soil or repotting",
      },
      {
        value: "fertilizer",
        label: "Fertilizer or nutrients",
      },
      {
        value: "temperature",
        label: "Temperature or environment",
      },
      {
        value: "none",
        label: "Nothing changed",
      },
      {
        value: "unsure",
        label: "I'm not sure",
      },
    ],
    input: {
      label: "Something else",
      placeholder: "Tell us about the change…",
    },
  },
];
