import {
  ClockClockwiseIcon,
  PlantIcon,
  WarningDiamondIcon,
} from "@phosphor-icons/react";

const ConcernBanner = ({
  needAttention,
  resolved,
  monitoring,
}: {
  resolved?: number;
  monitoring?: number;
  needAttention?: number;
}) => {
  return (
    <section>
      <div
        style={{
          backgroundImage: "url('plant-banner-3.jpg')",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
        className="relative w-full rounded-2xl overflow-hidden flex flex-col justify-center p-10 gap-6 h-64"
      >
        <div className="absolute inset-0 bg-linear-to-r from-black/40 via-black/20 to-black/10" />

        <div className="relative z-1 flex flex-col gap-2">
          <h1 className="text-5xl text-primary-foreground text-playfair font-medium">
            Plant Concerns
          </h1>

          <p className="text-sm text-muted">
            Spot issues early. Healthier plants, happier days.
          </p>
        </div>

        <div className="relative z-1 flex gap-4">
          {/* Need Attention count */}
          {needAttention && needAttention > 0 ? (
            <div className="bg-secondary/30 px-4 py-2 rounded-lg flex items-center gap-2">
              <WarningDiamondIcon
                size={24}
                weight="light"
                className="text-ochre"
              />
              <div>
                <span className="text-primary-foreground text-md font-semibold">
                  {needAttention}
                </span>
                <p className="text-muted text-xs font-extralight">
                  Needs attention
                </p>
              </div>
            </div>
          ) : null}

          {resolved ? (
            <div className="bg-secondary/30 px-4 py-2 rounded-lg flex items-center gap-2">
              <PlantIcon size={24} weight="light" className="text-green-300" />
              <div>
                <span className="text-primary-foreground text-md font-semibold">
                  {resolved}
                </span>
                <p className="text-muted text-xs font-extralight">Resolved</p>
              </div>
            </div>
          ) : null}

          {monitoring ? (
            <div className="bg-secondary/30 px-4 py-2 rounded-lg flex items-center gap-2">
              <ClockClockwiseIcon
                size={24}
                weight="light"
                className="text-muted"
              />
              <div>
                <span className="text-primary-foreground text-md font-semibold">
                  {monitoring}
                </span>
                <p className="text-muted text-xs font-extralight">Monitoring</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default ConcernBanner;
