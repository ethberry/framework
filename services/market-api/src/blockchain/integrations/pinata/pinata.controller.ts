import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";

import { Public } from "@gemunion/nest-js-utils";

import { PinataService } from "./pinata.service";

@Public()
@Controller("/pinata")
export class PinataController {
  constructor(private readonly pinataService: PinataService) {}

  @Get("/pin/:tokenId")
  public async test(@Param("tokenId", ParseIntPipe) tokenId: number): Promise<{ url: string }> {
    const url = await this.pinataService.pinTokenById(tokenId);
    return { url };
  }
}
