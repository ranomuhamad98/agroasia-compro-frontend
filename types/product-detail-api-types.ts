import type { GlobalApiFooter } from "./global-api-type";

export interface ProductDetailApiResponse {
    status: number;
    message: string;
    data: Detail;
}

interface Detail {
    jumbotron: Jumbotron;
    product: ProductDetail;
    footer: GlobalApiFooter;
    wa_text_interest: string;
}

interface Jumbotron {
    image: string;
    title: string;
}

export interface ProductDetail {
    id: string;
    name: string;
    summary: string;
    description: string;
    category_name: string;
    tags: string[];
    category_id: string;
    gallery: Gallery[]
    additional_information: AdditionalInformation;
}

interface Gallery {
    image: string;
    status: string;
}

interface AdditionalInformation {
    content_1: string;
    content_2: {
        rows: string[];
        headers: string[];
    };
    content_3: string;
}