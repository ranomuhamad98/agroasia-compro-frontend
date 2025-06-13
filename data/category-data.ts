import type { ICategory } from "@/types/category-d-t";

const category_data: ICategory[] = [
  {
    id: 1,
    img: "/images/category/5/category-1.jpg",
    parentName: "Minuman",
    products: [1,2,13,14,17],
    children: ["Baby Food", "Strawberry", "Seafood"],
    textClr:'#5C8C10'
  },
  {
    id: 2,
    img: "/images/category/5/category-2.jpg",
    parentName: "Makanan",
    products: [3, 4],
    children: ["Meat", "Fish"],
    textClr:'#FA3737'
  },
  {
    id: 3,
    img: "/images/category/5/category-3.jpg",
    parentName: "Hasil Alam",
    products: [5, 6],
    children: ["Milk", "Dairy"],
    textClr:'#F87117'
  },
];

export default category_data;
