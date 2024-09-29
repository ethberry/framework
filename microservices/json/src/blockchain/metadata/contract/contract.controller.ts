import { Controller, Get, Param } from "@nestjs/common";

import { AddressPipe, ApiAddress, ApiChainId, ChainIdPipe, Public } from "@ethberry/nest-js-utils";
import type { IOpenSeaContractMetadata } from "@framework/types";

import { MetadataContractService } from "./contract.service";

@Public()
@Controller("/metadata")
export class MetadataContractController {
  constructor(private readonly metadataContractService: MetadataContractService) {}

  @ApiChainId("chainId")
  @ApiAddress("address")
  @Get("/:chainId/:address")
  public getContractMetadata(
    @Param("chainId", ChainIdPipe) chainId: number,
    @Param("address", AddressPipe) address: string,
  ): Promise<IOpenSeaContractMetadata> {
    return this.metadataContractService.getContractMetadata(address, chainId);
  }
}
