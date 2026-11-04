import api from "@/lib/axios";
import type { ApiResponse } from "@/types/api.types";
import type {
  BookEntry,
  BookFilters,
  BooksSnapshot,
  SaveBookEntryRequest,
} from "@/types/book.types";

export const booksService = {
  getAll: (params: BookFilters = {}) =>
    api.get<ApiResponse<BooksSnapshot>>("/books", {
      params: {
        from: params.from,
        to: params.to,
        ...(params.type ? { type: params.type } : {}),
        ...(params.source ? { source: params.source } : {}),
        ...(params.search ? { search: params.search } : {}),
      },
    }),
  create: (data: SaveBookEntryRequest) =>
    api.post<ApiResponse<BookEntry>>("/books", data),
  update: (id: string, data: SaveBookEntryRequest) =>
    api.put<ApiResponse<BookEntry>>(`/books/${id}`, data),
  remove: (id: string) => api.delete<ApiResponse<{ id: string }>>(`/books/${id}`),
  postRecurring: (id: string, entryDate: string) =>
    api.post<ApiResponse<BookEntry>>(`/books/${id}/post`, { entryDate }),
};
