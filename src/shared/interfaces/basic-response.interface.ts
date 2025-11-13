/**
 * Basic Response Interface
 * @param T - Type of the data
 * @param message - Message indicating the status of the response
 * @param data - The data returned in the response
 */
export interface IBasicResponse<T> {
  message: string;
  data?: T;
}

export interface IErrorResponse {
  message: string;
  error?: string | null;
  errors?: string[] | [] | object | null;
}

export interface IErrorResponseWithStatus extends IErrorResponse {
  status?: number;
}
