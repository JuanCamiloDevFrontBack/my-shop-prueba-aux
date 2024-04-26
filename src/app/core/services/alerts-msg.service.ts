import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';

type TypeMsg = { summary: string, msg: string };

@Injectable({
  providedIn: 'root'
})
export class AlertsMsgService {

  constructor(
    private readonly translate: TranslateService,
    private readonly messageService: MessageService
  ) { }

  i18n(msg: string): string {
    return this.translate.instant(msg);
  }

  info(msg: TypeMsg): void {
    this.messageService.add({ severity: 'info', summary: this.i18n(msg.summary), detail: this.i18n(msg.msg) });
  }

  success(msg: TypeMsg): void {
    this.messageService.add({ severity: 'success', summary: this.i18n(msg.summary), detail: this.i18n(msg.msg) }); 
  }

  warning(msg: TypeMsg): void {
    this.messageService.add({ severity: 'warn', summary: this.i18n(msg.summary), detail: this.i18n(msg.msg) }); 
  }

  error(msg: TypeMsg): void {
    this.messageService.add({ severity: 'error', summary: this.i18n(msg.summary), detail: this.i18n(msg.msg) }); 
  }

}
