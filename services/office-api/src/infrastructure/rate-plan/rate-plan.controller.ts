import { Body, Controller, Get, HttpCode, HttpStatus, Put, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { PaginationInterceptor } from "@gemunion/nest-js-utils";
import { RatePlanService } from "./rate-plan.service";
import { RatePlanEntity } from "./rate-plan.entity";
import { RatePlanUpdateDto } from "./dto";

@ApiBearerAuth()
@Controller("/rate-plans")
export class RatePlanController {
  constructor(private readonly ratePlanService: RatePlanService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(): Promise<[Array<RatePlanEntity>, number]> {
    return this.ratePlanService.findAll({});
  }

  @Put("/")
  @HttpCode(HttpStatus.NO_CONTENT)
  public setProfile(@Body() dto: RatePlanUpdateDto): Promise<void> {
    return this.ratePlanService.update(dto);
  }
}
