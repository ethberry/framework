import { Controller, Get, Param } from "@nestjs/common";

import { AddressPipe, ApiAddress, Public } from "@gemunion/nest-js-utils";

import { MetadataContractService } from "./contract.service";
import { IOpenSeaMetadata } from "../../../common/interfaces";

@Public()
@Controller("/metadata")
export class MetadataContractController {
  constructor(private readonly metadataContractService: MetadataContractService) {}

  @ApiAddress("address")
  @Get("/:address")
  public getContractMetadata(@Param("address", AddressPipe) address: string): Promise<IOpenSeaMetadata> {
    return this.metadataContractService.getContractMetadata(address);
  }
}
