import { Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { User } from "@gemunion/nest-js-utils";

import { UserEntity } from "../user/user.entity";
import { MerchantService } from "./merchant.service";

@ApiBearerAuth()
@Controller("/merchants")
export class MerchantUserController {
  constructor(private readonly merchantService: MerchantService) {}

  @Get("/users")
  public search(@User() userEntity: UserEntity): Promise<Array<UserEntity>> {
    return this.merchantService.searchUsers(userEntity);
  }

  @Delete("/users/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async removeUser(@Param("id", ParseIntPipe) id: number, @User() userEntity: UserEntity): Promise<void> {
    await this.merchantService.removeUser({ id }, userEntity);
  }
}
