import { Body, Controller, Get, Param, ParseIntPipe, Put, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";
import { PaginationDto } from "@gemunion/collection";

import { RentService } from "./rent.service";
import { RentEntity } from "./rent.entity";
import { RentUpdateDto } from "./dto";

@ApiBearerAuth()
@Controller("/rents")
export class RentController {
  constructor(private readonly rentService: RentService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: PaginationDto): Promise<[Array<RentEntity>, number]> {
    return this.rentService.search(dto);
  }

  @Put("/:id")
  public update(@Param("id", ParseIntPipe) id: number, @Body() dto: RentUpdateDto): Promise<RentEntity> {
    return this.rentService.update({ id }, dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<RentEntity | null> {
    return this.rentService.findOneWithRelations({ id });
  }
}
