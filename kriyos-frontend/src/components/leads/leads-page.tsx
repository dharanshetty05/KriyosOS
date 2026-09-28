"use client";

import { useCallback, useEffect, useState } from "react";

import { apiFetch } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { CreateLeadForm } from "./create-lead-form";

interface Lead {
  id: string;
  businessName: string;
  location: string;
  niche: string;
  instagramUrl: string | null;
  websiteUrl: string | null;
  opportunityScore: number | null;
  status: string;
  nextFollowUp: string | null;
  followUpCount: number;
  dmSentAt: string | null;
  replyDate: string | null;
  callBookedDate: string | null;
  outcome: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

function normalizeLead(data: any): Lead {
  return {
    id: data.id,
    businessName: data.business_name,
    location: data.location,
    niche: data.niche,
    instagramUrl: data.instagram_url ?? null,
    websiteUrl: data.website_url ?? null,
    opportunityScore: data.opportunity_score ?? null,
    status: data.status,
    nextFollowUp: data.next_follow_up ?? null,
    followUpCount: data.follow_up_count ?? 0,
    dmSentAt: data.dm_sent_at ?? null,
    replyDate: data.reply_date ?? null,
    callBookedDate: data.call_booked_date ?? null,
    outcome: data.outcome ?? null,
    notes: data.notes ?? null,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const loadLeads = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await apiFetch<Lead[]>("/api/leads");
      setLeads(data.map(normalizeLead));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load leads.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader onCreate={() => setShowCreateForm(true)} />
        <div className="rounded-lg border p-8 text-center text-sm text-muted-foreground">
          Loading leads...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader onCreate={() => setShowCreateForm(true)} />

        <div className="rounded-lg border border-destructive/30 p-8 text-center">
          <p className="text-sm text-destructive">{error}</p>

          <Button
            variant="outline"
            className="mt-4"
            onClick={loadLeads}
          >
            Try again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader onCreate={() => setShowCreateForm(true)} />

      {showCreateForm && (
        <div className="rounded-lg border bg-card p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">
              Create Lead
            </h2>
            <p className="text-sm text-muted-foreground">
              Add a new prospect to your pipeline.
            </p>
          </div>

          <CreateLeadForm
            onCreated={async () => {
              setShowCreateForm(false);
              await loadLeads();
            }}
            onCancel={() => setShowCreateForm(false)}
          />
        </div>
      )}

      {leads.length === 0 ? (
        <div className="rounded-lg border p-12 text-center">
          <h2 className="font-medium">No leads yet</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Add your first lead to start building your pipeline.
          </p>

          <Button
            className="mt-4"
            onClick={() => setShowCreateForm(true)}
          >
            Create Lead
          </Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/40">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">
                    Business
                  </th>
                  <th className="px-4 py-3 text-left font-medium">
                    Location
                  </th>
                  <th className="px-4 py-3 text-left font-medium">
                    Niche
                  </th>
                  <th className="px-4 py-3 text-left font-medium">
                    Opportunity
                  </th>
                  <th className="px-4 py-3 text-left font-medium">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left font-medium">
                    Next Follow-up
                  </th>
                </tr>
              </thead>

              <tbody>
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b last:border-0"
                  >
                    <td className="px-4 py-3 font-medium">
                      {lead.businessName}
                    </td>

                    <td className="px-4 py-3">
                      {lead.location}
                    </td>

                    <td className="px-4 py-3">
                      {lead.niche}
                    </td>

                    <td className="px-4 py-3">
                      {lead.opportunityScore ?? "—"}
                    </td>

                    <td className="px-4 py-3">
                      <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium">
                        {lead.status}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-muted-foreground">
                      {lead.nextFollowUp
                        ? new Date(
                            lead.nextFollowUp,
                          ).toLocaleString()
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function PageHeader({
  onCreate,
}: {
  onCreate: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Leads
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage prospects and track their journey through your
          sales pipeline.
        </p>
      </div>

      <Button onClick={onCreate}>Create Lead</Button>
    </div>
  );
}