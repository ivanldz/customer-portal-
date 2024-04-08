import { ForbiddenException, Injectable } from '@nestjs/common';
import { SendClaim } from './dto/send-claim';
import { PayloadToken } from 'src/auth/interfaces/payload-jwt';
import { UserService } from 'src/users/user.service';
import { MailerService } from '@nestjs-modules/mailer';
import { Permission } from 'src/auth/entities/permissions.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ClaimsService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly userService: UserService,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) { }

  async sendClaim(
    { subject, body }: SendClaim,
    attachments: Array<Express.Multer.File>,
    session: PayloadToken,
  ): Promise<void> {
    const isAdmin = session.permissions.includes('admin');
    if (!isAdmin && !session.permissions.includes(subject)) {
      throw new ForbiddenException('You cannot access this resource');
    }

    const user = await this.userService.getUser(session.email);
    const recipients = await this.getRecipent(subject)
    const sender = recipients[0];

    const cc = recipients.slice(1, recipients.length);
    return this.mailerService.sendMail({
      to: recipients[0],
      from: sender,
      cc: cc,
      subject: subject,
      template: 'claim',
      context: {
        userEmail: session.email,
        company: user.company,
        body,
        subject,
        attachmentsLength: attachments.length,
      },
      attachments: attachments.map((file) => ({
        filename: file.originalname,
        content: file.buffer.toString('base64'),
        encoding: 'base64',
      })),
    });
  }

  private async getRecipent(subject: string): Promise<string[]> {
    const permission = await this.permissionRepository.findOneBy({
      name: subject,
    });
    return permission.representativeEmail.split(',');
  }
}
