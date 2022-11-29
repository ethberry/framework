import { Injectable, NotFoundException } from "@nestjs/common";
import { ModuleType } from "@framework/types";

import { LotteryRoundServiceCron } from "./round.service.cron";
import { ILotteryScheduleDto } from "./interfaces";
import { ContractService } from "../../../hierarchy/contract/contract.service";

@Injectable()
export class RoundServiceRmq {
  constructor(
    private readonly lotteryRoundServiceCron: LotteryRoundServiceCron,
    private readonly contractService: ContractService,
  ) {}

  public async updateSchedule(dto: ILotteryScheduleDto): Promise<void> {
    const lotteryEntity = await this.contractService.findOne({
      contractModule: ModuleType.LOTTERY,
      contractType: undefined,
    });

    if (!lotteryEntity) {
      throw new NotFoundException("contractNotFound");
    }

    const descriptionJson = JSON.parse(lotteryEntity.description);
    Object.assign(descriptionJson, {
      roundSchedule: dto.roundSchedule,
      description: JSON.parse(dto.description || "{}"),
    });

    Object.assign(lotteryEntity, {
      description: JSON.stringify(descriptionJson),
    });

    await lotteryEntity.save();

    this.lotteryRoundServiceCron.updateRoundCronJob(dto.roundSchedule);
  }
}
