import { Injectable, NotFoundException } from "@nestjs/common";
import type { ILotteryScheduleUpdateRmq } from "@framework/types";

import { LotteryRoundServiceCron } from "./round.service.cron";
import { ContractService } from "../../../hierarchy/contract/contract.service";

@Injectable()
export class RoundServiceRmq {
  constructor(
    private readonly lotteryRoundServiceCron: LotteryRoundServiceCron,
    private readonly contractService: ContractService,
  ) {}

  public async updateSchedule(dto: ILotteryScheduleUpdateRmq): Promise<void> {
    const lotteryEntity = await this.contractService.findOne({ address: dto.address });

    if (!lotteryEntity) {
      throw new NotFoundException("contractNotFound");
    }

    // TODO simplify?
    const currentParams = lotteryEntity.parameters;
    Object.assign(currentParams, {
      schedule: dto.schedule,
    });
    Object.assign(lotteryEntity.parameters, currentParams);

    await lotteryEntity.save();

    this.lotteryRoundServiceCron.updateOrCreateRoundCronJob(dto);
  }
}
