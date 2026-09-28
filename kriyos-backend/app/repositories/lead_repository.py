from typing import Any

from app.models.lead import LeadResponse


class LeadRepository:
    def __init__(self) -> None:
        self._leads: dict[str, LeadResponse] = {}

    def list(self) -> list[LeadResponse]:
        return list(self._leads.values())

    def get(self, lead_id: str) -> LeadResponse | None:
        return self._leads.get(lead_id)

    def create(self, lead: LeadResponse) -> LeadResponse:
        self._leads[lead.id] = lead
        return lead

    def update(
        self,
        lead_id: str,
        data: dict[str, Any],
    ) -> LeadResponse | None:
        lead = self._leads.get(lead_id)

        if lead is None:
            return None

        updated = lead.model_copy(update=data)
        self._leads[lead_id] = updated

        return updated

    def delete(self, lead_id: str) -> bool:
        if lead_id not in self._leads:
            return False

        del self._leads[lead_id]
        return True


lead_repository = LeadRepository()