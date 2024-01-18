import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";

import { AddressPipe, ApiAddress, ApiBigInt, BigIntPipe, Public } from "@gemunion/nest-js-utils";
import type { IOpenSeaTokenMetadata } from "@framework/types";

import { MetadataTokenService } from "./token.service";

@Public()
@Controller("/metadata")
export class MetadataTokenController {
  constructor(private readonly metadataTokenService: MetadataTokenService) {}

  @ApiBigInt("tokenId")
  @ApiAddress("address")
  @Get("/:chainId/:address/:tokenId")
  public getTokenMetadata(
    @Param("chainId", ParseIntPipe) chainId: number,
    @Param("address", AddressPipe) address: string,
    @Param("tokenId", BigIntPipe) tokenId: bigint,
  ): Promise<IOpenSeaTokenMetadata> {
    return this.metadataTokenService.getTokenMetadata(address, tokenId, chainId);
  }
}
