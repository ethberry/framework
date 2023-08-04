import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { TemplateEntity } from "../../../hierarchy/template/template.entity";
import { TemplateCreateDto, TemplateSearchDto, TemplateUpdateDto } from "../../../hierarchy/template/dto";
import { Erc1155TemplateService } from "./template.service";

@ApiBearerAuth()
@Controller("/erc1155/templates")
export class Erc1155TemplateController {
  constructor(private readonly erc1155TemplateService: Erc1155TemplateService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: TemplateSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<TemplateEntity>, number]> {
    return this.erc1155TemplateService.search(dto, userEntity);
  }

  @Post("/")
  public create(@Body() dto: TemplateCreateDto, @User() userEntity: UserEntity): Promise<TemplateEntity> {
    return this.erc1155TemplateService.createTemplate(dto, userEntity);
  }

  @Put("/:id")
  public update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: TemplateUpdateDto,
    @User() userEntity: UserEntity,
  ): Promise<TemplateEntity> {
    return this.erc1155TemplateService.update({ id }, dto, userEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<TemplateEntity | null> {
    return this.erc1155TemplateService.findOneWithRelations({ id });
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.erc1155TemplateService.delete({ id });
  }
}
