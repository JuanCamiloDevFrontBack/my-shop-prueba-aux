// import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BillF, Producto } from '../interfaces/producto';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class HttpApiService {

  // private readonly http = inject(HttpClient);
  private readonly httpFake = inject(ProductService);

  constructor() { }

  getStockProductHttp(): Promise<unknown> {
    // this.http.get('url-api/endpoint');
    return this.httpFake.getRegistersHttpFake();
  }

  createProductStockHttp(newProduct: Producto): Promise<unknown> {
    // this.http.post('url-api/endpoint', editProduct);
    return this.httpFake.postCreateRegister(newProduct);
  }

  updateProductStockHttp(editProduct: Producto): Promise<unknown> {
    // this.http.put('url-api/endpoint', editProduct);
    return this.httpFake.postEditRegister(editProduct);
  }

  deleteProductStockHttp(deleteProducts: Producto[]): Promise<unknown> {
    // this.http.delete('url-api/endpoint', editProduct);
    const arrId: number[] = [];
    deleteProducts.forEach(prod => {
      arrId.push(prod.id);
    });
    return this.httpFake.postDeleteRegister(arrId);
  }

  getBillHttp(): Promise<unknown> {
    // this.http.get('url-api/endpoint');
    return this.httpFake.getRegistersBillHttpFake();
  }

  updateBillHttp(addProduct: BillF): Promise<unknown> {
    // this.http.put('url-api/endpoint', addProduct);
    return this.httpFake.postAddRegisterBill(addProduct);
  }

}
