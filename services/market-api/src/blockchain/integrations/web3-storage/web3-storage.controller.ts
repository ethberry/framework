import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";

import { Public } from "@gemunion/nest-js-utils";

import { Web3StorageService } from "./web3-storage.service";

@Public()
@Controller("/web3storage")
export class Web3StorageController {
  constructor(private readonly web3storageService: Web3StorageService) {}

  @Get("/pin/:tokenId")
  public async test(@Param("tokenId", ParseIntPipe) tokenId: number): Promise<{ url: string }> {
    const url = await this.web3storageService.pinTokenById(tokenId);
    return { url };
  }
}
