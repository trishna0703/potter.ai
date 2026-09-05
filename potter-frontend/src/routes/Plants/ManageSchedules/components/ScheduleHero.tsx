import { S3_URL } from "#lib/routes";
import { Leaf } from "lucide-react";

interface ScheduleHeroProps {
  plantName: string;
  species?: string | null;
  imageUrl?: string | null;
}

export default function ScheduleHero({
  plantName,
  species,
  imageUrl,
}: ScheduleHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl">
      {imageUrl ? (
        <img
          src={S3_URL + "/" + imageUrl}
          alt={plantName}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-linear-to-r from-green-900 to-green-600" />
      )}

      <div className="absolute inset-0 bg-black/40" />

      <div className="relative flex min-h-55 flex-col justify-end p-6 text-white sm:min-h-65 sm:p-8">
        <div className="mb-2 flex items-center gap-2 text-xs text-white/80">
          <Leaf className="h-4 w-4" />
          Care schedules
        </div>

        <h1 className="text-3xl font-semibold sm:text-4xl">{plantName}</h1>

        {species && <p className="mt-1 text-sm text-white/80">{species}</p>}

        <p className="mt-3 max-w-lg text-xs md:text-sm text-white/90">
          A little consistency goes a long way. Keep your plant's care simple
          and on track.
        </p>
      </div>
    </section>
  );
}
