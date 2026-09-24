import {  CalendarDays, Leaf, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@phosphor-icons/react";

const HeroSection = () => {
  return (
    <section className="overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-8 md:grid-cols-[1.05fr_0.95fr] md:pb-14 md:pt-14">
        <div>
          <Badge
            variant="outline"
            className="mb-6 rounded-full border-muted-foreground/20 bg-secondary/40 px-4 py-1.5 text-muted-foreground"
          >
            Your plants, a little easier to care for.
          </Badge>

          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.05] tracking-[-0.04em] text-[#263626] md:text-7xl">
            Know your plants.
            <span className="block text-ochre">Care for them better.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground/80 md:text-lg">
            Potter is a plant companion that helps you organize your plants,
            keep up with care, understand health concerns, and get AI-powered
            guidance when something doesn't look right.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/login" className="button-custom">
              Get Potter
              <ArrowRightIcon />
            </Link>

            <Button
              size="lg"
              variant="ghost"
              className="rounded-full px-6 text-[#4f5e50] hover:bg-[#f0eee7]"
            >
              <a href="#features">Explore</a>
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap gap-6 text-sm text-[#697269]">
            <div className="flex items-center gap-2">
              <Leaf className="size-4 text-[#789374]" />
              Plant collection
            </div>

            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-[#789374]" />
              AI-powered insights
            </div>

            <div className="flex items-center gap-2">
              <CalendarDays className="size-4 text-[#789374]" />
              Care scheduling
            </div>
          </div>
        </div>

        <HeroIllustration />
      </div>
    </section>
  );
};

const HeroIllustration = () => {
  return (
    <div className="relative mx-auto w-full max-w-125">
      <div className="absolute -left-6 top-12 size-28 rounded-full bg-secondary/10 blur-2xl" />
      <div className="absolute -right-4 bottom-12 size-36 rounded-full bg-ochre/10 blur-3xl" />

      <div className="relative rounded-[2.5rem] border border-secondary/60 bg-secondary/20 p-2 sm:p-5 shadow-[0_30px_80px_rgba(52,68,52,0.08)]">
        <div className="rounded-[2rem] border border-[#e3dfd3] bg-card p-4 sm:p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#879087]">
                Your collection
              </p>
              <p className="mt-1 text-xl font-semibold text-[#304630]">
                12 plants
              </p>
            </div>

            <div className="rounded-full bg-[#e8efe4] px-3 py-1 text-xs font-medium text-[#587054]">
              All looking good
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <IllustratedPlant
              name="Monstera"
              status="Water today"
              variant="leaf"
            />

            <IllustratedPlant
              name="Snake Plant"
              status="Healthy"
              variant="snake"
            />

            <IllustratedPlant
              name="Palm"
              status="Sunbath tomorrow"
              variant="palm"
            />

            <IllustratedPlant
              name="Calathea"
              status="Check concern"
              variant="calathea"
            />
          </div>

          <div className="mt-5 rounded-2xl border border-[#e0e6db] bg-secondary/40 p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white p-2.5 shadow-sm">
                <Sparkles className="size-5 text-[#708969]" />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#374737]">
                  AI plant check
                </p>
                <p className="text-xs text-[#748074]">
                  Your Monstera may need more light.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

type PlantVariant = "leaf" | "snake" | "palm" | "calathea";

interface IllustratedPlantProps {
  name: string;
  status: string;
  variant: PlantVariant;
}

const IllustratedPlant = ({ name, status, variant }: IllustratedPlantProps) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-secondary/60 bg-card">
      <div className="flex h-32 items-center justify-center bg-secondary/50">
        <PlantSvg variant={variant} />
      </div>

      <div className="p-3">
        <p className="text-sm font-semibold text-[#344334]">{name}</p>
        <p className="mt-1 text-xs text-[#7a837a]">{status}</p>
      </div>
    </div>
  );
};

const PlantSvg = ({ variant }: { variant: PlantVariant }) => {
  if (variant === "snake") {
    return (
      <svg viewBox="0 0 120 120" className="h-24 w-24" aria-hidden="true">
        <path
          d="M47 95C43 72 47 51 45 23C44 17 50 12 55 18C60 31 57 57 59 95"
          fill="#789274"
        />
        <path
          d="M64 95C60 72 65 49 64 18C65 11 72 11 74 18C77 40 72 67 76 95"
          fill="#597454"
        />
        <rect x="35" y="92" width="48" height="14" rx="6" fill="#b7895f" />
      </svg>
    );
  }

  if (variant === "palm") {
    return (
      <svg viewBox="0 0 120 120" className="h-24 w-24" aria-hidden="true">
        <path
          d="M58 93C59 74 59 52 59 36"
          stroke="#60785c"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path d="M59 38C44 26 31 27 21 31C35 37 45 42 59 41" fill="#789274" />
        <path d="M60 37C72 23 84 20 98 24C84 31 74 37 60 41" fill="#6b8565" />
        <path d="M60 42C45 45 35 52 31 62C44 57 53 52 60 46" fill="#557051" />
        <path d="M61 42C76 43 87 50 94 59C80 56 70 51 61 47" fill="#789274" />
        <rect x="38" y="92" width="42" height="14" rx="6" fill="#b7895f" />
      </svg>
    );
  }

  if (variant === "calathea") {
    return (
      <svg viewBox="0 0 120 120" className="h-24 w-24" aria-hidden="true">
        <ellipse cx="44" cy="47" rx="17" ry="28" fill="#678261" />
        <ellipse cx="76" cy="47" rx="17" ry="28" fill="#789274" />
        <ellipse cx="59" cy="37" rx="16" ry="29" fill="#557051" />
        <path
          d="M59 61C59 74 58 84 58 95"
          stroke="#5c7457"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <rect x="37" y="92" width="44" height="14" rx="6" fill="#b7895f" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 120 120" className="h-24 w-24" aria-hidden="true">
      <path
        d="M60 94C58 77 58 59 61 40"
        stroke="#557051"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path d="M59 51C45 39 31 39 22 44C36 51 46 55 60 55" fill="#789274" />
      <path d="M60 45C71 30 83 25 99 28C86 37 76 44 61 50" fill="#688563" />
      <path d="M60 62C47 57 34 60 24 68C39 69 50 67 60 64" fill="#597454" />
      <path d="M61 58C75 54 89 57 99 66C84 68 73 65 61 61" fill="#789274" />
      <circle cx="71" cy="48" r="4" fill="#e8efe4" />
      <circle cx="42" cy="51" r="4" fill="#e8efe4" />
      <rect x="37" y="92" width="45" height="14" rx="6" fill="#b7895f" />
    </svg>
  );
};

export default HeroSection;
