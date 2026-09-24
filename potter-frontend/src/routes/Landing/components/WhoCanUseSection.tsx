import { Home, Sprout, Trees, Users } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface Audience {
  title: string;
  description: string;
  icon: typeof Home;
}

const audiences: Audience[] = [
  {
    title: "New plant parents",
    description:
      "Keep the basics simple. Know what each plant needs and when it needs it.",
    icon: Sprout,
  },
  {
    title: "Houseplant lovers",
    description:
      "Organize growing collections, track care history, and keep every plant in one place.",
    icon: Home,
  },
  {
    title: "Plant collectors",
    description:
      "Track shelves, locations, species, measurements, and individual plant routines.",
    icon: Trees,
  },
  {
    title: "Curious growers",
    description:
      "Use AI-powered plant identification and health assessments when you need another perspective.",
    icon: Users,
  },
];

const WhoCanUseSection = () => {
  return (
    <section
      id="who"
      className="scroll-mt-20 border-y border-[#e7e3d8] bg-white/60"
    >
      <div className="mx-auto max-w-6xl px-4 py-20 md:py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#789078]">
            Who is Potter for?
          </p>

          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-[#2d3d2d] md:text-5xl">
            Anyone who wants fewer guesswork moments.
          </h2>

          <p className="mt-5 text-lg leading-8 text-[#6a736a]">
            Potter is designed to work whether you have one plant on your desk
            or a growing collection at home.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {audiences.map((audience) => {
            const Icon = audience.icon;

            return (
              <Card
                key={audience.title}
                className="group border-[#e4e1d7] bg-[#faf9f5] shadow-none transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(45,61,45,0.08)]"
              >
                <CardContent className="p-6">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-secondary/40 text-[#597254] transition-transform duration-300 group-hover:scale-110">
                    <Icon className="size-5" />
                  </div>

                  <h3 className="mt-6 text-lg font-semibold text-[#354435]">
                    {audience.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[#747c74]">
                    {audience.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhoCanUseSection;
