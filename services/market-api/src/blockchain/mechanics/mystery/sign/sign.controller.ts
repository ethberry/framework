import { Body, Controller, Post } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import type { IServerSignature } from "@gemunion/types-blockchain";

import { SignMysteryboxDto } from "./dto";
import { MysterySignService } from "./sign.service";

@ApiBearerAuth()
@Controller("/mystery")
export class MysterySignController {
  constructor(private readonly mysterySignService: MysterySignService) {}

  @Post("/sign")
  public sign(@Body() dto: SignMysteryboxDto): Promise<IServerSignature> {
    return this.mysterySignService.sign(dto);
  }
}
