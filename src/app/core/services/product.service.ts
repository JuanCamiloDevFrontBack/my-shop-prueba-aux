import { Injectable } from '@angular/core';
import { BillF, ProductE, Producto } from '../interfaces/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  products: Producto[] = [];
  bill: Producto[] = [];
  billHistory: Producto[][] = [];

  constructor() { }

  // isRegisterDuplicateBill(addProduct: BillF): boolean {
  //   const { productDetail, amountProduct } = structuredClone(addProduct);
  //   const exist = this.bill.some(item => item.id === productDetail.id);

  //   if (exist) {
  //     const index = this.bill.findIndex(item => item.id === productDetail.id);
  //     let amountProductNumber = Number(amountProduct);
  //     this.bill[index][ProductE.amount] += amountProductNumber;
  //     const ind = this.products.findIndex(produ => produ.id === productDetail.id);
  //     this.products[ind][ProductE.amount] -= amountProductNumber;
  //     return false;
  //   }
  //   return true;
  // }

  isRegisterDuplicateBill(addProduct: BillF): boolean {
    const { productDetail, amountProduct } = structuredClone(addProduct);
    const exist = this.bill.some(item => item.id === productDetail.id);

    if (exist) {
      const index = this.bill.findIndex(item => item.id === productDetail.id);
      let amountProductNumber = Number(amountProduct);
      this.bill[index][ProductE.amount] += amountProductNumber;
      return false;
    }
    return true;
  }

  calculateTotalSaleBill(billProd: Producto[]): number {
    let sum = 0;
    billProd.forEach(prod => {
      sum += (prod[ProductE.amount] * prod[ProductE.price]);
    })
    return sum;
  }

  clearBill(): void {
    this.bill = [];
    this.billHistory = [];
  }

  getRegistersHttpFake(): Promise<unknown> {
    return Promise.resolve([...this.products].concat([]));
  }

  getRegistersBillHttpFake(): Promise<unknown> {
    return Promise.resolve([...this.bill].concat([]));
  }

  getRegistersBillHistoryHttpFake(): Promise<unknown> {
    return Promise.resolve([...this.billHistory].concat([]));
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
    const { productDetail, amountProduct } = structuredClone(addProduct);

    let index = this.products.findIndex(produ => produ.id === productDetail.id);
    if (index === -1) {
      return Promise.reject('alerts.bill.error.msg-1');
    }

    let amountProductNumber = Number(amountProduct);

    productDetail[ProductE.amount] = amountProductNumber;
    this.bill.push(productDetail);
    this.products[index][ProductE.amount] -= amountProductNumber;
    return Promise.resolve('alerts.bill.success.msg-1');
  }

  postAddRegisterBill2(addProduct: BillF): Promise<unknown> {
    const { productDetail, amountProduct } = structuredClone(addProduct);

    let amountProductNumber = Number(amountProduct);

    productDetail[ProductE.amount] = amountProductNumber;
    this.bill.push(productDetail);
    // return Promise.resolve('alerts.bill.success.producto agregado a la factura');
    return Promise.resolve('alerts.bill.success.msg-1');
  }

  postAddRegisterConfirmBill(addProductHistory: Producto[]): Promise<unknown> {
    this.billHistory.push(addProductHistory);
    this.bill = [];
    return Promise.resolve('alerts.bill.success.msg-1');
  }

}
