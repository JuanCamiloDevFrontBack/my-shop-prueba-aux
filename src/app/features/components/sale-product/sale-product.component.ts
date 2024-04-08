import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductE, Producto } from 'src/app/core/interfaces/producto';
import { Router } from '@angular/router';
import { HttpApiService } from 'src/app/core/services/http-api.service';

@Component({
  selector: 'app-sale-product',
  standalone: true,
  imports: [CommonModule, SharedModule, FormsModule, ReactiveFormsModule],
  templateUrl: './sale-product.component.html',
  styleUrls: ['./sale-product.component.css']
})
export class SaleProductComponent implements OnInit {

  inputs = ProductE;

  productos: Producto[] = [];
  productoSeleccionado!: Producto;
  cantidad!: number;
  factura: Producto[] = [];
  billForm!: FormGroup;

  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly stockHttp = inject(HttpApiService);

  ngOnInit(): void {
      this.initVariables();
      this.createFormBill();
  }

  initVariables(): void {
    this.stockHttp.getStockProductHttp()
    .then(products => {
      this.productos = products as Producto[];
      this.factura = this.productos;
    });
  }

  createFormBill(): void {
    const { amount, ...prod } = ProductE;
    this.billForm = this.fb.group({
      [prod.name]: [null, Validators.required],
      [amount]: [null, Validators.required]
    });
  }

  agregarProducto(): void {
    // if (!this.productoSeleccionado || this.cantidad <= 0) {
    //   return;
    // }
    // const productoExistente = this.factura.find(item => item.producto['nameProduct'] === this.productoSeleccionado['nameProduct']);
    // if (productoExistente) {
    //   productoExistente.cantidad += this.cantidad;
    //   productoExistente.total = productoExistente.cantidad * productoExistente.producto['priceProduct'];
    // } else {
    //   const total = this.cantidad * this.productoSeleccionado['priceProduct'];
    //   this.factura.push({ producto: this.productoSeleccionado, cantidad: this.cantidad, total });
    // }
    // // Descontar la cantidad vendida del inventario del producto
    // this.productoSeleccionado['amountProduct'] -= this.cantidad;
    // this.cantidad = 0;
  }

  calcularTotal(): number {
    // return this.factura.reduce((total, item) => total + item.total, 0);
    return 0;
  }

  back(): void {
    this.router.navigate(['home']);
  }

}
