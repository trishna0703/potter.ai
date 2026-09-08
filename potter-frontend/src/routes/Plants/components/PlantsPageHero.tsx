import {
  HeartIcon,
  PlantIcon,
  WarningDiamondIcon,
} from "@phosphor-icons/react";

const PlantsPageHero = ({
  totalPlants,
  needAttention,
}: {
  totalPlants?: number;
  needAttention?: number;
}) => {
  let healthy =
    totalPlants && needAttention ? totalPlants - needAttention : totalPlants;
  return (
    <section>
      <div
        style={{
          backgroundImage: "url('plant-banner.jpg')",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
        className="relative w-full rounded-2xl overflow-hidden flex flex-col justify-center p-6 sm:p-10 gap-6 sm:h-64"
      >
        <div className="absolute inset-0 bg-linear-to-r from-black/40 via-black/20 to-black/10" />

        <div className="relative z-1 flex flex-col gap-2">
          <h1 className="text-5xl text-primary-foreground text-playfair font-medium">
            Your Plants
          </h1>

          <p className="text-sm text-muted">
            A happier home, one plant at a time.
          </p>
        </div>

        {totalPlants ? (
          <div className="relative z-1 flex gap-4">
            {/* Plant count */}
            <div className="bg-secondary/30 px-4 py-2 rounded-lg flex items-center gap-2">
              <PlantIcon size={24} weight="light" className="text-green-300" />
              <div>
                <span className="text-primary-foreground text-md font-semibold">
                  {totalPlants}
                </span>
                <p className="text-muted text-xs font-extralight">
                  Plant{totalPlants > 1 ? "s" : null}
                </p>
              </div>
            </div>

            {/* Healthy count */}
            <div className="bg-secondary/30 px-4 py-2 rounded-lg flex items-center gap-2">
              <HeartIcon size={24} weight="light" className="text-muted" />
              <div>
                <span className="text-primary-foreground text-md font-semibold">
                  {healthy}
                </span>
                <p className="text-muted text-xs font-extralight">Healthy</p>
              </div>
            </div>

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
                    {totalPlants}
                  </span>
                  <p className="text-muted text-xs font-extralight">
                    Needs attention
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default PlantsPageHero;
