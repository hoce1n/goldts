export interface ApiError {
    code: string;
    message: string;
    details?: Record<string, string[]>;
    correlationId?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    error?: ApiError;
}