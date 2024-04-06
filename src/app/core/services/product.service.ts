import { Injectable } from '@angular/core';
import { Producto } from '../interfaces/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  products: Producto[] = [];

  constructor() { }

  getRegistersHttpFake(): Promise<unknown> {
    return Promise.resolve(this.products);
  }

  postCreateRegister(addProduct: Producto): Promise<unknown> {
    addProduct.id = this.products.length + 1;
    this.products.push(addProduct);
    return Promise.resolve('Se agrego el producto al inventario');
  }

  postEditRegister(editProduct: Producto): Promise<unknown> {
    const index = this.products.findIndex(value => value.id === editProduct.id);
    this.products[index] = editProduct;
    return Promise.resolve('Se edito el producto en el inventario');
  }

  postDeleteRegister(id: number[]): Promise<unknown> {
    let index = 0;
    id.forEach(idSearch => {
      index = this.products.findIndex(produ => produ.id === idSearch)
      this.products.splice(index, 1);
    })
    return Promise.resolve('Se eliminó el producto en el inventario');
  }

}
