import { Controller, Get, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { StakingChartService } from "./chart.service";
import { StakingChartSearchDto } from "./dto";
import { UserEntity } from "../../../../infrastructure/user/user.entity";

@ApiBearerAuth()
@Controller("/staking/chart")
export class StakingChartController {
  constructor(private readonly stakingReportService: StakingChartService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public amountChart(@Query() dto: StakingChartSearchDto, @User() userEntity: UserEntity): Promise<any> {
    return this.stakingReportService.chart(dto, userEntity);
  }
}
