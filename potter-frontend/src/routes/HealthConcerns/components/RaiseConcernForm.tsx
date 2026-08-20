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
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/components/ui/questionnaire";
import { QUESTIONNAIRE } from "#lib/concern-questionnaire";
import { useSearchParams } from "react-router-dom";
import useRaiseConcern from "../hooks/useRaiseConcern";
import {
  getDraftConcern,
  removeDraftConcern,
} from "../utils/draft-concern-utils";
import { useState } from "react";
import { generateInitialContext } from "../utils/context-utils";

interface QuestionnaireAnswers {
  [key: string]: string | undefined;
}

const RaiseConcernForm = () => {
  const [searchParams] = useSearchParams();
  const { raiseConcern } = useRaiseConcern();
  const [answers, setAnswers] = useState<QuestionnaireAnswers>({});
  const draftId = searchParams.get("draft");

  const handleSubmit = async () => {
    console.log({ answers });
    if (!draftId) {
      console.error("No draft concern found");
      return;
    }
    let id = decodeURIComponent(draftId);
    const draft = getDraftConcern(id);
    console.log({ id, draft });

    if (!draft) {
      console.error("Draft concern not found");
      return;
    }

    const initial_context = generateInitialContext(answers);

    try {
      let payload = {
        photo_url: draft.object_key,
        occurred_on:
          draft.created_at?.split("T")[0] ??
          new Date().toISOString().split("T")[0],
        initial_context,
      };
      console.log({ payload });

      // send after plan identification
      let data = await raiseConcern(payload);
      // The concern was successfully created.
      // Remove the temporary draft from localStorage.
      removeDraftConcern(draftId);

      // Navigate to the concern / plant page here.
      console.log("Concern created successfully");
    } catch (error) {
      console.error("Failed to raise concern:", error);
    }
  };

  console.log({ answers });
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

export default RaiseConcernForm;
