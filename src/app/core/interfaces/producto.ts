export enum ProductE {
    name = 'nameProduct',
    price = 'priceProduct',
    amount = 'amountProduct',
    description = 'descriptionProduct',
    infoProduct = 'productDetail'
  }
  
  export interface Producto {
    id: number;
    [ProductE.name]: string;
    [ProductE.price]: number;
    [ProductE.amount]: number;
    [ProductE.description]: string;
  }

  export interface BillF {
    [ProductE.infoProduct]: Producto;
    [ProductE.amount]: number;
  }