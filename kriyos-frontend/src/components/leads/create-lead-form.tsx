"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { apiFetch } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const leadStatuses = [
  "NEW_LEAD",
  "DM_SENT",
  "SEEN",
  "REPLIED",
  "CONVO",
  "CALL_BOOKED",
  "NOT_INTERESTED",
  "WON",
  "LOST",
  "FOLLOW_UP",
] as const;

const createLeadSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  location: z.string().min(1, "Location is required"),
  niche: z.string().min(1, "Niche is required"),
  instagramUrl: z
    .string()
    .url("Enter a valid URL")
    .optional()
    .or(z.literal("")),
  websiteUrl: z
    .string()
    .url("Enter a valid URL")
    .optional()
    .or(z.literal("")),
  opportunityScore: z.coerce
    .number()
    .int()
    .min(0)
    .max(100)
    .optional(),
  status: z.enum(leadStatuses),
  notes: z.string().optional(),
});

type CreateLeadFormInput = z.input<typeof createLeadSchema>;
type CreateLeadFormValues = z.output<typeof createLeadSchema>;

interface CreateLeadFormProps {
  onCreated: () => void;
  onCancel: () => void;
}

export function CreateLeadForm({
  onCreated,
  onCancel,
}: CreateLeadFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateLeadFormInput, unknown, CreateLeadFormValues>({
    resolver: zodResolver(createLeadSchema),
    defaultValues: {
      status: "NEW_LEAD",
    },
  });

  async function onSubmit(values: CreateLeadFormValues) {
    await apiFetch("/api/leads", {
      method: "POST",
      body: JSON.stringify({
      business_name: values.businessName,
      location: values.location,
      niche: values.niche,
      instagram_url: values.instagramUrl || null,
      website_url: values.websiteUrl || null,
      opportunity_score: values.opportunityScore ?? null,
      status: values.status,
      notes: values.notes || null,
    }),
    });

    reset();
    onCreated();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="businessName">Business Name</Label>
          <Input id="businessName" {...register("businessName")} />
          {errors.businessName && (
            <p className="text-sm text-destructive">
              {errors.businessName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" {...register("location")} />
          {errors.location && (
            <p className="text-sm text-destructive">
              {errors.location.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="niche">Niche</Label>
          <Input id="niche" {...register("niche")} />
          {errors.niche && (
            <p className="text-sm text-destructive">
              {errors.niche.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            {...register("status")}
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs"
          >
            {leadStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="instagramUrl">Instagram URL</Label>
          <Input
            id="instagramUrl"
            type="url"
            placeholder="https://instagram.com/..."
            {...register("instagramUrl")}
          />
          {errors.instagramUrl && (
            <p className="text-sm text-destructive">
              {errors.instagramUrl.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="websiteUrl">Website URL</Label>
          <Input
            id="websiteUrl"
            type="url"
            placeholder="https://..."
            {...register("websiteUrl")}
          />
          {errors.websiteUrl && (
            <p className="text-sm text-destructive">
              {errors.websiteUrl.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="opportunityScore">
            Opportunity Score
          </Label>
          <Input
            id="opportunityScore"
            type="number"
            min={0}
            max={100}
            {...register("opportunityScore")}
          />
          {errors.opportunityScore && (
            <p className="text-sm text-destructive">
              {errors.opportunityScore.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          rows={4}
          {...register("notes")}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Lead"}
        </Button>
      </div>
    </form>
  );
}