export interface ApiResponse<T> {
  statusCode: number;
  response: T;
}