import { Button } from "#components/ui/button";
import { useNavigate } from "react-router-dom";

import { formatRelativeDate } from "./utils/draft-concern-utils";
import useGetConcerns from "./hooks/useGetConcerns";

const HealthConcerns = ({}) => {
  const { allActiveConcerns } = useGetConcerns();

  const navigate = useNavigate();

  return (
    <div className="p-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Health Concerns</h1>
          <p className="mt-1 text-sm text-gray-500">
            This page shows all health concerns raised for your plants.
          </p>
        </div>
      </header>

      {allActiveConcerns && allActiveConcerns.data ? (
        <section className="h-auto flex flex-col gap-4 pt-8 w-full">
          <h2>Active concerns</h2>
          <div className="flex gap-4 flex-wrap">
            {allActiveConcerns.data.map((concern) => (
              <div
                key={concern.id}
                className="flex flex-col gap-2 items-center"
              >
                <Button
                  variant={"outline"}
                  className={
                    "h-20 w-20 px-0 rounded-2xl overflow-hidden shadow-xl cursor-pointer"
                  }
                  onClick={() => navigate(`active/${concern.id}`)}
                >
                  {/* <img
                    src={S3_URL + "/" + concern.object_key}
                    alt=""
                    className="size-full"
                  /> */}
                </Button>

                <p className="text-primary/50 text-xs">
                  {formatRelativeDate(concern.reported_on)}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
};

export default HealthConcerns;
