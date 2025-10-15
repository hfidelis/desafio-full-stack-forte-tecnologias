export interface User {
  id: number;
  email: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedUsers {
  page: number;
  page_size: number;
  count: number;
  results: User[];
}
