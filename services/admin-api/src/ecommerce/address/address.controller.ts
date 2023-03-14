import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { PaginationInterceptor } from "@gemunion/nest-js-utils";

import { AddressCreateDto, AddressUpdateDto } from "./dto";
import { AddressService } from "./address.service";
import { AddressEntity } from "./address.entity";
import { AddressStatus } from "@framework/types";

@ApiBearerAuth()
@Controller("/address")
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: { userId: number }): Promise<[Array<AddressEntity>, number]> {
    return this.addressService.findAndCount(
      { userId: dto.userId, addressStatus: AddressStatus.ACTIVE },
      { relations: ["user"] },
    );
  }

  @Post("/")
  public create(@Body() body: AddressCreateDto): Promise<AddressEntity> {
    return this.addressService.create(body);
  }

  @Put("/:id")
  public update(@Param("id") id: number, @Body() dto: AddressUpdateDto): Promise<AddressEntity | undefined> {
    return this.addressService.update({ id }, dto);
  }

  @Delete("/:id")
  @HttpCode(204)
  public async delete(@Param("id") id: number): Promise<void> {
    await this.addressService.delete({ id });
  }
}
