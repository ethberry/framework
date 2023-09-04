import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { AddressPipe, ApiAddress } from "@gemunion/nest-js-utils";

import { AccessControlService } from "./access-control.service";
import { AccessControlEntity } from "./access-control.entity";
import { AccessControlCheckDto } from "./dto";

@ApiBearerAuth()
@Controller("/access-control")
export class AccessControlController {
  constructor(private readonly accessControlService: AccessControlService) {}

  @Get("/check")
  public check(@Query() dto: AccessControlCheckDto): Promise<{ hasRole: boolean }> {
    return this.accessControlService.check(dto);
  }

  @ApiAddress("address")
  @Get("/:address")
  public findAll(@Param("address", AddressPipe) address: string): Promise<Array<AccessControlEntity>> {
    return this.accessControlService.findAllWithRelations({ address });
  }
}
