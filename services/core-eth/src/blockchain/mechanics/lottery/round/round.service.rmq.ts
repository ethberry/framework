import { Injectable, NotFoundException } from "@nestjs/common";
import { ILotteryOption, ModuleType } from "@framework/types";

import { LotteryRoundServiceCron } from "./round.service.cron";
import { ContractService } from "../../../hierarchy/contract/contract.service";

@Injectable()
export class RoundServiceRmq {
  constructor(
    private readonly lotteryRoundServiceCron: LotteryRoundServiceCron,
    private readonly contractService: ContractService,
  ) {}

  public async updateSchedule(dto: ILotteryOption): Promise<void> {
    const lotteryEntity = await this.contractService.findOne({ address: dto.lottery });

    if (!lotteryEntity) {
      throw new NotFoundException("contractNotFound");
    }

    // TODO VALIDATE?
    const descriptionJson = JSON.parse(lotteryEntity.description);
    Object.assign(descriptionJson, {
      schedule: dto.schedule,
      description: JSON.parse(dto.description || "{}"),
    });

    Object.assign(lotteryEntity, {
      description: JSON.stringify(descriptionJson),
    });

    await lotteryEntity.save();

    this.lotteryRoundServiceCron.updateRoundCronJob({ cron: dto.schedule, lottery: dto.lottery });
  }
}
