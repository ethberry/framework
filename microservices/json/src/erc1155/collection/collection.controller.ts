import { Controller, Get, Param } from "@nestjs/common";

import { AddressPipe, ApiAddress, Public } from "@gemunion/nest-js-utils";

import { Erc1155CollectionService } from "./collection.service";
import { IOpenSeaMetadata } from "../../common/interfaces";

@Public()
@Controller("/erc1155")
export class Erc1155CollectionController {
  constructor(private readonly erc1155CollectionService: Erc1155CollectionService) {}

  @ApiAddress("address")
  @Get("/:address")
  public getCollectionMetadata(@Param("address", AddressPipe) address: string): Promise<IOpenSeaMetadata> {
    return this.erc1155CollectionService.getCollectionMetadata(address);
  }
}
