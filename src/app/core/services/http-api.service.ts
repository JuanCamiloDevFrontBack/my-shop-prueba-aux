import { Injectable, inject } from '@angular/core';
import { BillF, ProductE, Producto } from '../interfaces/producto';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class HttpApiService {

  private readonly httpFake = inject(ProductService);

  constructor() { }

  getStockProductHttp(): Promise<unknown> {
    return this.httpFake.getRegistersHttpFake();
  }

  getStockProductOfBillHttp(): Promise<unknown> {
    return this.httpFake.getRegistersHttpFake()
    .then((prod: any) => prod.filter(
      (product: Producto) => product[ProductE.amount] !== 0));
  }

  createProductStockHttp(newProduct: Producto): Promise<unknown> {
    return this.httpFake.postCreateRegister(newProduct);
  }

  updateProductStockHttp(editProduct: Producto): Promise<unknown> {
    return this.httpFake.postEditRegister(editProduct);
  }

  deleteProductStockHttp(deleteProducts: Producto[]): Promise<unknown> {
    const arrId: number[] = [];
    deleteProducts.forEach(prod => {
      arrId.push(prod.id);
    });
    return this.httpFake.postDeleteRegister(arrId);
  }

  getBillHttp(): Promise<unknown> {
    return this.httpFake.getRegistersBillHttpFake();
  }

  updateBillHttp(addProduct: BillF): Promise<unknown> {
    return this.httpFake.postAddRegisterBill(addProduct);
  }

}
