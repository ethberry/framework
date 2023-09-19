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

import { DismantleService } from "./dismantle.service";
import { DismantleEntity } from "./dismantle.entity";
import { DismantleCreateDto, DismantleSearchDto, DismantleUpdateDto } from "./dto";
import { UserEntity } from "../../../../infrastructure/user/user.entity";

@ApiBearerAuth()
@Controller("/dismantle")
export class DismantleController {
  constructor(private readonly dismantleService: DismantleService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: DismantleSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<DismantleEntity>, number]> {
    return this.dismantleService.search(dto, userEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<DismantleEntity | null> {
    return this.dismantleService.findOneWithRelations({ id });
  }

  @Post("/")
  public create(@Body() dto: DismantleCreateDto, @User() userEntity: UserEntity): Promise<DismantleEntity> {
    return this.dismantleService.create(dto, userEntity);
  }

  @Put("/:id")
  public update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: DismantleUpdateDto,
    @User() userEntity: UserEntity,
  ): Promise<DismantleEntity> {
    return this.dismantleService.update({ id }, dto, userEntity);
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number, @User() userEntity: UserEntity): Promise<void> {
    await this.dismantleService.delete({ id }, userEntity);
  }
}
