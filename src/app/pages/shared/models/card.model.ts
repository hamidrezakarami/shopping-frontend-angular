import { Product } from './product.model';
export class Card {
  _id: string;
  status: string;
  address: string;
  totalPrice: number;
  arrivalDate: string;
  description: string;
  createCardDate: string;
  products: Product[];
}
