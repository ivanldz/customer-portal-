export interface Pagination<T> {
  records: T[];
  paginations: {
    page: number;
    pageSize: number;
    totalPages: number;
  };
}
