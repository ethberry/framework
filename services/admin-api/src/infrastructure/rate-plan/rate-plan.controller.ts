import { Controller, Get, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { PaginationInterceptor } from "@ethberry/nest-js-utils";
import { RatePlanService } from "./rate-plan.service";
import { RatePlanEntity } from "./rate-plan.entity";

@ApiBearerAuth()
@Controller("/rate-plans")
export class RatePlanController {
  constructor(private readonly ratePlanService: RatePlanService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(): Promise<[Array<RatePlanEntity>, number]> {
    return this.ratePlanService.findAll({});
  }
}
