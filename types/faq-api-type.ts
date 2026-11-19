export interface FAQPayload {
    title: string;
    content: string;
    position: number;
    status: boolean;
}

export interface FAQ extends FAQPayload {
    id: string;
    input_time: string;
    update_time: string;
}

export interface FAQApiResponse {
    status: number;
    message: string;
    faqs: FAQ[]
}