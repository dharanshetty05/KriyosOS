from datetime import datetime, timezone
from uuid import uuid4

from app.models.lead import LeadCreate, LeadResponse, LeadUpdate
from app.repositories.lead_repository import lead_repository


class LeadService:
    def list_leads(self) -> list[LeadResponse]:
        return lead_repository.list()

    def get_lead(self, lead_id: str) -> LeadResponse | None:
        return lead_repository.get(lead_id)

    def create_lead(self, data: LeadCreate) -> LeadResponse:
        now = datetime.now(timezone.utc)

        lead = LeadResponse(
            id=f"lead_{uuid4().hex[:12]}",
            **data.model_dump(),
            created_at=now,
            updated_at=now,
        )

        return lead_repository.create(lead)

    def update_lead(
        self,
        lead_id: str,
        data: LeadUpdate,
    ) -> LeadResponse | None:
        existing = lead_repository.get(lead_id)

        if existing is None:
            return None

        update_data = data.model_dump(exclude_unset=True)
        update_data["updated_at"] = datetime.now(timezone.utc)

        return lead_repository.update(lead_id, update_data)

    def delete_lead(self, lead_id: str) -> bool:
        return lead_repository.delete(lead_id)


lead_service = LeadService()