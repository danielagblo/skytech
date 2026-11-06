"use client";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@/lib/zodResolver";
import type { Deal, DealLog } from "@/types/deal.types";
import type { User } from "@/types/user.types";
import type { ContactMode } from "@/types/api.types";
import { useAddDealLog } from "@/hooks/useDeals";
import { LogFeed } from "../LogFeed";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const schema = z
  .object({
    mode: z.enum(["PHONE_CALL", "EMAIL", "IN_PERSON", "WHATSAPP"]),
    outcome: z
      .enum(["COMPLETED", "NETWORK_INTERRUPTION", "CUSTOMER_HUNG_UP", "NO_RESPONSE"])
      .optional()
      .or(z.literal("")),
    followUp: z.string().min(1, "Choose a follow-up date."),
    body: z.string().min(3, "Describe the client response."),
  })
  .superRefine((values, ctx) => {
    if (values.mode !== "PHONE_CALL") return;
    if (!values.outcome)
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Choose a call outcome.",
        path: ["outcome"],
      });
  });
type Values = z.infer<typeof schema>;

export const NegotiationLog = ({
  deal,
  logs,
  users,
}: {
  deal: Deal;
  logs: DealLog[];
  users: User[];
}) => {
  const mutation = useAddDealLog();
  const {
    register,
    control,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      mode: "PHONE_CALL",
      outcome: "",
      followUp: "",
      body: "",
    },
  });
  const values = useWatch({ control });
  const isPhoneCall = values.mode === "PHONE_CALL";
  const submit = handleSubmit((data) =>
    mutation.mutate(
      {
        dealId: deal.id,
        data: {
          logType: "NEGOTIATION",
          contactMode: data.mode as ContactMode,
          followUpAt: new Date(data.followUp).toISOString(),
          body: data.body,
          ...(isPhoneCall
            ? {
                callOutcome: data.outcome as
                  | "COMPLETED"
                  | "NETWORK_INTERRUPTION"
                  | "CUSTOMER_HUNG_UP"
                  | "NO_RESPONSE",
              }
            : {}),
        },
      },
      { onSuccess: () => reset() },
    ),
  );
  const phoneFields = (
    <div>
      <Label>Call outcome</Label>
      <div className="[&>button]:mt-1.5">
        <Select
          value={values.outcome ?? ""}
          onValueChange={(value) => setValue("outcome", value as never)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select outcome" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="NETWORK_INTERRUPTION">
              Network interruption
            </SelectItem>
            <SelectItem value="CUSTOMER_HUNG_UP">Customer hung up</SelectItem>
            <SelectItem value="NO_RESPONSE">No response</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {errors.outcome && (
        <p className="text-xs text-danger">{errors.outcome.message}</p>
      )}
    </div>
  );
  return (
    <div className="space-y-5">
      <form className="space-y-3 border-b pb-4" onSubmit={submit}>
        <h4 className="font-semibold">Add negotiation log</h4>
        <div>
          <Label>Contact mode</Label>
          <Select
            value={values.mode}
            onValueChange={(value: ContactMode) => setValue("mode", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PHONE_CALL">Phone call</SelectItem>
              <SelectItem value="EMAIL">Email</SelectItem>
              <SelectItem value="IN_PERSON">In person</SelectItem>
              <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {isPhoneCall && phoneFields}
        <div>
          <Label>Feedback</Label>
          <Textarea {...register("body")} />
          {errors.body && (
            <p className="text-xs text-danger">{errors.body.message}</p>
          )}
        </div>
        <div>
          <Label>Follow-up date and time</Label>
          <Input type="datetime-local" {...register("followUp")} />
          {errors.followUp && (
            <p className="text-xs text-danger">{errors.followUp.message}</p>
          )}
        </div>
        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? "Saving…" : "Save log"}
        </Button>
      </form>
      <LogFeed dealId={deal.id} logs={logs} users={users} />
    </div>
  );
};
