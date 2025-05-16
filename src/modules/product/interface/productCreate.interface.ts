import { statusEnum } from "../enum";


export interface IproductCreate{
  name: string,
  description: string,
  price: number,
  discount: number,
  rating: number,
  stock: number,
  status: statusEnum;
}