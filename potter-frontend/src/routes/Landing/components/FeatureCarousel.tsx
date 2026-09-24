import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  Camera,
  ClipboardCheck,
  Droplets,
  FolderTree,
  HeartPulse,
  Search,
  Sparkles,
} from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface Feature {
  title: string;
  eyebrow: string;
  description: string;
  icon: LucideIcon;
  detail: string;
}

const features: Feature[] = [
  {
    title: "Keep every plant organized",
    eyebrow: "Plant collection",
    description:
      "Create a home for every plant with names, species, locations, measurements, shelves, and photos.",
    icon: FolderTree,
    detail:
      "Add plants manually or identify them from a photograph, then keep their details and history together.",
  },
  {
    title: "Know what needs care",
    eyebrow: "Care schedules",
    description:
      "Track recurring watering, fertilizing, repotting, composting, and sunbathing routines.",
    icon: Droplets,
    detail:
      "Potter turns individual care routines into scheduled events so your plants don't have to rely on memory.",
  },
  {
    title: "Take a closer look",
    eyebrow: "Plant identification",
    description:
      "Upload a plant photo and use AI-powered identification to understand what you're growing.",
    icon: Search,
    detail:
      "Identification helps you connect an unknown plant to a useful profile and care routine.",
  },
  {
    title: "When something looks wrong",
    eyebrow: "Health concerns",
    description:
      "Raise a concern with photos and guided questions instead of starting from a blank chat.",
    icon: HeartPulse,
    detail:
      "Potter gathers context through a focused assessment flow and builds a structured picture of the concern.",
  },
  {
    title: "Turn observations into action",
    eyebrow: "AI recommendations",
    description:
      "Get ranked recommendations and plant-care knowledge based on the concern you're investigating.",
    icon: Sparkles,
    detail:
      "Recommendations are grounded in the information collected during the assessment and your plant's history.",
  },
  {
    title: "Keep your routine on your calendar",
    eyebrow: "Google Calendar",
    description:
      "Connect care schedules to Google Calendar so recurring plant tasks fit into your existing routine.",
    icon: CalendarDays,
    detail:
      "Care events can move through active, completed, and recurring states as your routine progresses.",
  },
  {
    title: "See the plant, not just the data",
    eyebrow: "Photo history",
    description:
      "Use plant photos and concern evidence to keep visual context alongside your records.",
    icon: Camera,
    detail:
      "Photos help you compare what changed over time and give AI features the visual context they need.",
  },
  {
    title: "Keep a record of what happened",
    eyebrow: "Care history",
    description:
      "Build a useful history of plant care and health concerns instead of starting over every time.",
    icon: ClipboardCheck,
    detail:
      "Past care events and concern outcomes become part of each plant's ongoing context.",
  },
];

const FeatureCarousel = () => {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 md:py-28">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#789078]">
            What Potter can do
          </p>

          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-[#2d3d2d] md:text-5xl">
            One place for the whole plant-care loop.
          </h2>

          <p className="mt-5 text-lg leading-8 text-[#6a736a]">
            From adding a new plant to understanding a health concern, Potter
            keeps the journey connected.
          </p>
        </div>

        <div className="hidden text-sm text-[#8a9189] md:block">
          Swipe to explore →
        </div>
      </div>

      <div className="relative mt-12">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="m-4 mx-0">
            {features.map((feature) => (
              <CarouselItem
                key={feature.title}
                className="px-2 md:basis-1/2 lg:basis-1/3"
              >
                <FeatureCard feature={feature} />
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="mt-8 flex justify-end gap-2">
            <CarouselPrevious className="static translate-y-0" />
            <CarouselNext className="static translate-y-0" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

interface FeatureCardProps {
  feature: Feature;
}

const FeatureCard = ({ feature }: FeatureCardProps) => {
  const Icon = feature.icon;

  return (
    <Card className="group h-full overflow-hidden border-[#e4e1d7] bg-card shadow-none transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(45,61,45,0.08)]">
      <CardContent className="flex h-full flex-col p-7">
        <div className="flex items-start justify-between">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-secondary/40 text-[#597254] transition-transform duration-300 group-hover:scale-105">
            <Icon className="size-5" />
          </div>

          <Badge variant="outline" className="border-[#e2e5de] text-[#7a837a]">
            {feature.eyebrow}
          </Badge>
        </div>

        <h3 className="mt-7 text-xl font-semibold text-[#354435]">
          {feature.title}
        </h3>

        <p className="mt-3 text-sm leading-6 text-[#727a72]">
          {feature.description}
        </p>

        <div className="mt-auto pt-7">
          <div className="rounded-2xl bg-secondary/40 p-4 text-sm leading-6 text-[#657065]">
            {feature.detail}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeatureCarousel;
