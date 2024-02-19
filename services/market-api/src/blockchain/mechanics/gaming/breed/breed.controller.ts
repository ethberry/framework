import { Body, Controller, Post } from "@nestjs/common";

import { Public } from "@gemunion/nest-js-utils";
import type { IServerSignature } from "@gemunion/types-blockchain";

import { BreedService } from "./breed.service";
import { SignBreedDto } from "./dto";

@Public()
@Controller("/breed")
export class BreedController {
  constructor(private readonly breedService: BreedService) {}

  @Post("/sign")
  public sign(@Body() dto: SignBreedDto): Promise<IServerSignature> {
    return this.breedService.sign(dto);
  }
}
