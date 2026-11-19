export interface CategoriesApiResponse {
    status: number;
    message: string;
    categories: Category[];
}

export interface Category {
    id: string;
    name: string;
    image_link: string;
    input_time: string;
    update_time: string;
}