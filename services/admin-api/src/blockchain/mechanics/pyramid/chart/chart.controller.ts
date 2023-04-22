import { Controller, Get, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { PyramidChartService } from "./chart.service";
import { PyramidChartSearchDto } from "./dto";
import { UserEntity } from "../../../../infrastructure/user/user.entity";

@ApiBearerAuth()
@Controller("/pyramid")
export class PyramidChartController {
  constructor(private readonly pyramidReportService: PyramidChartService) {}

  @Get("/chart")
  @UseInterceptors(PaginationInterceptor)
  public amountChart(@Query() dto: PyramidChartSearchDto, @User() userEntity: UserEntity): Promise<any> {
    return this.pyramidReportService.chart(dto, userEntity);
  }
}
