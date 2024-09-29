import { Body, Controller, Post } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { User } from "@ethberry/nest-js-utils";
import type { IServerSignature } from "@ethberry/types-blockchain";

import { UserEntity } from "../../../../../infrastructure/user/user.entity";
import { RaffleSignService } from "./sign.service";
import { RaffleSignDto } from "./dto";

@ApiBearerAuth()
@Controller("/raffle/ticket")
export class RaffleSignController {
  constructor(private readonly raffleSignService: RaffleSignService) {}

  @Post("/sign")
  public sign(@Body() dto: RaffleSignDto, @User() userEntity: UserEntity): Promise<IServerSignature> {
    return this.raffleSignService.sign(dto, userEntity);
  }
}
