import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { RaffleRoundEntity } from "./round.entity";
import { CronExpression, IRaffleOption, ModuleType } from "@framework/types";
import { ContractService } from "../../../hierarchy/contract/contract.service";

@Injectable()
export class RaffleRoundService {
  constructor(
    @InjectRepository(RaffleRoundEntity)
    private readonly roundEntityRepository: Repository<RaffleRoundEntity>,
    private readonly contractService: ContractService,
  ) {}

  public async autocomplete(): Promise<Array<RaffleRoundEntity>> {
    const queryBuilder = this.roundEntityRepository.createQueryBuilder("round");

    queryBuilder.select(["id", "id::VARCHAR as title"]);

    queryBuilder.orderBy({
      "round.createdAt": "DESC",
    });

    return queryBuilder.getRawMany();
  }

  public async options(): Promise<IRaffleOption> {
    const raffleEntity = await this.contractService.findOne({
      contractModule: ModuleType.RAFFLE,
      contractType: undefined,
    });

    if (!raffleEntity) {
      throw new NotFoundException("contractNotFound");
    }

    const descriptionJson: IRaffleOption = JSON.parse(raffleEntity.description);

    return Object.assign(
      {
        description: "Raffle",
        schedule: CronExpression.EVERY_DAY_AT_MIDNIGHT,
      },
      descriptionJson,
    );
  }
}
