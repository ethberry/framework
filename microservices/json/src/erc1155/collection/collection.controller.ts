import { Controller, Get, Param } from "@nestjs/common";

import { AddressPipe, ApiAddress } from "@gemunion/nest-js-utils";

import { Erc1155CollectionService } from "./collection.service";
import { IOpenSeaErc1155Metadata } from "../../common/interfaces";

@Controller("/erc1155")
export class Erc1155CollectionController {
  constructor(private readonly erc1155CollectionService: Erc1155CollectionService) {}

  @ApiAddress("address")
  @Get("/:address")
  public getCollectionMetadata(@Param("address", AddressPipe) address: string): Promise<IOpenSeaErc1155Metadata> {
    return this.erc1155CollectionService.getCollectionMetadata(address);
  }
}
