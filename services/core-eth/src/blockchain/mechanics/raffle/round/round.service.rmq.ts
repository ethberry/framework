import { Injectable, NotFoundException } from "@nestjs/common";
import { IRaffleScheduleUpdateRmq } from "@framework/types";

import { RaffleRoundServiceCron } from "./round.service.cron";
import { ContractService } from "../../../hierarchy/contract/contract.service";

@Injectable()
export class RoundServiceRmq {
  constructor(
    private readonly raffleRoundServiceCron: RaffleRoundServiceCron,
    private readonly contractService: ContractService,
  ) {}

  public async updateSchedule(dto: IRaffleScheduleUpdateRmq): Promise<void> {
    const raffleEntity = await this.contractService.findOne({ address: dto.address });

    if (!raffleEntity) {
      throw new NotFoundException("contractNotFound");
    }

    // TODO simplify?
    const currentParams = raffleEntity.parameters;
    Object.assign(currentParams, {
      schedule: dto.schedule,
    });
    Object.assign(raffleEntity.parameters, currentParams);

    await raffleEntity.save();

    this.raffleRoundServiceCron.updateOrCreateRoundCronJob(dto);
  }
}
