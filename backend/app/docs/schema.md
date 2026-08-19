User
────────────────────────
id                  PK
name                NOT NULL
email               UNIQUE, NOT NULL
joined_on           NOT NULL
planting_experience NULL
avatar              NULL

relationships:
    shelves → Shelf[]
    plants  → Plant[]
    photos  → PlantPhoto[]


Shelf
────────────────────────
id                  PK
name                NOT NULL
description         NULL
user_id             FK → users.id, NOT NULL
shelf_type          NOT NULL

UNIQUE(user_id, name)

relationships:
    user   → User
    plants → Plant[]

    Plant
────────────────────────
id                  PK
name                NULL
species             NOT NULL
user_id             FK → users.id, NOT NULL
height_cm           NULL
pot_size             NULL
added_on            NOT NULL
location_type       NULL
status              NULL
avatar_id           FK → plant_photos.id, NULL

UNIQUE(user_id, name)

relationships:
    user    → User
    shelves → Shelf[]
    photos  → PlantPhoto[]
    avatar  → PlantPhoto | None


PlantPhoto
────────────────────────
id                  PK
plant_id            FK → plants.id, NULL
user_id             FK → users.id, NOT NULL
photo_url           NOT NULL
captured_on         NULL
uploaded_on         NOT NULL
expires_on          NULL

relationships:
    user  → User
    plant → Plant | None


    ShelfPlant
────────────────────────
shelf_id        FK → shelves.id
plant_id        FK → plants.id

PRIMARY KEY(shelf_id, plant_id)


    CareEvent
────────────────────────
id              PK
plant_id        FK → plants.id, NOT NULL
care_type       NOT NULL
occurred_on     NOT NULL

relationships:
    plant → Plant


    HealthConcern
────────────────────────
id              PK
plant_id        FK → plants.id, NOT NULL
initial_context NULL
occurred_on     NULL
reported_on     NOT NULL
status          NOT NULL

relationships:
    plant           → Plant
    evidences       → Evidence[]
    assessments     → Assessment[]
    recommendations → Recommendation[]
    outcomes        → Outcome[]


    Evidence
────────────────────────
id              PK
concern_id      FK → health_concerns.id, NOT NULL
evidence_type   NOT NULL
value           NOT NULL
value_type      NOT NULL
recorded_on     NOT NULL

relationships:
    concern → HealthConcern[]
    photos  → PlantPhoto[]


    EvidencePhoto
────────────────────────
evidence_id     FK → evidence.id
photo_id        FK → plant_photos.id

PRIMARY KEY(evidence_id, photo_id)


    Assessment
────────────────────────
id              PK
concern_id      FK → health_concerns.id, NOT NULL
problem         NOT NULL
possible_cause  NULL
confidence      NULL
explanation     NULL
status          NOT NULL
created_on      NOT NULL

relationships:
    concern  → HealthConcern
    evidence → Evidence[]


    AssessmentEvidence
────────────────────────
assessment_id   FK → assessments.id
evidence_id     FK → evidence.id

PRIMARY KEY(assessment_id, evidence_id)


    Recommendation
────────────────────────
id                  PK
concern_id          FK → health_concerns.id, NOT NULL
recommendation_type NOT NULL
description         NOT NULL
performed_on        NULL

relationships:
    concern → HealthConcern


    Outcome
────────────────────────
id              PK
concern_id      FK → health_concerns.id, NOT NULL
outcome_type    NOT NULL
description     NULL
recorded_on     NOT NULL

relationships:
    concern → HealthConcern