import { Controller, Get, Param } from "@nestjs/common";

import { AddressPipe, ApiAddress, ApiBigInt, BigIntPipe, Public } from "@gemunion/nest-js-utils";

import { MetadataTokenService } from "./token.service";
import { IOpenSeaMetadata } from "../../../common/interfaces";

@Public()
@Controller("/metadata")
export class MetadataTokenController {
  constructor(private readonly metadataTokenService: MetadataTokenService) {}

  @ApiBigInt("tokenId")
  @ApiAddress("address")
  @Get("/:address/:tokenId")
  public getTokenMetadata(
    @Param("address", AddressPipe) address: string,
    @Param("tokenId", BigIntPipe) tokenId: bigint,
  ): Promise<IOpenSeaMetadata> {
    return this.metadataTokenService.getTokenMetadata(address, tokenId);
  }
}
