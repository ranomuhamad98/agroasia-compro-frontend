import type { ICategory } from "@/types/category-d-t";

const category_data: ICategory[] = [
  {
    id: 1,
    img: "/images/category/5/category-1.jpg",
    parentName: "Frozen Foods",
    products: [1,2,13,14,17],
    children: ["Baby Food", "Strawberry", "Seafood"],
    textClr:'#5C8C10'
  },
  {
    id: 2,
    img: "/images/category/5/category-2.jpg",
    parentName: "Meat and Fish",
    products: [3, 4],
    children: ["Meat", "Fish"],
    textClr:'#FA3737'
  },
  {
    id: 3,
    img: "/images/category/5/category-3.jpg",
    parentName: "Milk & Dairy",
    products: [5, 6],
    children: ["Milk", "Dairy"],
    textClr:'#F87117'
  },
  {
    id: 4,
    img: "/images/category/5/category-4.jpg",
    parentName: "Beverages",
    products: [7, 8,16],
    children: ["Tea", "Coffee"],
    textClr:'#5C8C10'
  },
  {
    id: 5,
    img: "/images/category/5/category-5.jpg",
    parentName: "Vegetables",
    products: [9, 12],
    children: ["Tomato", "Potato"],
    textClr:'#FF7B02'
  },
  {
    id: 6,
    img: "/images/category/5/category-6.jpg",
    parentName: "Fruits",
    products: [10, 11,15],
    children: ["Mango", "Banana"],
    textClr:'#F63C3B'
  },
];

export default category_data;
