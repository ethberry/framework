import { Controller, Get, Param } from "@nestjs/common";
import { BigNumber } from "ethers";

import { AddressPipe, ApiAddress, ApiBigNumber, BigNumberPipe, Public } from "@gemunion/nest-js-utils";

import { Erc998TokenService } from "./token.service";
import { IOpenSeaErc721Metadata } from "../../common/interfaces";

@Public()
@Controller("/erc998")
export class Erc998TokenController {
  constructor(private readonly erc998TokenService: Erc998TokenService) {}

  @ApiBigNumber("tokenId")
  @ApiAddress("address")
  @Get("/:address/:tokenId")
  public getTokenMetadata(
    @Param("address", AddressPipe) address: string,
    @Param("tokenId", BigNumberPipe) tokenId: BigNumber,
  ): Promise<IOpenSeaErc721Metadata> {
    return this.erc998TokenService.getTokenMetadata(address, tokenId);
  }
}
