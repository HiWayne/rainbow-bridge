import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UsePipes,
  Req,
  Delete,
} from '@nestjs/common';
import { DocService } from './doc.service';
import { VerifyPipe } from '~/pipe/common/user.pipe';
import {
  DocDetailDto,
  DocCreateDto,
  DocUpdateDto,
  GetDocListDto,
  DeleteDocDto,
} from '~/dto/doc/doc.dto';

@Controller('api')
@UsePipes(VerifyPipe)
export class DocController {
  constructor(private readonly docService: DocService) {}

  @Get('/doc/detail')
  async getDocDetail(@Req() req, @Query() query: DocDetailDto) {
    const { token } = req.headers;
    return await this.docService.getDocDetail(token, query.id);
  }

  @Post('/doc/create')
  async createDoc(@Req() req, @Body() body: DocCreateDto) {
    const { token } = req.headers;
    return await this.docService.createDoc(token, body);
  }

  @Post('/doc/update')
  async update(@Req() req, @Body() body: DocUpdateDto) {
    const { token } = req.headers;
    return await this.docService.updateDoc(token, body);
  }

  @Get('/doc/list')
  async getDocList(@Query() query: GetDocListDto) {
    return await this.docService.getDocList(query);
  }

  @Delete('/doc/delete')
  async deleteDoc(@Query() query: DeleteDocDto) {
    return await this.docService.deleteDoc(query)
  }
}
