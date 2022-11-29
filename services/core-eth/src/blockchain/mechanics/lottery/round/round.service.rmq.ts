import { Injectable, NotFoundException } from "@nestjs/common";
import { ModuleType, ILotteryOption } from "@framework/types";

import { LotteryRoundServiceCron } from "./round.service.cron";
import { ContractService } from "../../../hierarchy/contract/contract.service";

@Injectable()
export class RoundServiceRmq {
  constructor(
    private readonly lotteryRoundServiceCron: LotteryRoundServiceCron,
    private readonly contractService: ContractService,
  ) {}

  public async updateSchedule(dto: ILotteryOption): Promise<void> {
    const lotteryEntity = await this.contractService.findOne({
      contractModule: ModuleType.LOTTERY,
      contractType: undefined,
    });

    if (!lotteryEntity) {
      throw new NotFoundException("contractNotFound");
    }

    const descriptionJson = JSON.parse(lotteryEntity.description);
    Object.assign(descriptionJson, {
      schedule: dto.schedule,
      description: JSON.parse(dto.description || "{}"),
    });

    Object.assign(lotteryEntity, {
      description: JSON.stringify(descriptionJson),
    });

    await lotteryEntity.save();

    this.lotteryRoundServiceCron.updateRoundCronJob(dto.schedule);
  }
}
