import { Controller, Get, Query } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { AccessControlService } from "./access-control.service";
import { AccessControlCheckDto, AccessControlCheckTokenOwnershipDto } from "./dto";

@ApiBearerAuth()
@Controller("/access-control")
export class AccessControlController {
  constructor(private readonly accessControlService: AccessControlService) {}

  @Get("/check")
  public check(@Query() dto: AccessControlCheckDto): Promise<{ hasRole: boolean }> {
    return this.accessControlService.check(dto);
  }

  @Get("/check/token-ownership")
  public checkTokenOwnership(@Query() dto: AccessControlCheckTokenOwnershipDto): Promise<{ hasOwnership: boolean }> {
    return this.accessControlService.checkTokenOwnership(dto);
  }
}
