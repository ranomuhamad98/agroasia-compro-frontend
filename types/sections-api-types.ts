export interface SectionPayload {
    value: string;
    position: number;
}

export interface Section extends SectionPayload {
    id: string;
    section: string;
    tipe: string;
    input_time: string;
    update_time: string;
}

export interface SectionApiResponse {
    status: number;
    message: string;
    settings: Section[];
}

export interface SectionNameApiResponse {
    status: number;
    message: string;
    sections: string[];
}

export interface SectionSingleApiResponse {
    status: number;
    message: string;
    setting: Section;
}