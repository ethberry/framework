import { Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { UserEntity } from "../user/user.entity";
import { MerchantService } from "./merchant.service";

@ApiBearerAuth()
@Controller("/merchant")
export class MerchantManagerController {
  constructor(private readonly merchantService: MerchantService) {}

  @Get("/managers")
  @UseInterceptors(PaginationInterceptor)
  public search(@User() userEntity: UserEntity): Promise<[Array<UserEntity>, number]> {
    return this.merchantService.searchUsers(userEntity);
  }

  @Delete("/managers/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async removeUser(@Param("id", ParseIntPipe) id: number, @User() userEntity: UserEntity): Promise<void> {
    await this.merchantService.removeUser({ id }, userEntity);
  }
}
