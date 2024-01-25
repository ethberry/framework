import { Controller, Get, Param } from "@nestjs/common";

import { AddressPipe, ApiAddress, ApiBigInt, BigIntPipe, Public } from "@gemunion/nest-js-utils";
import type { IOpenSeaTokenMetadata } from "@framework/types";

import { MetadataTokenService } from "./token.service";
// TODO import from nest-js-utils after publish
import { ApiChainId, ChainIdPipe } from "../../../utils";

@Public()
@Controller("/metadata")
export class MetadataTokenController {
  constructor(private readonly metadataTokenService: MetadataTokenService) {}

  @ApiChainId("chainId")
  @ApiAddress("address")
  @ApiBigInt("tokenId")
  @Get("/:chainId/:address/:tokenId")
  public getTokenMetadata(
    @Param("chainId", ChainIdPipe) chainId: number,
    @Param("address", AddressPipe) address: string,
    @Param("tokenId", BigIntPipe) tokenId: bigint,
  ): Promise<IOpenSeaTokenMetadata> {
    return this.metadataTokenService.getTokenMetadata(address, tokenId, chainId);
  }
}
