from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field, ConfigDict


class LeadStatus(str, Enum):
    NEW_LEAD = "NEW_LEAD"
    DM_SENT = "DM_SENT"
    SEEN = "SEEN"
    REPLIED = "REPLIED"
    CONVO = "CONVO"
    CALL_BOOKED = "CALL_BOOKED"
    NOT_INTERESTED = "NOT_INTERESTED"
    WON = "WON"
    LOST = "LOST"
    FOLLOW_UP = "FOLLOW_UP"


class LeadBase(BaseModel):
    business_name: str = Field(min_length=1)
    location: str = Field(min_length=1)
    niche: str = Field(min_length=1)
    instagram_url: str | None = None
    website_url: str | None = None
    opportunity_score: int | None = Field(default=None, ge=0, le=100)
    status: LeadStatus = LeadStatus.NEW_LEAD
    next_follow_up: datetime | None = None
    follow_up_count: int = Field(default=0, ge=0)
    dm_sent_at: datetime | None = None
    reply_date: datetime | None = None
    call_booked_date: datetime | None = None
    outcome: str | None = None
    notes: str | None = None


class LeadCreate(LeadBase):
    pass


class LeadUpdate(BaseModel):
    business_name: str | None = Field(default=None, min_length=1)
    location: str | None = Field(default=None, min_length=1)
    niche: str | None = Field(default=None, min_length=1)
    instagram_url: str | None = None
    website_url: str | None = None
    opportunity_score: int | None = Field(default=None, ge=0, le=100)
    status: LeadStatus | None = None
    next_follow_up: datetime | None = None
    follow_up_count: int | None = Field(default=None, ge=0)
    dm_sent_at: datetime | None = None
    reply_date: datetime | None = None
    call_booked_date: datetime | None = None
    outcome: str | None = None
    notes: str | None = None


class LeadResponse(LeadBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    created_at: datetime
    updated_at: datetime