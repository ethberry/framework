import { Controller, Get, Param, ParseIntPipe, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor } from "@ethberry/nest-js-utils";

import { ReferralProgramService } from "./referral.program.service";
import { ReferralProgramEntity } from "./referral.program.entity";

@ApiBearerAuth()
@Controller("/referral/program")
export class ReferralProgramController {
  constructor(private readonly referralProgramService: ReferralProgramService) {}

  @Get("/:merchantId")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("merchantId", ParseIntPipe) merchantId: number): Promise<Array<ReferralProgramEntity>> {
    return this.referralProgramService.findAll({ merchantId }, { order: { level: "ASC" } });
  }
}
