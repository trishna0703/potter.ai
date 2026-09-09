from enum import Enum


class ConcernStatus(str, Enum):
    OPEN = "OPEN"
    MONITORING = "MONITORING"
    COMPLETED = "COMPLETED"


class AssessmentStatus(str, Enum):
    WAITING_FOR_AI = "WAITING_FOR_AI"
    WAITING_FOR_USER = "WAITING_FOR_USER"
    COMPLETED = "COMPLETED"
