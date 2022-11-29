import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { LotteryRoundEntity } from "./round.entity";
import { CronExpression, ILotteryOption, ModuleType } from "@framework/types";
import { ContractService } from "../../../hierarchy/contract/contract.service";

@Injectable()
export class LotteryRoundService {
  constructor(
    @InjectRepository(LotteryRoundEntity)
    private readonly roundEntityRepository: Repository<LotteryRoundEntity>,
    private readonly contractService: ContractService,
  ) {}

  public async autocomplete(): Promise<Array<LotteryRoundEntity>> {
    const queryBuilder = this.roundEntityRepository.createQueryBuilder("round");

    queryBuilder.select(["id", "id::VARCHAR as title"]);

    queryBuilder.orderBy({
      "round.createdAt": "DESC",
    });

    return queryBuilder.getRawMany();
  }

  public async options(): Promise<ILotteryOption> {
    const lotteryEntity = await this.contractService.findOne({
      contractModule: ModuleType.LOTTERY,
      contractType: undefined,
    });

    if (!lotteryEntity) {
      throw new NotFoundException("contractNotFound");
    }

    const descriptionJson = JSON.parse(lotteryEntity.description);

    return {
      description: "description" in descriptionJson ? descriptionJson.description : "Lottery",
      schedule: "schedule" in descriptionJson ? descriptionJson.schedule : CronExpression.EVERY_DAY_AT_MIDNIGHT,
    };
  }
}
