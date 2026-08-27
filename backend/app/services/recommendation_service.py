from pydantic import BaseModel

from sqlalchemy import select
from sqlalchemy.orm import Session
from uuid import uuid4

from app.config import settings
from app.models.recommendation import Recommendation
from app.schemas.recommendation import (
    AIRecommendationResponse,
    RecommendationOption,
)
from app.services.assessment_service import AssessmentService
from app.services.recommendation_ai import RecommendationAIService
from app.services.assessment_context_service import AssessmentContextService



class RecommendationService(BaseModel):

    def initialize(
        self,
        assessment_id: int,
        user_id: int,
        db: Session,
    ) -> AIRecommendationResponse:

        assessment_service = AssessmentService()
        recommendation_ai_service = RecommendationAIService()
        context_service = AssessmentContextService()
        assessment = assessment_service.get_assessment(
            db=db, assessment_id=assessment_id
        )

        if assessment is None:
            raise ValueError("Assessment not found.")

        context = context_service.build_context(
            db,
            concern_id=assessment.concern_id,
            assessment=assessment,
            previous_assessment=None,
            user_id=user_id,
        )

        ai_recommendation = recommendation_ai_service.generate_recommendation(
            context=context
        )

        if ai_recommendation.type != "recommendation_options":
            raise ValueError(f"Unsupported AI response type: {ai_recommendation.type}")

        generation_id = str(uuid4())

        input_payload = {
            "assessment_id": assessment.id,
            "status": assessment.status,
            "problem": assessment.problem,
            "problem_cause": assessment.problem_cause,
            "confidence": assessment.confidence,
            "explanation": assessment.explanation,
        }

        response_payload = ai_recommendation.model_dump(mode="json")

        for position, option in enumerate(ai_recommendation.options):
            self.create_recommendation(
                db=db,
                assessment_id=assessment.id,
                generation_id=generation_id,
                option_id=option.id,
                position=position,
                title=option.title,
                summary=option.summary,
                steps=option.steps,
                materials=option.materials,
                frequency=option.frequency,
                duration=option.duration,
                caution=option.caution,
                expected_result=option.expected_result,
                recommendation_score=option.recommendation_score,
                schema_version="1.0",
                model=settings.ai_model,
                prompt_version="recommendation-v1",
                input_payload=input_payload,
                response_payload=response_payload,
            )

        db.commit()

        return ai_recommendation

    def create_recommendation(
        self,
        db: Session,
        assessment_id: int,
        generation_id: str,
        option_id: str,
        position: int,
        title: str,
        summary: str,
        steps: list[str],
        materials: list[str],
        frequency: str | None,
        duration: str | None,
        caution: str | None,
        expected_result: str,
        recommendation_score: int,
        schema_version: str,
        model: str,
        prompt_version: str,
        input_payload: dict,
        response_payload: dict,
    ) -> Recommendation:

        recommendation = Recommendation(
            assessment_id=assessment_id,
            generation_id=generation_id,
            option_id=option_id,
            position=position,
            title=title,
            summary=summary,
            steps=steps,
            materials=materials,
            frequency=frequency,
            duration=duration,
            caution=caution,
            expected_result=expected_result,
            recommendation_score=recommendation_score,
            schema_version=schema_version,
            model=model,
            prompt_version=prompt_version,
            input_payload=input_payload,
            response_payload=response_payload,
        )

        db.add(recommendation)
        db.flush()

        return recommendation

    def get_recommendation(
        self,
        db: Session,
        recommendation_id: int,
    ) -> Recommendation | None:
        return db.get(Recommendation, recommendation_id)

    def get_recommendations_for_assessment(
        self,
        db: Session,
        assessment_id: int,
    ) -> AIRecommendationResponse | None:
        stmt = (
            select(Recommendation)
            .where(Recommendation.assessment_id == assessment_id)
            .order_by(
                Recommendation.created_at.desc(),
                Recommendation.position,
            )
        )

        recommendations = list(db.scalars(stmt).all())

        if not recommendations:
            return None

        latest_generation_id = recommendations[0].generation_id
        latest_recommendations = [
            recommendation
            for recommendation in recommendations
            if recommendation.generation_id == latest_generation_id
        ]

        return AIRecommendationResponse(
            type="recommendation_options",
            options=[
                RecommendationOption(
                    id=recommendation.option_id,
                    title=recommendation.title,
                    summary=recommendation.summary,
                    steps=recommendation.steps,
                    frequency=recommendation.frequency,
                    duration=recommendation.duration,
                    materials=recommendation.materials,
                    caution=recommendation.caution,
                    expected_result=recommendation.expected_result,
                    recommendation_score=recommendation.recommendation_score,
                )
                for recommendation in sorted(
                    latest_recommendations,
                    key=lambda recommendation: recommendation.position,
                )
            ],
        )

    def mark_recommendation_performed(
        self,
        db: Session,
        recommendation_id: int,
        performed_on,
    ) -> Recommendation | None:
        recommendation = db.get(
            Recommendation,
            recommendation_id,
        )

        if recommendation is None:
            return None

        recommendation.performed_on = performed_on
        db.flush()

        return recommendation
