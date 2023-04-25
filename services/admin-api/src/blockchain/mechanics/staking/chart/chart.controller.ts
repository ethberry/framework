import { Controller, Get, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { StakingChartService } from "./chart.service";
import { StakingChartSearchDto } from "./dto";
import { UserEntity } from "../../../../infrastructure/user/user.entity";

@ApiBearerAuth()
@Controller("/staking")
export class StakingChartController {
  constructor(private readonly stakingReportService: StakingChartService) {}

  @Get("/chart")
  @UseInterceptors(PaginationInterceptor)
  public chart(@Query() dto: StakingChartSearchDto, @User() userEntity: UserEntity): Promise<any> {
    return this.stakingReportService.chart(dto, userEntity);
  }
}
