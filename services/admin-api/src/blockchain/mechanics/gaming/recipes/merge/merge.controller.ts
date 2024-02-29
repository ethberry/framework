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

import { MergeService } from "./merge.service";
import { MergeEntity } from "./merge.entity";
import { MergeCreateDto, MergeSearchDto, MergeUpdateDto } from "./dto";
import { UserEntity } from "../../../../../infrastructure/user/user.entity";

@ApiBearerAuth()
@Controller("/recipes/merge")
export class MergeController {
  constructor(private readonly mergeService: MergeService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: MergeSearchDto, @User() userEntity: UserEntity): Promise<[Array<MergeEntity>, number]> {
    return this.mergeService.search(dto, userEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<MergeEntity | null> {
    return this.mergeService.findOneWithRelations({ id });
  }

  @Post("/")
  public create(@Body() dto: MergeCreateDto, @User() userEntity: UserEntity): Promise<MergeEntity> {
    return this.mergeService.create(dto, userEntity);
  }

  @Put("/:id")
  public update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: MergeUpdateDto,
    @User() userEntity: UserEntity,
  ): Promise<MergeEntity> {
    return this.mergeService.update({ id }, dto, userEntity);
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number, @User() userEntity: UserEntity): Promise<void> {
    await this.mergeService.delete({ id }, userEntity);
  }
}
