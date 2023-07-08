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

import { Erc721TemplateService } from "./template.service";
import { TemplateEntity } from "../../../hierarchy/template/template.entity";
import { TemplateCreateDto, TemplateSearchDto, TemplateUpdateDto } from "../../../hierarchy/template/dto";
import { UserEntity } from "../../../../infrastructure/user/user.entity";

@ApiBearerAuth()
@Controller("/erc721/templates")
export class Erc721TemplateController {
  constructor(private readonly erc721TemplateService: Erc721TemplateService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: TemplateSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<TemplateEntity>, number]> {
    return this.erc721TemplateService.search(dto, userEntity);
  }

  @Put("/:id")
  public update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: TemplateUpdateDto,
    @User() userEntity: UserEntity,
  ): Promise<TemplateEntity> {
    return this.erc721TemplateService.update({ id }, dto, userEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<TemplateEntity | null> {
    return this.erc721TemplateService.findOneWithRelations({ id });
  }

  @Post("/")
  public create(@Body() dto: TemplateCreateDto, @User() userEntity: UserEntity): Promise<TemplateEntity> {
    return this.erc721TemplateService.createTemplate(dto, userEntity);
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number, @User() userEntity: UserEntity): Promise<void> {
    await this.erc721TemplateService.delete({ id }, userEntity);
  }
}
