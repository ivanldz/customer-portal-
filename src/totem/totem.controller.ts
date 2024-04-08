import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { TotemService } from './totem.service';
import { NewBudget } from './dto/new-budget.dto';
import { NewContact } from './dto/new-contact';
import { MessageResponse } from 'src/global/interface/message-response';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { ZodValidationPipe } from 'nestjs-zod';

@ApiTags('Totem')
@Controller('totem')
export class TotemController {
  constructor(private readonly totemService: TotemService) {}

  @Post('budget')
  @UsePipes(ZodValidationPipe)
  async sendBudgetEmail(
    @Body() newBudget: NewBudget,
  ): Promise<MessageResponse> {
    await this.totemService.sendBudgetEmail(newBudget);
    return { message: 'Budget email sent' };
  }

  @Post('contact')
  @ApiProperty()
  @UsePipes(ZodValidationPipe)
  async sendContactEmail(
    @Body() newConstact: NewContact,
  ): Promise<MessageResponse> {
    this.totemService.sendContactEmail(newConstact);
    return { message: 'contact email sent' };
  }
}
