// src/shared/dto/pagination.dto.ts
export class PaginationDTO {
  page?: number;
  limit?: number;
  sortBy?: string; // Optional: sorting field (e.g., "createdAt")
  sortOrder?: 'asc' | 'desc'; // Optional: sorting order
  search?: string; // Optional: search keyword
}