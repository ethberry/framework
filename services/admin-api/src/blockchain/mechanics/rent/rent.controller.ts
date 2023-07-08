import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { RentService } from "./rent.service";
import { RentEntity } from "./rent.entity";
import { RentCreateDto, RentSearchDto, RentUpdateDto } from "./dto";
import { UserEntity } from "../../../infrastructure/user/user.entity";

@ApiBearerAuth()
@Controller("/rents")
export class RentController {
  constructor(private readonly rentService: RentService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: RentSearchDto): Promise<[Array<RentEntity>, number]> {
    return this.rentService.search(dto);
  }

  @Post("/")
  public create(@Body() dto: RentCreateDto, @User() userEntity: UserEntity): Promise<RentEntity> {
    return this.rentService.create(dto, userEntity);
  }

  @Put("/:id")
  public update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: RentUpdateDto,
    @User() userEntity: UserEntity,
  ): Promise<RentEntity> {
    return this.rentService.update({ id }, dto, userEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<RentEntity | null> {
    return this.rentService.findOneWithRelations({ id });
  }
}
