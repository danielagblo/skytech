"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api-error";
import { demoResponse, isDemoSession } from "@/lib/demo-data";
import { booksService } from "@/services/books.service";
import type {
  BookFilters,
  BooksSnapshot,
  SaveBookEntryRequest,
} from "@/types/book.types";

const invalidate = (client: ReturnType<typeof useQueryClient>) =>
  client.invalidateQueries({ queryKey: ["books"] });

const fail = (error: unknown, fallback: string) =>
  toast.error(
    getApiErrorMessage(error, error instanceof Error ? error.message : fallback),
  );

const demoSnapshot = (filters: BookFilters): BooksSnapshot => ({
  entries: [],
  templates: [],
  summary: {
    revenue: 0,
    expenses: 0,
    net: 0,
    pipelineCollected: 0,
    manualRevenue: 0,
    recurringPosted: 0,
    currency: "GHS",
  },
  categoryTotals: [],
  range: { from: filters.from || "", to: filters.to || "" },
  imported: 0,
});

export const useBooks = (filters: BookFilters, enabled = true) =>
  useQuery({
    queryKey: ["books", filters],
    enabled,
    queryFn: () =>
      isDemoSession()
        ? demoResponse(demoSnapshot(filters))
        : booksService.getAll(filters),
    select: (response) => response.data.data,
  });

export const useCreateBookEntry = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: SaveBookEntryRequest) => {
      if (isDemoSession()) {
        return Promise.reject(new Error("Books are not saved in the demo session."));
      }
      return booksService.create(data);
    },
    onSuccess: () => {
      void invalidate(client);
      toast.success("Entry saved.");
    },
    onError: (error) => fail(error, "The entry could not be saved."),
  });
};

export const useUpdateBookEntry = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SaveBookEntryRequest }) => {
      if (isDemoSession()) {
        return Promise.reject(new Error("Books are not saved in the demo session."));
      }
      return booksService.update(id, data);
    },
    onSuccess: () => {
      void invalidate(client);
      toast.success("Entry updated.");
    },
    onError: (error) => fail(error, "The entry could not be updated."),
  });
};

export const useDeleteBookEntry = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      if (isDemoSession()) {
        return Promise.reject(new Error("Books are not saved in the demo session."));
      }
      return booksService.remove(id);
    },
    onSuccess: () => {
      void invalidate(client);
      toast.success("Entry removed.");
    },
    onError: (error) => fail(error, "The entry could not be removed."),
  });
};

export const usePostRecurringEntry = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, entryDate }: { id: string; entryDate: string }) => {
      if (isDemoSession()) {
        return Promise.reject(new Error("Books are not saved in the demo session."));
      }
      return booksService.postRecurring(id, entryDate);
    },
    onSuccess: () => {
      void invalidate(client);
      toast.success("Posted to this month.");
    },
    onError: (error) => fail(error, "The schedule could not be posted."),
  });
};
