import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { AddressStatus } from "@framework/types";
import { PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { AddressEntity } from "../../ecommerce/address/address.entity";
import { AddressService } from "../../ecommerce/address/address.service";
import { AddressCreateDto, AddressUpdateDto } from "../../ecommerce/address/dto";
import { UserEntity } from "../user/user.entity";

@ApiBearerAuth()
@Controller("/profile/address")
export class ProfileAddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public searchAddresses(@User() userEntity: UserEntity): Promise<[AddressEntity[], number]> {
    return this.addressService.findAndCount(
      { userId: userEntity.id, addressStatus: AddressStatus.ACTIVE },
      { order: { id: "DESC" }, relations: ["user"] },
    );
  }

  @Post("/")
  public createAddress(
    @User() userEntity: UserEntity,
    @Body() dto: Omit<AddressCreateDto, "userId">,
  ): Promise<AddressEntity> {
    return this.addressService.create({ ...dto, userId: userEntity.id });
  }

  @Put("/:id")
  public updateAddress(
    @Param("id", ParseIntPipe) id: number,
    @User() userEntity: UserEntity,
    @Body() dto: Omit<AddressUpdateDto, "userId">,
  ): Promise<AddressEntity | undefined> {
    return this.addressService.update({ id }, { ...dto, userId: userEntity.id });
  }

  @Delete("/:id")
  @HttpCode(204)
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.addressService.delete({ id });
  }
}
