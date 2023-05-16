import { Controller, Get, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { PyramidChartService } from "./chart.service";
import { PyramidChartSearchDto } from "./dto";

@ApiBearerAuth()
@Controller("/pyramid")
export class PyramidChartController {
  constructor(private readonly pyramidChartService: PyramidChartService) {}

  @Get("/chart")
  @UseInterceptors(PaginationInterceptor)
  public amountChart(@Query() dto: PyramidChartSearchDto, @User() userEntity: UserEntity): Promise<any> {
    return this.pyramidChartService.chart(dto, userEntity);
  }
}
