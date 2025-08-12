export interface ContactUsPayload {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
}

export interface ContactUs extends ContactUsPayload {
    id: string;
    created_at: string;
}

export interface ContactUsResponse {
    status: number,
    message: string,
    data: ContactUs[],
}