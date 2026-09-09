import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/components/ui/questionnaire";
import { QUESTIONNAIRE } from "#lib/concern-questionnaire";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import usePlantIdentityStore from "@/store/PlantIdentificationStore";

import { getToday, showErrorToast } from "#lib/utils";
import { ROUTES } from "#lib/routes";
import { generateInitialContext } from "./utils/context-utils";
import useRaiseConcern from "./hooks/useRaiseConcern";
import ProgressBar from "./components/ProgressBar";
import { Label } from "#components/ui/label";
import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";
import Overlay from "#components/layout/Overlay";

interface QuestionnaireAnswers {
  [key: string]: string | undefined;
}

const RaiseConcern = () => {
  const navigate = useNavigate();
  const { raiseConcern } = useRaiseConcern();
  const { mutateAsync: raise, isPending } = raiseConcern();
  const [answers, setAnswers] = useState<QuestionnaireAnswers>({});
  const { plantIdentity, setPlantIdentity } = usePlantIdentityStore();
  const submissionId = useRef(crypto.randomUUID());
  const steps = QUESTIONNAIRE.map((q) => q.name);
  const [step, setStep] = useState<number>(1);

  const handleSubmit = async () => {
    const initial_context = generateInitialContext(answers);

    if (!plantIdentity) {
      return;
    }
    let payload = {
      submission_id: submissionId.current,
      photo_id: plantIdentity.photo_id,
      occurred_on: getToday(),
      title: answers["symptoms"],
      initial_context,
      evidence_id: plantIdentity.evidence_id,
      plant_id: plantIdentity?.plant_id,
    };

    try {
      let data = await raise(payload);

      setPlantIdentity({ ...plantIdentity, concern_id: data.concern_id });
      navigate(`${ROUTES.CONCERNSACTIVE}/${data.assessment_id}`);
    } catch (err) {
      showErrorToast(err);
    }
  };

  return (
    <>
      {isPending && <Overlay />}
      <div className="flex flex-col gap-6">
        <div className="flex gap-4 items-center">
          <ProgressBar steps={steps} currentStep={step} />
          <span className="text-muted-foreground text-xs">
            {step} of {steps.length}
          </span>
        </div>
        <Questionnaire
          items={QUESTIONNAIRE}
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="max-w-4xl"
        >
          {QUESTIONNAIRE.map((question) => (
            <QuestionnaireItem
              key={question.name}
              name={question.name}
              required={question.required}
            >
              <QuestionnaireTitle className="text-playfair lg:text-4xl md:text-2xl text-xl">
                {question.prompt}
              </QuestionnaireTitle>

              <QuestionnaireDescription className="pt-2 flex">
                {question.description}
              </QuestionnaireDescription>

              <QuestionnaireChoices className="grid md:grid-cols-2 grid-cols-1">
                {question.choices?.map((choice) => (
                  <QuestionnaireChoice
                    key={choice.value}
                    value={choice.value}
                    onChange={(e) =>
                      setAnswers((prev) => ({
                        ...prev,
                        [question.name]: e.target.value,
                      }))
                    }
                    className="flex-row-reverse bg-card p-4 hover:bg-card/60"
                  >
                    <div className="flex items-center gap-4">
                      {"icon" in choice ? (
                        <span className="size-16 bg-secondary flex justify-center items-center rounded-full p-1">
                          <img src={choice.icon} alt={choice.label} />
                        </span>
                      ) : null}
                      <div className="flex flex-col gap-1 flex-1">
                        <Label className="font-medium text-md">
                          {choice.label}
                        </Label>

                        {"description" in choice ? (
                          <span className="text-muted-foreground">
                            {choice.description}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </QuestionnaireChoice>
                ))}
              </QuestionnaireChoices>
              {question.input ? (
                <div className="flex flex-col gap-2">
                  <Label className="text-sm text-muted-foreground">
                    {question.input.label}
                  </Label>
                  <QuestionnaireInput
                    aria-label={question.input.label}
                    placeholder={question.input.placeholder}
                    onChange={(e) =>
                      setAnswers((prev) => ({
                        ...prev,
                        [question.name]: e.target.value,
                      }))
                    }
                    className="bg-card w-full h-14"
                  />
                </div>
              ) : null}

              <QuestionnaireError />
            </QuestionnaireItem>
          ))}

          <QuestionnaireActions>
            <QuestionnairePrevious
              onClick={() => setStep((prev) => prev - 1)}
              size={"lg"}
            >
              <ArrowLeftIcon /> Back
            </QuestionnairePrevious>
            <QuestionnaireNext
              onClick={() => {
                if (Object.keys(answers).length < step) return;
                setStep((prev) => prev + 1);
              }}
              size={"lg"}
            >
              Next
              <ArrowRightIcon />{" "}
            </QuestionnaireNext>
            <QuestionnaireSubmit disabled={isPending} />
          </QuestionnaireActions>
        </Questionnaire>
      </div>
    </>
  );
};

export default RaiseConcern;
