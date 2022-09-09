import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";

import { Public } from "@gemunion/nest-js-utils";

import { InfuraService } from "./infura.service";

@Public()
@Controller("/infura")
export class InfuraController {
  constructor(private readonly infuraService: InfuraService) {}

  @Get("/pin/:tokenId")
  public async test(@Param("tokenId", ParseIntPipe) tokenId: number): Promise<{ url: string }> {
    const url = await this.infuraService.pinTokenById(tokenId);
    return { url };
  }
}
