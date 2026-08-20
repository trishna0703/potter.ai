import { Button } from "#components/ui/button";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import usePlant from "../Plants/hooks/usePlant";
import { ROUTES } from "#lib/routes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "#components/ui/dialog";
import { Input } from "#components/ui/input";
import usePhotoUpload from "./hooks/usePhotoUpload";
import {
  formatRelativeDate,
  getDraftConcerns,
  type DraftConcern,
} from "./utils/draft-concern-utils";
import useGetConcerns from "./hooks/useGetConcerns";

const S3_URL = import.meta.env.VITE_S3_URL;
const UploadConcernPhotoModal = ({
  selectFile,
}: {
  selectFile: (
    event: React.ChangeEvent<HTMLInputElement, Element>,
  ) => Promise<void>;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement, Element>,
  ) => {
    await selectFile(e);
    setIsOpen(false);
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <Button variant={"secondary"}>Raise</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload photo</DialogTitle>
          <DialogDescription>
            The better the photo, the accurate the assessment and sooner your
            plant will get well.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Input
            type="file"
            onChange={handleChange}
            accept=".png , .jpg, .jpeg, .webp, .heic"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

const HealthConcerns = ({}) => {
  const [drafts, setDrafts] = useState<DraftConcern[]>([]);
  const { handleFileChange } = usePhotoUpload();
  const { allActiveConcerns } = useGetConcerns();

  console.log({ concerns: allActiveConcerns.data });

  const navigate = useNavigate();

  const handleSelectFile = async (
    e: React.ChangeEvent<HTMLInputElement, Element>,
  ): Promise<void> => {
    let draft_id = await handleFileChange(e);

    if (draft_id) navigate(`raise?draft=${draft_id}`);
  };

  useEffect(() => {
    let draftConcerns = getDraftConcerns();
    setDrafts(draftConcerns);
  }, []);

  return (
    <div className="p-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Health Concerns</h1>
          <p className="mt-1 text-sm text-gray-500">
            This page shows all health concerns raised for your plants.
          </p>
        </div>

        <UploadConcernPhotoModal selectFile={handleSelectFile} />
      </header>

      {drafts.length ? (
        <section className="h-auto flex flex-col gap-4 pt-8">
          <h2>Draft concerns</h2>
          <div className="flex gap-4">
            {drafts.map((draft) => (
              <div
                key={draft.object_key}
                className="flex flex-col gap-2 items-center"
              >
                <Button
                  variant={"outline"}
                  className={
                    "h-20 w-20 px-0 rounded-2xl overflow-hidden shadow-xl cursor-pointer"
                  }
                  onClick={() =>
                    navigate(
                      `raise?draft=${encodeURIComponent(draft.object_key)}`,
                    )
                  }
                >
                  <img
                    src={S3_URL + "/" + draft.object_key}
                    alt=""
                    className="size-full"
                  />
                </Button>

                <p className="text-primary/50 text-xs">
                  {formatRelativeDate(draft.created_at)}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {allActiveConcerns && allActiveConcerns.data ? (
        <section className="h-auto flex flex-col gap-4 pt-8">
          <h2>Active concerns</h2>
          <div className="flex gap-4">
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
