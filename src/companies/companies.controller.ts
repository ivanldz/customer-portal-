import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompany } from './dto/create-company.dto';
import { Company } from './entities/company.entity';
import { Pagination } from 'src/global/interface/pagniation';
import { FilesInterceptor } from '@nestjs/platform-express';
import { RegistrationFormSchema } from './dto/registration-form.dto';
import { ApiTags } from '@nestjs/swagger';
import { ZodValidationPipe } from 'nestjs-zod';

@ApiTags('Companies')
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @UsePipes(ZodValidationPipe)
  create(@Body() createCompanyDto: CreateCompany): Promise<Company> {
    return this.companiesService.create(createCompanyDto);
  }

  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ): Promise<Pagination<Company>> {
    return this.companiesService.findAll(page, pageSize);
  }

  @Get('activate')
  activate(@Query('token') token: string): Promise<Company> {
    return this.companiesService.activate(token);
  }

  @Get(':clientId')
  findById(@Param('clientId') id: string): Promise<Company> {
    return this.companiesService.findById(id);
  }

  @Delete(':clientId')
  remove(@Param('clientId') id: string): Promise<Company> {
    return this.companiesService.remove(id);
  }

  @UseInterceptors(FilesInterceptor('attachments', 7))
  @Post('registration-form')
  async registerCompany(
    @UploadedFiles() attachments: Array<Express.Multer.File>,
    @Body() body: any,
  ) {
    try {
      const data = RegistrationFormSchema.parse(body);
      await this.companiesService.registerCompany(data, attachments);
      return {
        status: 'OK',
        msg: 'The registration form was sent successfully.',
      };
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
