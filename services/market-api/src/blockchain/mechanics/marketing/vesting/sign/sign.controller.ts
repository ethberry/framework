import { Body, Controller, Post } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { User } from "@ethberry/nest-js-utils";
import type { IServerSignature } from "@ethberry/types-blockchain";

import { UserEntity } from "../../../../../infrastructure/user/user.entity";
import { VestingBoxSignDto } from "./dto";
import { VestingSignService } from "./sign.service";

@ApiBearerAuth()
@Controller("/vesting")
export class VestingSignController {
  constructor(private readonly vestingSignService: VestingSignService) {}

  @Post("/sign")
  public sign(@Body() dto: VestingBoxSignDto, @User() userEntity: UserEntity): Promise<IServerSignature> {
    return this.vestingSignService.sign(dto, userEntity);
  }
}
