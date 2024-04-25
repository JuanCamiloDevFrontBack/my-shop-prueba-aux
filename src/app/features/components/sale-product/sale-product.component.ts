import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductE, Producto } from 'src/app/core/interfaces/producto';
import { Router } from '@angular/router';
import { HttpApiService } from 'src/app/core/services/http-api.service';
import { ProductService } from 'src/app/core/services/product.service';
import { Subject, takeUntil } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-sale-product',
  standalone: true,
  imports: [CommonModule, SharedModule, FormsModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './sale-product.component.html',
  styleUrls: ['./sale-product.component.css']
})
export class SaleProductComponent implements OnInit, OnDestroy {

  inputs = ProductE;

  billForm!: FormGroup;
  productos: Producto[] = [];
  factura: Producto[] = [];
  subTotal: number[] = [];
  total!: number;

  private unsuscribe$!: Subject<void>;

  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly prodService = inject(ProductService);
  private readonly stockHttp = inject(HttpApiService);

  ngOnInit(): void {
    this.initVariables();
    this.createFormBill();
  }

  ngOnDestroy(): void {
    this.billForm.reset();
    this.factura = [];
    this.unsuscribe$.next();
    this.unsuscribe$.complete();
  }

  initVariables(): void {
    this.total = 0;
    this.unsuscribe$ = new Subject();
    this.showBill();
  }

  showBill(): void {
    this.stockHttp.getStockProductOfBillHttp()
      .then(prod => {       
        this.productos = prod as Producto[];
      });
    this.stockHttp.getBillHttp()
      .then(bill => {
        this.factura = bill as Producto[];
      });
  }

  createFormBill(): void {
    const { amount, ...prod } = ProductE;
    this.billForm = this.fb.group({
      [prod.name]: [null, Validators.required],
      [amount]: [null, Validators.required]
    });
    this.isAmountValid();
  }

  inputProdForm(): Producto {
    return this.billForm.get(ProductE.name)?.value;
  }

  isAmountValid(): void {
    this.billForm.get(ProductE.amount)?.valueChanges
      .pipe(takeUntil(this.unsuscribe$))
      .subscribe(value => this.isValueInputValid(value));
  }

  isValueInputValid(value: string): void {    
    const isInvalid = (
      isNaN(+value) ||
      Number(value) < 1 ||
      Number(value) > +this.inputProdForm()?.[ProductE.amount]
    );

    if (isInvalid) {
      this.billForm.get(ProductE.amount)?.setErrors({
        invalidValue: true
      });
    }
  }

  trackByProductBill(index: number, item: Producto): number {
    return item.id;
  }

  agregarProducto(): void {
    if (this.factura.length === 0) {
      this.stockHttp.updateBillHttp(this.billForm.value);
      this.billForm.reset();
      this.showBill();
      return;
    }

    const newRegister = this.prodService.isRegisterDuplicateBill(this.billForm.value);
    if (newRegister) {
      this.stockHttp.updateBillHttp(this.billForm.value);
    }
    this.billForm.reset();
    this.showBill();
  }

  back(): void {
    this.router.navigate(['home']);
  }

}
