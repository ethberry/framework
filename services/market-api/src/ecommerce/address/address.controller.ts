import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { AddressStatus } from "@framework/types";
import { PaginationInterceptor } from "@gemunion/nest-js-utils";

import { AddressService } from "./address.service";
import { AddressEntity } from "./address.entity";
import { AddressCreateDto, AddressUpdateDto } from "./dto";
import { IAddressAutocompleteDto } from "./interfaces";

@ApiBearerAuth()
@Controller("/address")
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: IAddressAutocompleteDto): Promise<[Array<AddressEntity>, number]> {
    return this.addressService.findAndCount(
      { userId: dto.userId, addressStatus: AddressStatus.ACTIVE },
      { order: { id: "DESC" }, relations: ["user"] },
    );
  }

  @Get("/autocomplete")
  public autocomplete(@Query() dto: IAddressAutocompleteDto): Promise<Array<AddressEntity>> {
    return this.addressService.autocomplete(dto);
  }

  @Post("/")
  public create(@Body() dto: AddressCreateDto): Promise<AddressEntity> {
    return this.addressService.create(dto);
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
