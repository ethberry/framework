import { Controller, Get, Param } from "@nestjs/common";

import { AddressPipe, ApiAddress, Public } from "@gemunion/nest-js-utils";

import { Erc721CollectionService } from "./collection.service";
import { IOpenSeaMetadata } from "../../common/interfaces";

@Public()
@Controller("/erc721")
export class Erc721CollectionController {
  constructor(private readonly erc721CollectionService: Erc721CollectionService) {}

  @ApiAddress("address")
  @Get("/:address")
  public getCollectionMetadata(@Param("address", AddressPipe) address: string): Promise<IOpenSeaMetadata> {
    return this.erc721CollectionService.getCollectionMetadata(address);
  }
}
