class IdentificationError(Exception):
    """Base exception for plant identification failures."""


class IdentificationProviderError(IdentificationError):
    """AI provider failed or was unavailable."""


class IdentificationInvalidResponseError(IdentificationError):
    """AI returned an invalid/unusable identification response."""
