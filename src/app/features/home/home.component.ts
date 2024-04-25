import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ProductE, Producto } from 'src/app/core/interfaces/producto';
import { AlertsMsgService } from 'src/app/core/services/alerts-msg.service';
import { HttpApiService } from 'src/app/core/services/http-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  inputs = ProductE;
  productForm!: FormGroup;

  isCreate = true;
  isVisibleForm: boolean = false;
  productos: Producto[] = [];
  selectedProducts: Producto[] = [];

  unsuscribe$!: Subject<void>

  private readonly stockHttp = inject(HttpApiService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly alerts = inject(AlertsMsgService);

  ngOnInit(): void {
    this.initVariables();
    this.showProductTable();
  }

  ngOnDestroy(): void {
    this.unsuscribe$.next();
    this.unsuscribe$.complete();
  }

  initVariables(): void {
    this.unsuscribe$ = new Subject<void>();
  }

  showProductTable(): void {
    this.stockHttp.getStockProductHttp()
      .then(products => this.productos = products as Producto[]);
  }

  showForm(): void {
    this.createFormProductComponent();
    this.isVisibleForm = true;
  }

  createFormProductComponent(): void {
    const { name, price, amount, description } = ProductE;
    this.productForm = this.fb.group({
      id: [0],
      [name]: ['', Validators.required],
      [price]: [null, Validators.required],
      [amount]: [null, Validators.required],
      [description]: [''],
    });

    this.isNumberPositive();
  }

  isNumberPositive(): void {
    const { price, amount } = ProductE;

    this.productForm.get(price)?.valueChanges
      .pipe(takeUntil(this.unsuscribe$))
      .subscribe(value => this.isValueInputNumber(value, ProductE.price));

    this.productForm.get(amount)?.valueChanges
      .pipe(takeUntil(this.unsuscribe$))
      .subscribe(value => this.isValueInputNumber(value, ProductE.amount));
  }

  isValueInputNumber(input: string, campo: string): void {
    if (isNaN(+input) || (Number(input) < 1)) {
      this.productForm.get(campo)?.setErrors({
        invalidValue: true
      });
      return;
    }

    const options = { emitEvent: false };
    this.productForm.get(campo)?.setValue(Number(input), options);
  }

  onSubmit(): void {
    this.stockHttp.createProductStockHttp(this.productForm.value)
      .then(msg => {
        this.showProductTable();
        this.alerts.success({ summary: 'alerts.ok', msg: msg as string });
        this.productForm.reset();
      });
  }

  saleProduct(): void {
    this.alerts.warning({ summary: 'alerts.warn', msg: 'Funcionalidad en desarrollo' });
    if (this.productos.length > 0) {
      this.router.navigate(['sale-product']);
      return;
    }

    this.alerts.info({ summary: 'alerts.info', msg: 'alerts.inventory.info.msg-1' });
  }

  editProducts(): void {
    const { name, price, amount, description } = ProductE;
    const [regisEdit] = this.selectedProducts;
     
    this.isCreate = false;
    this.showForm();
    setTimeout(() => {
      this.productForm.patchValue({
        id: regisEdit.id,
        [name]: regisEdit[name],
        [price]: regisEdit[price],
        [amount]: regisEdit[amount],
        [description]: regisEdit[description],
      });
    }, 750)
    this.selectedProducts = [];
  }

  modifyProduct(): void {
    this.stockHttp.updateProductStockHttp(this.productForm.value)
      .then(msg => {
        this.showProductTable();
        this.alerts.success({ summary: 'alerts.ok', msg: msg as string });
        this.productForm.reset();
        this.isCreate = true;
        this.isVisibleForm = false;
      });
  }

  deleteProducts(): void {
    this.stockHttp.deleteProductStockHttp(this.selectedProducts)
      .then(msg => {
        this.showProductTable();
        this.alerts.success({ summary: 'alerts.ok', msg: msg as string });
        this.isCreate = true;
        this.isVisibleForm = false;
        this.selectedProducts = [];
      });
  }

}
