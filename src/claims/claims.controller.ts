import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ClaimsService } from './claims.service';
import { SendClaimSchema } from './dto/send-claim';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RequestWithUser } from 'src/auth/interfaces/request-user';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

@ApiTags('Claims')
@Controller('claims')
export class ClaimsController {
  constructor(private readonly claimsService: ClaimsService) {}

  @Post()
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        subject: { type: 'string' },
        body: { type: 'string' },
        attachments: {
          type: 'array',
          items: {
            format: 'binary',
            type: 'string',
          },
        },
      },
    },
  })
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('attachments', 7))
  async sendClaim(
    @UploadedFiles() attachments: Array<Express.Multer.File>,
    @Body() body: any,
    @Req() { user }: RequestWithUser,
  ) {
    try {
      const data = SendClaimSchema.parse(body);
      await this.claimsService.sendClaim(data, attachments, user);
      return {
        status: 'OK',
        msg: 'The claim was sent successfully.',
      };
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
