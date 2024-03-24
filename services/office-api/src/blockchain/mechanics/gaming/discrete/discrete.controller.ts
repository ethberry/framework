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
import { DiscreteService } from "./discrete.service";
import { DiscreteEntity } from "./discrete.entity";
import { DiscreteCreateDto, DiscreteSearchDto, DiscreteUpdateDto } from "./dto";

@ApiBearerAuth()
@Controller("/grades")
export class DiscreteController {
  constructor(private readonly gradeService: DiscreteService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: DiscreteSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<DiscreteEntity>, number]> {
    return this.gradeService.search(dto, userEntity);
  }

  @Post("/")
  public create(@Body() dto: DiscreteCreateDto, @User() userEntity: UserEntity): Promise<DiscreteEntity> {
    return this.gradeService.create(dto, userEntity);
  }

  @Put("/:id")
  public update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: DiscreteUpdateDto,
    @User() userEntity: UserEntity,
  ): Promise<DiscreteEntity> {
    return this.gradeService.update({ id }, dto, userEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<DiscreteEntity | null> {
    return this.gradeService.findOneWithRelations({ id });
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number, @User() userEntity: UserEntity): Promise<void> {
    await this.gradeService.delete({ id }, userEntity);
  }
}
