import { Injectable, NotFoundException } from "@nestjs/common";
import { ILotteryScheduleUpdateDto } from "@framework/types";

import { LotteryRoundServiceCron } from "./round.service.cron";
import { ContractService } from "../../../hierarchy/contract/contract.service";

@Injectable()
export class RoundServiceRmq {
  constructor(
    private readonly lotteryRoundServiceCron: LotteryRoundServiceCron,
    private readonly contractService: ContractService,
  ) {}

  public async updateSchedule(dto: ILotteryScheduleUpdateDto): Promise<void> {
    const lotteryEntity = await this.contractService.findOne({ address: dto.address });

    if (!lotteryEntity) {
      throw new NotFoundException("contractNotFound");
    }

    // TODO pass empty description?
    // TODO Validate json?
    const descriptionJson = JSON.parse(lotteryEntity.description);
    Object.assign(descriptionJson, {
      schedule: dto.schedule,
      description: JSON.parse(dto.description || "{}"),
    });

    Object.assign(lotteryEntity, {
      description: JSON.stringify(descriptionJson),
    });

    await lotteryEntity.save();

    this.lotteryRoundServiceCron.updateOrCreateRoundCronJob({ cron: dto.schedule, address: dto.address });
  }
}
