import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { InputTextareaModule } from 'primeng/inputtextarea';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    CardModule,
    ToastModule,
    TableModule,
    InputTextareaModule,
  ],
  exports: [
    DropdownModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    ToastModule,
    TableModule,
    InputTextareaModule,
  ]
})
export class SharedModule { }
