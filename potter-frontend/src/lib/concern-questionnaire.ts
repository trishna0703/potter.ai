export const QUESTIONNAIRE = [
  {
    name: "symptoms",
    required: true,
    prompt: "What are you noticing with your plant?",
    description: "Choose the symptoms that best describe the problem.",
    choices: [
      {
        icon: "/yellowing.png",
        value: "yellowing",
        label: "Leaves are turning yellow",
        description: "Some or all leaves are becoming yellow or pale.",
      },
      {
        icon: "/wilting.png",
        value: "leaf_drop",
        label: "Leaves are falling off",
        description: "The plant is losing leaves unexpectedly.",
      },
      {
        icon: "/growth.png",
        value: "growth",
        label: "Unusual or slow growth",
        description:
          "The plant isn't growing normally or new growth looks unusual.",
      },
      {
        icon: "/bugs.png",
        value: "pests",
        label: "I see pests or insects",
        description: "You notice bugs, webbing, eggs, or other signs of pests.",
      },
    ],
    input: {
      label: "Something else?",
      placeholder:
        "Describe what you're noticing. Clarity will help us with the diagnosis.",
    },
  },
  {
    name: "duration",
    required: true,
    prompt: "How long has this been happening?",
    description: "An approximate timeframe is enough.",
    choices: [
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
    ],
    input: {
      label: "Don't know?",
      placeholder:
        "If you don't know or know exactly when it started happening, mention here.",
    },
  },
  {
    name: "care_changes",
    required: true,
    prompt: "Have you changed anything about the plant's care recently?",
    description: "For example, watering, light, location, soil, or fertilizer.",
    choices: [
      {
        value: "watering",
        label: "Watering",
      },
      {
        value: "light_or_location",
        label: "Light or location",
      },
      {
        value: "soil_or_repotting",
        label: "Soil or repotting",
      },
      {
        value: "temperature_or_environment",
        label: "Temperature or environment",
      },
      {
        value: "fertilizer",
        label: "Fertilizer or nutrients",
      },
      {
        value: "nothing_changed",
        label: "Nothing changed",
      },
    ],
    input: {
      label: "Something else",
      placeholder:
        "Tell us about the change… (If you moved it from the nursery to your home, mention the change in environment. This will help us better.)",
    },
  },
] as const;
