import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";

import { LotteryRoundEntity } from "./round.entity";
import { CronExpression, ILotteryOption, ModuleType, TokenType } from "@framework/types";
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

    const lotteryRound = await this.findCurrentRoundWithRelations();

    if (!lotteryRound) {
      throw new NotFoundException("roundNotFound");
    }

    const descriptionJson: Partial<ILotteryOption> = JSON.parse(lotteryEntity.description);

    // TODO real options
    // const lottery = {
    //   description: descriptionJson.description,
    //   schedule: descriptionJson.schedule,
    //   round: lotteryRound,
    // };

    return {
      address: lotteryEntity.address,
      description: descriptionJson.description,
      schedule: descriptionJson.schedule || CronExpression.EVERY_DAY_AT_MIDNIGHT,
      round: lotteryRound,
    };
  }

  public findCurrentRoundWithRelations(
    where?: FindOptionsWhere<LotteryRoundEntity>,
  ): // where: FindOptionsWhere<LotteryRoundEntity>,
  Promise<LotteryRoundEntity | null> {
    const queryBuilder = this.roundEntityRepository.createQueryBuilder("round");
    queryBuilder.leftJoinAndSelect("round.contract", "contract");
    queryBuilder.leftJoinAndSelect("round.ticketContract", "ticketContract");
    queryBuilder.leftJoinAndSelect("round.price", "price");
    queryBuilder.leftJoinAndSelect("price.components", "price_components");
    queryBuilder.leftJoinAndSelect("price_components.contract", "price_contract");
    queryBuilder.leftJoinAndSelect("price_components.template", "price_template");

    queryBuilder.leftJoinAndSelect(
      "price_template.tokens",
      "price_tokens",
      "price_contract.contractType IN(:...tokenTypes)",
      { tokenTypes: [TokenType.NATIVE, TokenType.ERC20, TokenType.ERC1155] },
    );

    if (where) {
      queryBuilder.andWhere("round.id = :id", {
        id: where.id,
      });
    } else {
      // TODO better find current
      queryBuilder.andWhere("round.endTimestamp IS NULL");
    }

    return queryBuilder.getOne();
  }
}
