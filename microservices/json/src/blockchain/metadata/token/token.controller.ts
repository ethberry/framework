import { Controller, Get, Param } from "@nestjs/common";
import { BigNumber } from "ethers";

import { AddressPipe, ApiAddress, ApiBigNumber, BigNumberPipe, Public } from "@gemunion/nest-js-utils";

import { MetadataTokenService } from "./token.service";
import { IOpenSeaMetadata } from "../../../common/interfaces";

@Public()
@Controller("/metadata")
export class MetadataTokenController {
  constructor(private readonly metadataTokenService: MetadataTokenService) {}

  @ApiBigNumber("tokenId")
  @ApiAddress("address")
  @Get("/:address/:tokenId")
  public getTokenMetadata(
    @Param("address", AddressPipe) address: string,
    @Param("tokenId", BigNumberPipe) tokenId: BigNumber,
  ): Promise<IOpenSeaMetadata> {
    return this.metadataTokenService.getTokenMetadata(address, tokenId);
  }
}
