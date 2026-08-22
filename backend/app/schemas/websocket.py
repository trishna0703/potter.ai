from typing import Literal

from pydantic import BaseModel


class AnswerMessage(BaseModel):
    type: Literal["answer"]

    interaction_id: int

    payload: dict
