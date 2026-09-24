import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

interface Step {
  number: string;
  title: string;
  summary: string;
  details: string;
}

const steps: Step[] = [
  {
    number: "01",
    title: "Add your plants",
    summary: "Create a plant profile or identify one from a photo.",
    details:
      "Give your plant a name, location, measurements, pot details, and any other information you want to keep. Potter keeps each plant's information together.",
  },
  {
    number: "02",
    title: "Build its routine",
    summary: "Set up the care activities that keep it healthy.",
    details:
      "Create schedules for watering, fertilizer, repotting, composting, sunbathing, and other recurring activities. Care events can also be connected to Google Calendar.",
  },
  {
    number: "03",
    title: "Raise a concern",
    summary: "When something changes, capture the evidence and context.",
    details:
      "Upload a photo, answer guided questions, and let Potter build a structured assessment instead of forcing you to figure out what information matters first.",
  },
  {
    number: "04",
    title: "Get AI-powered guidance",
    summary: "Understand possible causes and what you can do next.",
    details:
      "Potter uses the information collected during the assessment to generate a diagnosis-oriented assessment, ranked recommendations, and relevant plant-care knowledge.",
  },
  {
    number: "05",
    title: "Keep learning from the history",
    summary: "Your plants build context over time.",
    details:
      "Care events, concerns, recommendations, and outcomes remain associated with your plants so future assessments can have more context.",
  },
];

const HowItWorksSection = () => {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 border-t border-[#e7e3d8] bg-[#f1f3ed]"
    >
      <div className="mx-auto grid max-w-6xl gap-14 px-4 py-20 md:grid-cols-[0.8fr_1.2fr] md:py-28">
        <div>
          <Badge
            variant="outline"
            className="rounded-full border-[#d2d9cd] bg-white/60 text-[#627262]"
          >
            How it works
          </Badge>

          <h2 className="mt-5 text-4xl font-semibold tracking-tight text-[#2d3d2d] md:text-5xl">
            From “what is wrong?” to “what should I do?”
          </h2>

          <p className="mt-5 text-lg leading-8 text-[#6d756d]">
            Potter brings plant tracking, care routines, photos, and AI-assisted
            assessments into one continuous workflow.
          </p>

          <div className="mt-10 hidden md:block">
            <PlantPotIllustration />
          </div>
        </div>

        <div className="rounded-[2rem] border border-[#dfe3da] bg-white px-5 py-3 md:px-7">
          <Accordion defaultValue={["step-01"]} className="w-full" multiple>
            {steps.map((step) => (
              <AccordionItem
                key={step.number}
                value={`step-${step.number}`}
                className="border-[#eceee8]"
              >
                <AccordionTrigger className="gap-4 py-6 text-left hover:no-underline">
                  <div className="flex items-start gap-4">
                    <span className="shrink-0 mt-1 bg-secondary rounded-full flex items-center justify-center size-10 text-xs font-semibold tracking-[0.18em] text-muted-foreground">
                      {step.number}
                    </span>

                    <div>
                      <p className="text-lg font-semibold text-[#374737]">
                        {step.title}
                      </p>

                      <p className="mt-1 pr-5 text-sm font-normal leading-6 text-[#7a8279]">
                        {step.summary}
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="pb-6 pl-14 pr-6 text-sm leading-7 text-[#687168]">
                  {step.details}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="md:hidden">
          <PlantPotIllustration />
        </div>
      </div>
    </section>
  );
};

const PlantPotIllustration = () => {
  return (
    <div className="relative flex h-64 items-end justify-center overflow-hidden rounded-[2rem] border border-[#dfe3da] bg-[#e8eee3]">
      <div className="absolute left-8 top-8 size-20 rounded-full bg-[#d7e2d1] blur-2xl" />
      <div className="absolute right-6 top-14 size-24 rounded-full bg-[#efe5cf] blur-3xl" />

      <svg
        viewBox="0 0 300 260"
        className="relative h-full w-full"
        aria-hidden="true"
      >
        <path
          d="M148 192C146 159 148 128 151 94"
          stroke="#5d7758"
          strokeWidth="8"
          strokeLinecap="round"
        />

        <path
          d="M151 113C124 88 96 89 77 101C102 113 126 119 151 117"
          fill="#789274"
        />

        <path
          d="M152 102C172 72 199 60 229 66C204 82 181 99 153 110"
          fill="#5f7b5b"
        />

        <path
          d="M151 134C124 120 95 124 73 141C101 143 128 143 152 138"
          fill="#698563"
        />

        <path
          d="M151 129C181 117 212 123 231 141C204 143 176 139 151 135"
          fill="#789274"
        />

        <path d="M113 172H188L178 222H122Z" fill="#b98a61" />

        <path
          d="M105 169H195C199 169 201 173 198 177H102C99 173 101 169 105 169Z"
          fill="#9e714c"
        />
      </svg>
    </div>
  );
};

export default HowItWorksSection;
