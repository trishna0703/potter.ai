import json

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.services.assessment_ai import AssessmentAIService
from app.schemas.websocket import AnswerMessage
from app.services.assessment_context_service import AssessmentContextService
from app.services.assessment_flow_service import AssessmentFlowService
from app.services.assessment_service import AssessmentService
from app.services.auth import get_user_by_session
from app.services.health_concern_service import HealthConcernService
from app.services.helper_services import link_evidence_to_Assessment
from app.services.interaction_service import InteractionService

router = APIRouter()


def authenticate_websocket_user(
    websocket: WebSocket,
    db: Session,
):
    session_id = websocket.cookies.get("session")

    if not session_id:
        return None

    return get_user_by_session(
        session_id,
        db,
    )


@router.websocket("/{concern_id}")
async def health_concern_websocket(
    websocket: WebSocket,
    concern_id: int,
):

    db: Session = SessionLocal()

    try:
        # We'll replace this with your existing session
        # authentication logic.
        user = authenticate_websocket_user(websocket, db)

        if user is None:
            await websocket.close(code=1008)
            return

        concern_service = HealthConcernService()

        concern = concern_service.get_health_concern_for_user(
            db,
            concern_id=concern_id,
            user_id=user.id,
        )

        if concern is None:
            await websocket.close(code=1008)
            return

        await websocket.accept()

        assessment_service = AssessmentService()
        message_service = InteractionService()
        ai_service = AssessmentAIService()
        context_service = AssessmentContextService()

        flow_service = AssessmentFlowService(
            assessment_service=assessment_service,
            message_service=message_service,
            ai_service=ai_service,
            context_service=context_service,
        )

        assessment = assessment_service.get_or_create_assessment(
            db,
            concern_id=concern.id,
            initial_status="WAITING_FOR_AI",
        )
        latest_evidence = max(
            concern.evidences,
            key=lambda evidence: evidence.created_at,
        )
        link_evidence_to_Assessment(
            assessment_id=assessment.id,
            evidence_id=latest_evidence.id,
            db=db,
        )

        db.commit()

        if assessment.status == "COMPLETED":
            interaction = message_service.get_latest_assessment_message(
                db,
                assessment_id=assessment.id,
            )
            if interaction:
                await send_interaction(websocket, interaction)

            await websocket.close(code=1000)
            return

        if assessment.current_interaction_id is None:
            interaction = flow_service.generate_next_interaction(
                db,
                concern=concern,
                assessment=assessment,
            )

            await send_interaction(websocket, interaction)

        else:
            interaction = message_service.get_assessment_message(
                db,
                message_id=assessment.current_interaction_id,
            )

            if interaction:
                await send_interaction(websocket, interaction)

        while True:
            raw_message = await websocket.receive_json()

            message = AnswerMessage.model_validate(raw_message)

            assessment = assessment_service.get_assessment(
                db,
                assessment_id=assessment.id,
            )

            if assessment is None:
                await websocket.send_json(
                    {
                        "type": "error",
                        "payload": {
                            "code": "ASSESSMENT_NOT_FOUND",
                            "message": "Assessment not found.",
                        },
                    }
                )
                continue

            try:
                interaction = flow_service.handle_answer(
                    db,
                    concern=concern,
                    assessment=assessment,
                    interaction_id=message.interaction_id,
                    value=message.payload.get("value"),
                )

                await send_interaction(websocket, interaction)

                if interaction.message_type == "assessment":
                    await websocket.close(code=1000)
                    return

            except ValueError as exc:
                await websocket.send_json(
                    {
                        "type": "error",
                        "payload": {
                            "code": "INVALID_INTERACTION",
                            "message": str(exc),
                        },
                    }
                )

    except WebSocketDisconnect:
        pass

    finally:
        db.close()


async def send_interaction(
    websocket: WebSocket,
    interaction,
):
    await websocket.send_json(
        {
            "type": interaction.message_type,
            "interaction_id": interaction.id,
            "payload": interaction.payload,
        }
    )
