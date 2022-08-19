import { Body, Controller, Post } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { IServerSignature } from "@gemunion/types-collection";

import { SignMysteryboxDto } from "./dto";
import { MysteryboxSignService } from "./sign.service";

@ApiBearerAuth()
@Controller("/mysteryboxes")
export class MysteryboxSignController {
  constructor(private readonly mysteryboxSignService: MysteryboxSignService) {}

  @Post("/sign")
  public sign(@Body() dto: SignMysteryboxDto): Promise<IServerSignature> {
    return this.mysteryboxSignService.sign(dto);
  }
}
