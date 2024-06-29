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
@Controller("/discrete")
export class DiscreteController {
  constructor(private readonly discreteService: DiscreteService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: DiscreteSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<DiscreteEntity>, number]> {
    return this.discreteService.search(dto, userEntity);
  }

  @Post("/")
  public create(@Body() dto: DiscreteCreateDto, @User() userEntity: UserEntity): Promise<DiscreteEntity> {
    return this.discreteService.create(dto, userEntity);
  }

  @Put("/:id")
  public update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: DiscreteUpdateDto,
    @User() userEntity: UserEntity,
  ): Promise<DiscreteEntity> {
    return this.discreteService.update({ id }, dto, userEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<DiscreteEntity | null> {
    return this.discreteService.findOneWithRelations({ id });
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number, @User() userEntity: UserEntity): Promise<void> {
    await this.discreteService.delete({ id }, userEntity);
  }
}
