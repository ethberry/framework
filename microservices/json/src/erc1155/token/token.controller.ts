import { Controller, Get, Param } from "@nestjs/common";
import { BigNumber } from "ethers";

import { AddressPipe, ApiAddress, ApiBigNumber, BigNumberPipe, Public } from "@gemunion/nest-js-utils";

import { Erc1155TokenService } from "./token.service";
import { IOpenSeaErc1155Metadata } from "../../common/interfaces";

@Public()
@Controller("/erc1155")
export class Erc1155TokenController {
  constructor(private readonly tokenService: Erc1155TokenService) {}

  @ApiBigNumber("tokenId")
  @ApiAddress("address")
  @Get("/:address/:tokenId")
  public getTokenMetadata(
    @Param("address", AddressPipe) address: string,
    @Param("tokenId", BigNumberPipe) tokenId: BigNumber,
  ): Promise<IOpenSeaErc1155Metadata> {
    return this.tokenService.getTokenMetadata(address, tokenId);
  }
}
