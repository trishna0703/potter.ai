from sqlalchemy.orm import Session

from app.services.assessment_service import AssessmentService
from app.services.interaction_service import InteractionService
from app.services.assessment_ai import AssessmentAIService
from app.services.assessment_context_service import AssessmentContextService


class AssessmentFlowService:

    def __init__(
        self,
        assessment_service: AssessmentService,
        message_service: InteractionService,
        ai_service: AssessmentAIService,
        context_service: AssessmentContextService,
    ):
        self.assessment_service = assessment_service
        self.message_service = message_service
        self.ai_service = ai_service
        self.context_service = context_service

    def start_assessment(self, db: Session, concern, assessment):

        return self.generate_next_interaction(
            db,
            concern=concern,
            assessment=assessment,
        )

    def generate_next_interaction(
        self,
        db: Session,
        *,
        concern,
        assessment,
    ):

        context = self.context_service.build_context(
            concern,
            assessment,
        )

        ai_response = self.ai_service.generate_next_interaction(context)

        interaction = ai_response.interaction

        message = self.message_service.create_assessment_message(
            db,
            assessment_id=assessment.id,
            role="assistant",
            message_type=interaction.type,
            payload=interaction.model_dump(),
        )

        self.assessment_service.set_current_interaction(
            db,
            assessment_id=assessment.id,
            interaction_id=message.id,
        )

        self.assessment_service.update_assessment_status(
            db,
            assessment_id=assessment.id,
            status="WAITING_FOR_USER",
        )

        db.commit()

        return message

    def handle_answer(
        self,
        db: Session,
        *,
        concern,
        assessment,
        interaction_id: int,
        value,
    ):
        assessment = self.assessment_service.get_assessment(
            db,
            assessment_id=assessment.id,
        )

        if assessment is None:
            raise ValueError("Assessment does not exist.")

        if assessment.current_interaction_id != interaction_id:
            raise ValueError("This interaction is no longer awaiting a response.")

        interaction = self.message_service.get_current_interaction(
            db,
            assessment_id=assessment.id,
            interaction_id=interaction_id,
        )

        if interaction is None:
            raise ValueError("Interaction not found.")

        if interaction.message_type != "question":
            raise ValueError("This interaction does not accept an answer.")

        user_message = self.message_service.create_assessment_message(
            db,
            assessment_id=assessment.id,
            role="user",
            message_type="answer",
            payload={
                "interaction_id": interaction_id,
                "value": value,
            },
        )

        self.assessment_service.set_current_interaction(
            db,
            assessment_id=assessment.id,
            interaction_id=None,
        )

        self.assessment_service.update_assessment_status(
            db,
            assessment_id=assessment.id,
            status="WAITING_FOR_AI",
        )

        db.commit()

        return self.generate_next_interaction(
            db,
            concern=concern,
            assessment=assessment,
        )
