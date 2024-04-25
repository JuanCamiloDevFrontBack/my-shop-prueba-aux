import { Injectable } from '@angular/core';
import { BillF, ProductE, Producto } from '../interfaces/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  products: Producto[] = [];
  bill: Producto[] = [];

  constructor() { }

  isRegisterDuplicateBill(addProduct: BillF): boolean {
    const { nameProduct, amountProduct } = structuredClone(addProduct);
    const exist = this.bill.some(item => item.id === nameProduct.id);

    if (exist) {
      const index = this.bill.findIndex(item => item.id === nameProduct.id);
      this.bill[index][ProductE.amount] += Number(amountProduct);
      const ind = this.products.findIndex(produ => produ.id === nameProduct.id);
      this.products[ind][ProductE.amount] -= Number(amountProduct);
      return false;
    }
    return true;
  }

  getRegistersHttpFake(): Promise<unknown> {
    return Promise.resolve([...this.products].concat([]));
  }

  getRegistersBillHttpFake(): Promise<unknown> {
    return Promise.resolve([...this.bill].concat([]));
  }

  postCreateRegister(addProduct: Producto): Promise<unknown> {
    let lastElement = 0;
    if (this.products.length > 0) {
      lastElement = this.products.length - 1;
      addProduct.id = this.products[lastElement]?.id + 1;
    } else addProduct.id = lastElement;
    this.products.push(addProduct);
    return Promise.resolve('alerts.inventory.success.msg-1');
  }

  postEditRegister(editProduct: Producto): Promise<unknown> {
    const index = this.products.findIndex(value => value.id === editProduct.id);
    if (index === -1) {
      return Promise.reject('alerts.inventory.error.msg-1');
    }
    this.products[index] = editProduct;
    return Promise.resolve('alerts.inventory.success.msg-2');
  }

  postDeleteRegister(arrayId: number[]): Promise<unknown> {
    let index = 0;
    let indexBill = 0;
    let elementNotFound: number[] = [];
    let elementBillNotFound: number[] = [];
    arrayId.forEach(idSearch => {
      index = this.products.findIndex(produ => produ.id === idSearch)
      indexBill = this.bill.findIndex(produ => produ.id === idSearch)

      if (index === -1) elementNotFound.push(idSearch);
      else this.products.splice(index, 1);

      if (indexBill === -1) elementBillNotFound.push(idSearch);
      else this.bill.splice(indexBill, 1);
    })

    if (elementNotFound.length === 0) {
      return Promise.resolve('alerts.inventory.success.msg-3');
    }
    return Promise.reject('alerts.inventory.error.msg-2');
  }

  postAddRegisterBill(addProduct: BillF): Promise<unknown> {
    const { nameProduct, amountProduct } = structuredClone(addProduct);
    let index = 0;

    nameProduct[ProductE.amount] = Number(amountProduct);
    this.bill.push(nameProduct);
    index = this.products.findIndex(produ => produ.id === nameProduct.id)
    this.products[index][ProductE.amount] -= Number(amountProduct);
    return Promise.resolve('alerts.bill.success.msg-1');
  }

}
