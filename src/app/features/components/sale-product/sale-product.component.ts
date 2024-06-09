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
import { AlertsMsgService } from 'src/app/core/services/alerts-msg.service';
import { MessagesModule } from 'primeng/messages';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-sale-product',
  standalone: true,
  imports: [CommonModule, SharedModule, FormsModule, ReactiveFormsModule, MessagesModule, TranslateModule],
  templateUrl: './sale-product.component.html',
  styleUrls: ['./sale-product.component.css']
})
export class SaleProductComponent implements OnInit, OnDestroy {

  inputs = ProductE;

  billForm!: FormGroup;
  productos: Producto[] = [];
  factura: Producto[] = [];
  billHistory: Producto[][] = [];
  total!: number;

  messages!: Message[];

  private unsuscribe$!: Subject<void>;

  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly alerts = inject(AlertsMsgService);
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
    this.messages = [];
    this.unsuscribe$ = new Subject();
    this.showBill(true);
  }

  showBill(updatesProducts: boolean = false): void {
    if (updatesProducts) {
      this.stockHttp.getStockProductOfBillHttp()
        .then(prod => {
          this.productos = prod as Producto[];
          this.showAlertProducts();
        });
    }
    this.stockHttp.getBillHttp()
      .then(bill => {
        this.factura = bill as Producto[];
        this.total = (this.factura.length > 0) ?
          this.prodService.calculateTotalSaleBill(this.factura) : 0;
      });
  }

  showAlertProducts(): void {
    if (this.productos.length === 0) {
      setTimeout(() => {
        const summary = this.alerts.i18n('alerts.warn');
        const detail = this.alerts.i18n('alerts.bill.warning.empty-stock');
        this.messages = [{ key: 'alert-product', severity: 'info', summary, detail }];
      }, 500);
    }
    else {
      this.messages = [];
    }
  }

  createFormBill(): void {
    const { amount, infoProduct } = ProductE;
    this.billForm = this.fb.group({
      [infoProduct]: [null, Validators.required],
      [amount]: [null, Validators.required]
    });
    this.isAmountValid();
  }

  inputProdForm(): Producto {
    return this.billForm.get(ProductE.infoProduct)?.value;
  }

  isAmountValid(): void {
    this.billForm.get(ProductE.amount)?.valueChanges
      .pipe(takeUntil(this.unsuscribe$))
      .subscribe(value => this.isValueInputValid(value));
  }

  isValueInputValid(value: string): void {
    const amount = Number(value);
    const idProd = +this.inputProdForm().id;
    const isInvalid = (
      isNaN(amount) ||
      amount < 1 ||
      amount > +this.inputProdForm()?.[ProductE.amount] ||
      amount > +this.prodService.isAmountMaxLimitStock(idProd)
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

  addProduct(): void {
    const methodMsg = (typeAlert: string, message: any) => {
      this.billForm.reset();
      this.showBill();
      this.alerts.success({ summary: typeAlert, msg: message })
    }

    if (this.factura.length === 0) {
      this.stockHttp.updateBillHttp(this.billForm.value)
        .then(msg => methodMsg('alerts.ok', msg))
        .catch(err => this.alerts.error({ summary: 'alerts.err', msg: err as string }));
      return;
    }

    const newRegister = this.prodService.isRegisterDuplicateBill(this.billForm.value);
    if (newRegister) {
      this.stockHttp.updateBillHttp(this.billForm.value)
        .then(msg => methodMsg('alerts.ok', msg))
        .catch(err => this.alerts.error({ summary: 'alerts.err', msg: err as string }));
    } else {
      methodMsg('alerts.ok', 'alerts.bill.success.msg-2');
    }
  }

  autorizeBill(): void {
    this.stockHttp.updateBillHistoryHttp(this.factura)
      .then(msg => {
        const refreshProducts = true;
        this.showBill(refreshProducts);
        this.updateBillHistory();
        this.alerts.success({ summary: 'alerts.ok', msg: msg as string })
      })
      .catch(err => this.alerts.error({ summary: 'alerts.err', msg: err as string }));;
  }

  updateBillHistory(): void {
    this.stockHttp.getBillHistoryHttp()
      .then(bills => {
        this.billHistory = bills as Producto[][];
      });
  }

  back(): void {
    this.prodService.clearBill();
    this.router.navigate(['home']);
  }

}
