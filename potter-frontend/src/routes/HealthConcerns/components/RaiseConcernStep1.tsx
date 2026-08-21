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
  QuestionnaireProgress,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/components/ui/questionnaire";
import { QUESTIONNAIRE } from "#lib/concern-questionnaire";
import { useSearchParams } from "react-router-dom";
import useRaiseConcern from "../hooks/useRaiseConcern";
import { useRef, useState } from "react";
import { generateInitialContext } from "../utils/context-utils";
import usePlantIdentityStore from "@/store/PlantIdentificationStore";

import { getToday } from "#lib/utils";

interface QuestionnaireAnswers {
  [key: string]: string | undefined;
}

const RaiseConcernStep1 = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const { raiseConcern } = useRaiseConcern();
  const [answers, setAnswers] = useState<QuestionnaireAnswers>({});
  const { plantIdentity, setPlantIdentity } = usePlantIdentityStore();
  const submissionId = useRef(crypto.randomUUID());

  console.log({ plantIdentity });
  const handleSubmit = async () => {
    const initial_context = generateInitialContext(answers);
    try {
      if (!plantIdentity) {
        return;
      }
      let payload = {
        submission_id: submissionId.current,
        photo_id: plantIdentity.photo_id,
        occurred_on: getToday(),
        initial_context,
        evidence_id: plantIdentity.evidence_id,
        plant_id: plantIdentity?.plant_id,
      };

      let data = await raiseConcern(payload);

      setPlantIdentity({ ...plantIdentity, concern_id: data.concern_id });
      params.set("step", "2");
      setSearchParams(params);
    } catch (error) {
      console.error("Failed to raise concern:", error);
    }
  };

  return (
    <div>
      <Questionnaire
        items={QUESTIONNAIRE}
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <QuestionnaireProgress />

        {QUESTIONNAIRE.map((question) => (
          <QuestionnaireItem
            key={question.name}
            name={question.name}
            required={question.required}
          >
            <QuestionnaireTitle>{question.prompt}</QuestionnaireTitle>

            <QuestionnaireDescription>
              {question.description}
            </QuestionnaireDescription>

            <QuestionnaireChoices>
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
                >
                  <span className="font-medium">{choice.label}</span>

                  {"description" in choice ? (
                    <span className="text-muted-foreground">
                      {choice.description}
                    </span>
                  ) : null}
                </QuestionnaireChoice>
              ))}

              {question.input ? (
                <QuestionnaireInput
                  aria-label={question.input.label}
                  placeholder={question.input.placeholder}
                  onChange={(e) =>
                    setAnswers((prev) => ({
                      ...prev,
                      [question.name]: e.target.value,
                    }))
                  }
                />
              ) : null}
            </QuestionnaireChoices>

            <QuestionnaireError />
          </QuestionnaireItem>
        ))}

        <QuestionnaireActions>
          <QuestionnairePrevious />
          {/* <QuestionnaireSkip /> */}
          <QuestionnaireNext />
          <QuestionnaireSubmit />
        </QuestionnaireActions>
      </Questionnaire>
    </div>
  );
};

export default RaiseConcernStep1;
