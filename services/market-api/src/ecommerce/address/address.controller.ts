import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { AddressCreateDto, AddressUpdateDto } from "./dto";
import { AddressService } from "./address.service";
import { AddressEntity } from "./address.entity";
import { UserEntity } from "../../infrastructure/user/user.entity";

@ApiBearerAuth()
@Controller("/address")
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@User() userEntity: UserEntity): Promise<[Array<AddressEntity>, number]> {
    return this.addressService.search(userEntity);
  }

  @Post("/")
  public create(@Body() dto: AddressCreateDto, @User() userEntity: UserEntity): Promise<AddressEntity> {
    return this.addressService.create(dto, userEntity);
  }

  @Put("/:id")
  public update(
    @Param("id") id: number,
    @Body() dto: AddressUpdateDto,
    @User() userEntity: UserEntity,
  ): Promise<AddressEntity | undefined> {
    return this.addressService.update({ id, userId: userEntity.id }, dto);
  }

  @Delete("/:id")
  @HttpCode(204)
  public async delete(@Param("id") id: number, @User() userEntity: UserEntity): Promise<AddressEntity | null> {
    return this.addressService.delete({ id, userId: userEntity.id });
  }
}
