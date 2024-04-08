import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCompany } from './dto/create-company.dto';
import { Company } from './entities/company.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pagination } from 'src/global/interface/pagniation';
import { RegistrationForm } from './dto/registration-form.dto';
import { UserService } from 'src/users/user.service';
import { v4 as uuid } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class CompaniesService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly mailerService: MailerService,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) { }

  async create({ name, clientId }: CreateCompany): Promise<Company> {
    const company = new Company();
    company.clientId = clientId;
    company.name = name;

    return await this.companyRepository.save(company);
  }

  async findAll(page: number, pageSize: number): Promise<Pagination<Company>> {
    const skip = (page - 1) * pageSize;
    const [records, total] = await this.companyRepository.findAndCount({
      skip,
      take: pageSize,
    });
    const totalPages = Math.ceil(total / pageSize);
    return {
      records,
      paginations: {
        page,
        pageSize,
        totalPages,
      },
    };
  }

  async findById(clientId: string): Promise<Company> {
    return this.companyRepository.findOneBy({ clientId: clientId });
  }

  async remove(clientId: string): Promise<Company> {
    const company = await this.findById(clientId);
    return this.companyRepository.remove(company);
  }

  async generateActivateToken(id: number): Promise<string> {
    const token = uuid();
    await this.companyRepository.save({
      id: id,
      activationToken: token,
    });

    return token;
  }

  async registerCompany(
    formData: RegistrationForm,
    attachments: Array<Express.Multer.File>,
  ): Promise<void> {
    if (formData.password != formData.repeatPassword) {
      throw new BadRequestException('Passwords not equals');
    }
    const clientId = await this.genClientId();
    const company = await this.create({
      clientId: clientId,
      name: formData.companyName,
    });

    await this.userService.createAdmin(
      formData.email,
      formData.password,
      company,
    );

    const activationToken = await this.generateActivateToken(company.id);
    const host = this.configService.get<string>('HOST');
    const activationLink = `${host}/api/companies/activate?token=${activationToken}`;
    const sender = this.configService.get<string>('EMAIL_USER');
    const recipients = this.configService
      .get<string>('EMAIL_RECIPIENTS')
      .split(',');
    const cc = recipients.slice(1, recipients.length);
    await this.mailerService.sendMail({
      to: recipients[0],
      cc: cc,
      from: sender,
      subject: 'Nuevo Cliente ✔',
      template: 'new-client',
      context: {
        clientId: company.clientId,
        activationLink,
        formData,
      },
      attachments: attachments.map((file) => ({
        filename: file.originalname,
        content: file.buffer.toString('base64'),
        encoding: 'base64',
      })),
    });
  }

  async activate(token: string): Promise<Company> {
    const company = await this.companyRepository.findOneBy({
      activationToken: token,
    });
    if (!company) {
      throw new NotFoundException('Token not exist');
    }

    company.activationToken = '';
    company.isActive = true;

    return this.companyRepository.save(company);
  }

  private async genClientId(): Promise<string> {
    const lastRecord = await this.companyRepository
      .createQueryBuilder('company')
      .where('company.createdAt <= :now', { now: new Date() })
      .orderBy('company.createdAt', 'DESC')
      .getOne();

    return (parseInt(lastRecord.clientId) + 1).toString();
  }
}
