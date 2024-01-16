import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";

import { AddressPipe, ApiAddress, Public } from "@gemunion/nest-js-utils";
import type { IOpenSeaContractMetadata } from "@framework/types";

import { MetadataContractService } from "./contract.service";

@Public()
@Controller("/metadata")
export class MetadataContractController {
  constructor(private readonly metadataContractService: MetadataContractService) {}

  @ApiAddress("address")
  @Get("/:chainId/:address")
  public getContractMetadata(
    @Param("chainId", ParseIntPipe) chainId: number,
    @Param("address", AddressPipe) address: string,
  ): Promise<IOpenSeaContractMetadata> {
    return this.metadataContractService.getContractMetadata(address, chainId);
  }
}
