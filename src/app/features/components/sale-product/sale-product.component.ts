import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Producto } from 'src/app/core/interfaces/producto';

@Component({
  selector: 'app-sale-product',
  standalone: true,
  imports: [CommonModule, SharedModule, FormsModule, ReactiveFormsModule],
  templateUrl: './sale-product.component.html',
  styleUrls: ['./sale-product.component.css']
})
export class SaleProductComponent {

  productos: Producto[] = [
    { id: 1, nameProduct: 'Producto 1', priceProduct: 10, amountProduct: 100, descriptionProduct: '' },
    { id: 1, nameProduct: 'Producto 2', priceProduct: 20, amountProduct: 200, descriptionProduct: '' },
    { id: 1, nameProduct: 'Producto 3', priceProduct: 30, amountProduct: 150, descriptionProduct: '' }
  ];
  productoSeleccionado!: Producto;
  cantidad!: number;
  factura: { producto: Producto, cantidad: number, total: number }[] = [];

  agregarProducto(): void {
    if (!this.productoSeleccionado || this.cantidad <= 0) {
      return;
    }
    const productoExistente = this.factura.find(item => item.producto['nameProduct'] === this.productoSeleccionado['nameProduct']);
    if (productoExistente) {
      productoExistente.cantidad += this.cantidad;
      productoExistente.total = productoExistente.cantidad * productoExistente.producto['priceProduct'];
    } else {
      const total = this.cantidad * this.productoSeleccionado['priceProduct'];
      this.factura.push({ producto: this.productoSeleccionado, cantidad: this.cantidad, total });
    }
    // Descontar la cantidad vendida del inventario del producto
    this.productoSeleccionado['amountProduct'] -= this.cantidad;
    this.cantidad = 0;
  }

  calcularTotal(): number {
    return this.factura.reduce((total, item) => total + item.total, 0);
  }

}
