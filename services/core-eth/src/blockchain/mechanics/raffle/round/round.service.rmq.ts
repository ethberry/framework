import { Injectable, NotFoundException } from "@nestjs/common";
import { IRaffleScheduleUpdateDto } from "@framework/types";

import { RaffleRoundServiceCron } from "./round.service.cron";
import { ContractService } from "../../../hierarchy/contract/contract.service";

@Injectable()
export class RoundServiceRmq {
  constructor(
    private readonly raffleRoundServiceCron: RaffleRoundServiceCron,
    private readonly contractService: ContractService,
  ) {}

  public async updateSchedule(dto: IRaffleScheduleUpdateDto): Promise<void> {
    const raffleEntity = await this.contractService.findOne({ address: dto.address });

    if (!raffleEntity) {
      throw new NotFoundException("contractNotFound");
    }

    // TODO pass empty description?
    // TODO Validate json?
    const descriptionJson = JSON.parse(raffleEntity.description);
    Object.assign(descriptionJson, {
      schedule: dto.schedule,
      description: JSON.parse(dto.description || "{}"),
    });

    Object.assign(raffleEntity, {
      description: JSON.stringify(descriptionJson),
    });

    await raffleEntity.save();

    this.raffleRoundServiceCron.updateOrCreateRoundCronJob({ cron: dto.schedule, address: dto.address });
  }
}
