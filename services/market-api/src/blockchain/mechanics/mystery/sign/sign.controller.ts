import { Body, Controller, Post } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import type { IServerSignature } from "@gemunion/types-collection";

import { SignMysteryboxDto } from "./dto";
import { MysterySignService } from "./sign.service";

@ApiBearerAuth()
@Controller("/mysteryboxes")
export class MysterySignController {
  constructor(private readonly mysteryboxSignService: MysterySignService) {}

  @Post("/sign")
  public sign(@Body() dto: SignMysteryboxDto): Promise<IServerSignature> {
    return this.mysteryboxSignService.sign(dto);
  }
}
