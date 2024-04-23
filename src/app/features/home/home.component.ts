import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { ProductE, Producto } from 'src/app/core/interfaces/producto';
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
  private readonly messageService = inject(MessageService);

  ngOnInit(): void {
    this.initVariables();
    this.showProductTable();
    /*
    TODO: este método solo esta de prueba, no hace referencia a
    ninguna funcionalidad de la tienda.
    */
    this.testConnectionApiFakeUsinGitHubPages();
    this.testConnectionApiUsinRender();
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
        this.messageService.add({ severity: 'success', summary: 'Acción Éxitosa', detail: msg as string });
        this.productForm.reset();
      });
  }

  saleProduct(): void {
    this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Funcionalidad en desarrollo' });
    if (this.productos.length > 0) {
      this.router.navigate(['sale-product']);
      return;
    }

    this.messageService.add({ severity: 'info', summary: 'Información', detail: 'Registre en el inventario al menos un producto para poder efectuar la venta.' });
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
        this.messageService.add({ severity: 'success', summary: 'Acción Éxitosa', detail: msg as string });
        this.productForm.reset();
        this.isCreate = true;
        this.isVisibleForm = false;
      });
  }

  deleteProducts(): void {
    this.stockHttp.deleteProductStockHttp(this.selectedProducts)
      .then(msg => {
        this.messageService.add({ severity: 'success', summary: 'Acción Éxitosa', detail: msg as string });
        this.isCreate = true;
        this.isVisibleForm = false;
        this.selectedProducts = [];
      });
  }

  testConnectionApiFakeUsinGitHubPages(): void {
    this.stockHttp.getTestApiFake()
    .subscribe(res => console.log('response a fake githubpage: \n', JSON.stringify(res, null, 2)));
  }
  
  testConnectionApiUsinRender(): void {
    this.stockHttp.getTestApi()
    .subscribe(res => console.log('\n\n\nresponse api render: \n', JSON.stringify(res, null, 2)));
  }

}
