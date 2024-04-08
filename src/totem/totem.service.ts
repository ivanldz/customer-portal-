import { Injectable } from '@nestjs/common';
import { NewBudget } from './dto/new-budget.dto';
import { NewContact } from './dto/new-contact';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class TotemService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendBudgetEmail(newBudgetData: NewBudget): Promise<void> {
    const sender = this.configService.get<string>('EMAIL_USER');
    const recipients = this.configService
      .get<string>('EMAIL_RECIPIENTS')
      .split(',');
    const cc = recipients.slice(1, recipients.length);
    return await this.mailerService.sendMail({
      to: recipients[0],
      from: sender,
      cc: cc,
      subject: 'Solicitud de presupuesto personalizado del Vigilador Virtual',
      template: 'totem-budget',
      context: newBudgetData,
    });
  }

  async sendContactEmail(newContactData: NewContact): Promise<void> {
    const sender = this.configService.get<string>('EMAIL_USER');
    const recipients = this.configService
      .get<string>('EMAIL_RECIPIENTS')
      .split(',');
    const cc = recipients.slice(1, recipients.length);
    return await this.mailerService.sendMail({
      to: recipients[0],
      from: sender,
      cc: cc,
      subject: 'Nueva solicitud de contacto por el Vigilador Virtual',
      template: 'totem-contact',
      context: newContactData,
    });
  }
}
