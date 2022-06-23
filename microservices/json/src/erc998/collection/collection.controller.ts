import { Controller, Get, Param } from "@nestjs/common";

import { AddressPipe, ApiAddress, Public } from "@gemunion/nest-js-utils";

import { Erc998CollectionService } from "./collection.service";
import { IOpenSeaErc721Metadata } from "../../common/interfaces";

@Public()
@Controller("/erc998")
export class Erc998CollectionController {
  constructor(private readonly erc998CollectionService: Erc998CollectionService) {}

  @ApiAddress("address")
  @Get("/:address")
  public getCollectionMetadata(@Param("address", AddressPipe) address: string): Promise<IOpenSeaErc721Metadata> {
    return this.erc998CollectionService.getCollectionMetadata(address);
  }
}
