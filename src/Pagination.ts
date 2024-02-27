export interface Pagination {
  startCursor: string|null;
  endCursor: string|null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
