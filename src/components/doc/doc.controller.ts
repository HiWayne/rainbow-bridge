import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UsePipes,
  Req,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { DocService } from './doc.service';
import { VerifyPipe } from '~/pipe/common/verifyType.pipe';
import {
  DocDetailDto,
  DocCreateDto,
  DocUpdateDto,
  GetDocListDto,
  DeleteDocDto,
  GetPermissonsFromDocDto,
  AddPeopleToDocPermissionDto,
  VerifyPermissionsDto,
} from '~/components/doc/doc.dto';
import { LoginGuard } from '~/guard/login/login.guard';

@Controller('api')
@UsePipes(VerifyPipe)
export class DocController {
  constructor(private readonly docService: DocService) {}

  @Get('/doc/detail')
  @UseGuards(LoginGuard)
  async getDocDetail(@Query() query: DocDetailDto, @Request() request) {
    return await this.docService.getDocDetail(query.id, request);
  }

  @Post('/doc/create')
  @UseGuards(LoginGuard)
  async createDoc(@Body() body: DocCreateDto, @Request() request) {
    return await this.docService.createDoc(body, request);
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
    return await this.docService.deleteDoc(query);
  }

  @Get('/doc/permissions')
  async getPermissionsFromDoc(@Query() query: GetPermissonsFromDocDto) {
    return await this.docService.getPermissionsFromDoc(query);
  }

  @Post('/doc/set/permission')
  @UseGuards(LoginGuard)
  async addPeopleToDocPermission(
    @Body() body: AddPeopleToDocPermissionDto,
    @Request() request,
  ) {
    return await this.docService.addPeopleToDocPermission(body, request);
  }

  @Get('/doc/')
  async verifyPermissions(@Query() query: VerifyPermissionsDto) {
    const { user_id, doc_id, permission } = query;
    return await this.docService.verifyPermissions(
      Number(user_id),
      Number(doc_id),
      permission,
    );
  }
}
