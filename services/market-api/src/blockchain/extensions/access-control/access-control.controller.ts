import { Body, Controller, Get } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { AccessControlService } from "./access-control.service";
import { AccessControlCheck } from "./dto";

@ApiBearerAuth()
@Controller("/access-control")
export class AccessControlController {
  constructor(private readonly accessControlService: AccessControlService) {}

  @Get("/check")
  public check(@Body() dto: AccessControlCheck): Promise<{ hasRole: boolean }> {
    return this.accessControlService.check(dto);
  }
}
