export class Product {
  _id: string;
  name: string;
  expirationDate: string;
  productionDate: string;
  price: number;
  numberOfEntity: number;
  description: string;
  imgUrls: Array<string>;
  kind: typeof KIND;
  imgUrl: string;
}

export const KIND = [
  'car',
  'cloth',
  'electric',
  'laptop',
  'smartPhone',
  'art',
  'sport',
  'toy',
  'dish',
  'smartWatch',
  'homeDesign',
];
