import { Body, Controller, Post } from "@nestjs/common";

import { Public, User } from "@gemunion/nest-js-utils";
import type { IServerSignature } from "@gemunion/types-blockchain";

import { BreedService } from "./breed.service";
import { SignBreedDto } from "./dto";
import { UserEntity } from "../../../user/user.entity";

@Public()
@Controller("/breed")
export class BreedController {
  constructor(private readonly breedService: BreedService) {}

  @Post("/sign")
  public sign(@Body() dto: SignBreedDto, @User() userEntity: UserEntity): Promise<IServerSignature> {
    return this.breedService.sign(dto, userEntity);
  }
}
