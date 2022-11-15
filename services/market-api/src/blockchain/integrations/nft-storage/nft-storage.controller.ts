import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";

import { Public } from "@gemunion/nest-js-utils";

import { NftstorageService } from "./nft-storage.service";

@Public()
@Controller("/nftstorage")
export class NftStorageController {
  constructor(private readonly nftstorageService: NftstorageService) {}

  @Get("/pin/:tokenId")
  public async test(@Param("tokenId", ParseIntPipe) tokenId: number): Promise<{ url: string }> {
    const url = await this.nftstorageService.pinTokenById(tokenId);
    return { url };
  }
}
