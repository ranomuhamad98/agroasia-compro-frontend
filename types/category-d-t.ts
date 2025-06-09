export interface ICategory{
  id: number;
  img: string;
  parentName: string;
  products: number[];
  children: string[];
  textClr?: string;
}