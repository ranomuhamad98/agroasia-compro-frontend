import type { GlobalApiFooter, GlobalApiHeader } from "./global-api-type";

export interface ProductsApiResponse {
    status: number;
    message: string;
    data: {
        jumbotron: ProductJumbotron;
        listing_title: string;
        products: Product[];
        pagination: ProductPagination;
        wa_text_interest: string;
        header: GlobalApiHeader;
        footer: GlobalApiFooter;
    };
}

export interface ProductJumbotron {
    image: string;
    title: string;
}

export interface Product {
    id: string;
    name: string;
    image: string;
    summary: string;
    category: string;
    category_id: string;
    update_time: string;
}

export interface ProductPagination {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
}

export interface ProductsApiParams {
    page?: number;
    limit?: number;
    category?: string;
}