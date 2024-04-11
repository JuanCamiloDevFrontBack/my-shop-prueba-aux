import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BillF, Producto } from '../interfaces/producto';
import { ProductService } from './product.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpApiService {

  private readonly http = inject(HttpClient);
  private readonly httpFake = inject(ProductService);

  constructor() { }

  getTestApiFake(): Observable<unknown> {
    return this.http.get('https://juancamilotest.github.io/test-deploy-json-fake/db.json');
  }

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
