import api from "@/lib/axios";
import type { ApiResponse } from "@/types/api.types";
import type {
  RatingInfoResponse,
  RatingLinkResponse,
  RatingSubmissionInput,
  RatingSubmissionResponse,
} from "@/types/rating.types";

export const ratingsService = {
  request: (dealId: string | { dealId?: string; id?: string }) => {
    const id = typeof dealId === "object" && dealId ? (dealId.dealId || dealId.id || "") : dealId;
    return api.post<ApiResponse<RatingLinkResponse>>("/ratings", { dealId: id, deal_id: id });
  },
  info: (token: string) =>
    api.get<ApiResponse<RatingInfoResponse>>(`/ratings/public/${token}`),
  submit: (token: string, payload: RatingSubmissionInput) =>
    api.post<ApiResponse<RatingSubmissionResponse>>(
      `/ratings/public/${token}`,
      payload,
    ),
};
