import { Body, Controller, Post } from "@nestjs/common";

import { Public, User } from "@ethberry/nest-js-utils";
import type { IServerSignature } from "@ethberry/types-blockchain";

import { BreedService } from "./breed.service";
import { BreedSignDto } from "./dto";
import { UserEntity } from "../../../../infrastructure/user/user.entity";

@Public()
@Controller("/breed")
export class BreedController {
  constructor(private readonly breedService: BreedService) {}

  @Post("/sign")
  public sign(@Body() dto: BreedSignDto, @User() userEntity: UserEntity): Promise<IServerSignature> {
    return this.breedService.sign(dto, userEntity);
  }
}
