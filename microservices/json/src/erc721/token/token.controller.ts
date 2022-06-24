import { Controller, Get, Param } from "@nestjs/common";
import { BigNumber } from "ethers";

import { AddressPipe, ApiAddress, ApiBigNumber, BigNumberPipe, Public } from "@gemunion/nest-js-utils";

import { Erc721TokenService } from "./token.service";
import { IOpenSeaMetadata } from "../../common/interfaces";

@Public()
@Controller("/erc721")
export class Erc721TokenController {
  constructor(private readonly erc721TokenService: Erc721TokenService) {}

  @ApiBigNumber("tokenId")
  @ApiAddress("address")
  @Get("/:address/:tokenId")
  public getTokenMetadata(
    @Param("address", AddressPipe) address: string,
    @Param("tokenId", BigNumberPipe) tokenId: BigNumber,
  ): Promise<IOpenSeaMetadata> {
    return this.erc721TokenService.getTokenMetadata(address, tokenId);
  }
}
