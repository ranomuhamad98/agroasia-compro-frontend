export interface IProduct {
  sku: string;
  id: number;
  name: string;
  images: string[];
  parentCategory: string;
  children: string;
  price: number;
  discount: number;
  quantity: number;
  description: string;
  additionalInfo: {
    key: string;
    value: string;
  }[];
  reviews: {
    id: number;
    name: string;
    comment: string;
    rating: number;
    user: string;
    date: string;
  }[];
  tags: string[];
  orderQuantity?:number;
  brand:string;
  top_rated?:boolean;
  sell_count?:number;
  offerDate?:{
    startDate:string;
    endDate:string;
  }
}