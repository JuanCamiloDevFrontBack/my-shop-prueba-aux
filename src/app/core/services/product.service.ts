import { Injectable } from '@angular/core';
import { BillF, ProductE, Producto } from '../interfaces/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  products: Producto[] = [];
  bill: Producto[] = [];

  constructor() { }

  isRegisterDuplicateBill(register: Producto): boolean {
    const exist = this.bill.some(item => item.id === register.id);

    if (exist) {
      const index = this.bill.findIndex(item => item.id === register.id);
      this.bill[index][ProductE.amount] += register[ProductE.amount];
      return false;
    }
    return true;
  }

  getRegistersHttpFake(): Promise<unknown> {
    return Promise.resolve(this.products);
  }

  getRegistersBillHttpFake(): Promise<unknown> {
    return Promise.resolve(this.bill);
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

  postAddRegisterBill(addProduct: BillF): Promise<unknown> {
    const { nameProduct, amountProduct } = structuredClone(addProduct);
    let index = 0;

    nameProduct[ProductE.amount] = amountProduct;
    this.bill.push(nameProduct);
    index = this.products.findIndex(produ => produ.id === nameProduct.id)
    this.products[index][ProductE.amount] -= amountProduct;
    return Promise.resolve('Se agregó el producto en la factura');
  }

}
