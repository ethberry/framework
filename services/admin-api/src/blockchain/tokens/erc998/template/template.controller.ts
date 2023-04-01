import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  HttpStatus,
  HttpCode,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { Erc998TemplateService } from "./template.service";
import { TemplateEntity } from "../../../hierarchy/template/template.entity";
import { TemplateCreateDto, TemplateSearchDto, TemplateUpdateDto } from "../../../hierarchy/template/dto";
import { UserEntity } from "../../../../infrastructure/user/user.entity";

@ApiBearerAuth()
@Controller("/erc998-templates")
export class Erc998TemplateController {
  constructor(private readonly erc998TemplateService: Erc998TemplateService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: TemplateSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<TemplateEntity>, number]> {
    return this.erc998TemplateService.search(dto, userEntity);
  }

  @Put("/:id")
  public update(@Param("id", ParseIntPipe) id: number, @Body() dto: TemplateUpdateDto): Promise<TemplateEntity> {
    return this.erc998TemplateService.update({ id }, dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<TemplateEntity | null> {
    return this.erc998TemplateService.findOneWithRelations({ id });
  }

  @Post("/")
  public create(@Body() dto: TemplateCreateDto): Promise<TemplateEntity> {
    return this.erc998TemplateService.createTemplate(dto);
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return this.erc998TemplateService.delete({ id });
  }
}
