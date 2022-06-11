import { Controller, Get, Param } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { AddressPipe, ApiAddress } from "@gemunion/nest-js-utils";

import { AccessControlService } from "./access-control.service";
import { AccessControlEntity } from "./access-control.entity";

@ApiBearerAuth()
@Controller("/access-control")
export class AccessControlController {
  constructor(private readonly accessControlService: AccessControlService) {}

  @ApiAddress("address")
  @Get("/:address")
  public findOne(@Param("address", AddressPipe) address: string): Promise<Array<AccessControlEntity>> {
    return this.accessControlService.findAll({ address });
  }
}
