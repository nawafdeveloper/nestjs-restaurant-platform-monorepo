export interface PaginationQuery {
    page?: number;
    limit?: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ServiceResponse<T = null> {
    success: boolean;
    message?: string;
    data?: T;
}