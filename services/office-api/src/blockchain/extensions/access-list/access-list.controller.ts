import { Controller, Get, Param } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { AddressPipe, ApiAddress } from "@gemunion/nest-js-utils";

import { AccessListService } from "./access-list.service";
import { AccessListEntity } from "./access-list.entity";

@ApiBearerAuth()
@Controller("/access-list")
export class AccessListController {
  constructor(private readonly accessListService: AccessListService) {}

  @ApiAddress("address")
  @Get("/:address")
  public findOne(@Param("address", AddressPipe) address: string): Promise<Array<AccessListEntity>> {
    return this.accessListService.findAll({ address });
  }
}
