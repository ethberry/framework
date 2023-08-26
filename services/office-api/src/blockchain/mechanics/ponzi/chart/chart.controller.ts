import { Controller, Get, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { PonziChartService } from "./chart.service";
import { PonziChartSearchDto } from "./dto";

@ApiBearerAuth()
@Controller("/ponzi")
export class PonziChartController {
  constructor(private readonly ponziChartService: PonziChartService) {}

  @Get("/chart")
  @UseInterceptors(PaginationInterceptor)
  public amountChart(@Query() dto: PonziChartSearchDto, @User() userEntity: UserEntity): Promise<any> {
    return this.ponziChartService.chart(dto, userEntity);
  }
}
