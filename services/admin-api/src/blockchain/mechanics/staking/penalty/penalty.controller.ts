import { Controller, Get, Param, ParseIntPipe, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor } from "@gemunion/nest-js-utils";
import { StakingPenaltyService } from "./penalty.service";
import { StakingPenaltyEntity } from "./penalty.entity";

@ApiBearerAuth()
@Controller("/staking/penalty")
export class StakingPenaltyController {
  constructor(private readonly stakingPenaltyService: StakingPenaltyService) {}

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<StakingPenaltyEntity | null> {
    return this.stakingPenaltyService.findOne(
      { stakingId: id },
      {
        relations: {
          penalty: { components: { template: true, token: true, contract: true } },
          staking: { merchant: true },
        },
      },
    );
  }
}
