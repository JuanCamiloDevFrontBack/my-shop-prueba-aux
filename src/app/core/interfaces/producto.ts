export enum ProductE {
    name = 'nameProduct',
    price = 'priceProduct',
    amount = 'amountProduct',
    description = 'descriptionProduct',
  }
  
  export interface Producto {
    id: number;
    [ProductE.name]: string;
    [ProductE.price]: number;
    [ProductE.amount]: number;
    [ProductE.description]: string;
    subTotal: string;
  }

  export interface BillF {
    [ProductE.name]: Producto;
    [ProductE.amount]: number;
  }