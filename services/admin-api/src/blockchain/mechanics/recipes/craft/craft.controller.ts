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

import { CraftService } from "./craft.service";
import { CraftEntity } from "./craft.entity";
import { CraftCreateDto, CraftSearchDto, CraftUpdateDto } from "./dto";
import { UserEntity } from "../../../../infrastructure/user/user.entity";

@ApiBearerAuth()
@Controller("/recipes/craft")
export class CraftController {
  constructor(private readonly craftService: CraftService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: CraftSearchDto, @User() userEntity: UserEntity): Promise<[Array<CraftEntity>, number]> {
    return this.craftService.search(dto, userEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<CraftEntity | null> {
    return this.craftService.findOneWithRelations({ id });
  }

  @Post("/")
  public create(@Body() dto: CraftCreateDto, @User() userEntity: UserEntity): Promise<CraftEntity> {
    return this.craftService.create(dto, userEntity);
  }

  @Put("/:id")
  public update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: CraftUpdateDto,
    @User() userEntity: UserEntity,
  ): Promise<CraftEntity> {
    return this.craftService.update({ id }, dto, userEntity);
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number, @User() userEntity: UserEntity): Promise<void> {
    await this.craftService.delete({ id }, userEntity);
  }
}
