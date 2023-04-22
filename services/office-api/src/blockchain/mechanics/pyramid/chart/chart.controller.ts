import { Controller, Get, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { PaginationInterceptor } from "@gemunion/nest-js-utils";

import { PyramidChartService } from "./chart.service";
import { PyramidChartSearchDto } from "./dto";

@ApiBearerAuth()
@Controller("/pyramid")
export class PyramidChartController {
  constructor(private readonly pyramidReportService: PyramidChartService) {}

  @Get("/chart")
  @UseInterceptors(PaginationInterceptor)
  public chart(@Query() dto: PyramidChartSearchDto): Promise<any> {
    return this.pyramidReportService.chart(dto);
  }
}
