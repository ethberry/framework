import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { LotteryRoundEntity } from "./round.entity";

@Injectable()
export class LotteryRoundService {
  constructor(
    @InjectRepository(LotteryRoundEntity)
    private readonly roundEntityRepository: Repository<LotteryRoundEntity>,
  ) {}

  public async autocomplete(): Promise<Array<LotteryRoundEntity>> {
    const queryBuilder = this.roundEntityRepository.createQueryBuilder("round");

    queryBuilder.select(["id", "id::VARCHAR as title"]);

    queryBuilder.orderBy({
      "round.createdAt": "DESC",
    });

    return queryBuilder.getRawMany();
  }
}
