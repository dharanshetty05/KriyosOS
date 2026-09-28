from fastapi import APIRouter, HTTPException, status

from app.models.lead import LeadCreate, LeadResponse, LeadUpdate
from app.services.lead_service import lead_service

router = APIRouter(prefix="/api/leads", tags=["Leads"])


@router.get("", response_model=list[LeadResponse])
def list_leads() -> list[LeadResponse]:
    return lead_service.list_leads()


@router.post(
    "",
    response_model=LeadResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_lead(data: LeadCreate) -> LeadResponse:
    return lead_service.create_lead(data)


@router.get("/{lead_id}", response_model=LeadResponse)
def get_lead(lead_id: str) -> LeadResponse:
    lead = lead_service.get_lead(lead_id)

    if lead is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lead not found",
        )

    return lead


@router.patch("/{lead_id}", response_model=LeadResponse)
def update_lead(
    lead_id: str,
    data: LeadUpdate,
) -> LeadResponse:
    lead = lead_service.update_lead(lead_id, data)

    if lead is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lead not found",
        )

    return lead


@router.delete("/{lead_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_lead(lead_id: str) -> None:
    deleted = lead_service.delete_lead(lead_id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lead not found",
        )