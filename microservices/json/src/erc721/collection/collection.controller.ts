import { Controller, Get, Param } from "@nestjs/common";

import { AddressPipe, ApiAddress } from "@gemunion/nest-js-utils";

import { Erc721CollectionService } from "./collection.service";
import { IOpenSeaErc721Metadata } from "../../common/interfaces";

@Controller("/erc721")
export class Erc721CollectionController {
  constructor(private readonly erc721CollectionService: Erc721CollectionService) {}

  @ApiAddress("address")
  @Get("/:address")
  public getCollectionMetadata(@Param("address", AddressPipe) address: string): Promise<IOpenSeaErc721Metadata> {
    return this.erc721CollectionService.getCollectionMetadata(address);
  }
}
