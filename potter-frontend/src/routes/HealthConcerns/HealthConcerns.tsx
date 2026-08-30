import { Button } from "#components/ui/button";
import { useNavigate } from "react-router-dom";

import { formatRelativeDate } from "./utils/draft-concern-utils";
import useGetConcerns from "./hooks/useGetConcerns";
import { ROUTES, S3_URL } from "#lib/routes";
import usePlantStore from "@/store/PlantStore";
import usePlantIdentityStore, {
  type PlantIdentificationResponse,
} from "@/store/PlantIdentificationStore";
import { useState } from "react";
import { Recommendations } from "../Assessment/components/Recommendations";
import AssessmentDialog from "../Assessment/components/AssessmentDialog";
import HealthConcernSkeleton from "./Skeleton";
import NoConcernFound from "./NoConcernFound";

const HealthConcerns = ({}) => {
  const [filterByStatus, setFilterByStatus] = useState<"OPEN" | "COMPLETED">(
    "OPEN",
  );

  const { allActiveConcerns } = useGetConcerns(filterByStatus);
  const { setShowForm } = usePlantStore();
  const { setPlantIdentity } = usePlantIdentityStore();
  const navigate = useNavigate();

  const [recommendationsOpen, setRecommendationsOpen] = useState(false);
  const [assessmentOpen, setAssessmentOpen] = useState(false);

  return (
    <div className="sm:p-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Health Concerns</h1>
          <p className="mt-1 text-sm text-gray-500">
            This page shows all health concerns raised for your plants.
          </p>
        </div>
      </header>

      <div className="flex gap-4 mt-6">
        <Button
          variant={filterByStatus === "OPEN" ? "default" : "ghost"}
          onClick={() => setFilterByStatus("OPEN")}
        >
          Active
        </Button>
        <Button
          variant={filterByStatus === "COMPLETED" ? "default" : "ghost"}
          onClick={() => setFilterByStatus("COMPLETED")}
        >
          Completed
        </Button>
      </div>
      {allActiveConcerns.isLoading ? <HealthConcernSkeleton /> : null}
      {!allActiveConcerns.isLoading &&
      allActiveConcerns.data &&
      allActiveConcerns.data.length === 0 ? (
        <NoConcernFound />
      ) : null}
      {allActiveConcerns &&
      allActiveConcerns.data &&
      allActiveConcerns.data.length > 0 ? (
        <section className="h-auto flex flex-col gap-4 pt-8 w-full">
          <div className="flex gap-4 flex-col">
            {allActiveConcerns.data.map((concern) => (
              <div
                key={concern.id}
                className="flex gap-4 border-[0.5px] rounded-xl flex-col sm:flex-row"
              >
                <div className="object-cover w-full sm:w-2/5 lg:w-1/4 max-h-48 sm:max-h-64 lg:max-h-48 overflow-hidden">
                  <img
                    src={S3_URL + "/" + concern.photo_url}
                    alt=""
                    className="size-full object-cover sm:rounded-l-xl rounded-t-xl rounded-b-none sm:rounded-r-none"
                  />
                </div>

                <div className="flex gap-4 lg:flex-row flex-col p-6 w-full sm:w-3/5 lg:w-3/4">
                  <div className="flex flex-col h-full lg:w-2/3 gap-2">
                    <h3 className="text-md font-semibold text-primary">
                      {concern.identified_species}
                    </h3>
                    <p className="text-sm">{concern.initial_context}</p>
                    <p className="text-primary/50 text-xs">
                      {formatRelativeDate(concern.reported_on)}
                    </p>
                  </div>

                  <div className="flex lg:flex-col gap-2 lg:justify-center">
                    {concern.status === "COMPLETED" ? (
                      <div className="flex gap-2 lg:flex-col">
                        <Recommendations
                          open={recommendationsOpen}
                          onOpenChange={setRecommendationsOpen}
                          assessment_id={concern.assessment_id}
                        />
                        <AssessmentDialog
                          open={assessmentOpen}
                          onOpenChange={setAssessmentOpen}
                          id={concern.id}
                        />
                      </div>
                    ) : (
                      <Button
                        className={"lg:w-48"}
                        onClick={() =>
                          navigate(
                            `${ROUTES.CONCERNSACTIVE}/${concern.assessment_id}`,
                          )
                        }
                      >
                        View Concern
                      </Button>
                    )}
                    {!concern.plant_id ? (
                      <Button
                        className={"lg:w-48"}
                        variant={"secondary"}
                        onClick={() => {
                          setShowForm(true);
                          setPlantIdentity({
                            species: concern.identified_species,
                            photo_id: concern.photo_id,
                            photo_url: concern.photo_url,
                          } as PlantIdentificationResponse);
                        }}
                      >
                        Add plant
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
};

export default HealthConcerns;
