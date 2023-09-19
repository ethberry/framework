import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { TokenType } from "@framework/types";

import { LotteryRoundEntity } from "./round.entity";
import type { ILotteryCurrentDto } from "./interfaces";
import { LotteryTokenService } from "../token/token.service";

@Injectable()
export class LotteryRoundService {
  constructor(
    @InjectRepository(LotteryRoundEntity)
    private readonly roundEntityRepository: Repository<LotteryRoundEntity>,
    private readonly lotteryTokenService: LotteryTokenService,
  ) {}

  public async autocomplete(): Promise<Array<LotteryRoundEntity>> {
    const queryBuilder = this.roundEntityRepository.createQueryBuilder("round");

    queryBuilder.select(["id", "id::VARCHAR as title"]);

    queryBuilder.orderBy({
      "round.createdAt": "DESC",
    });

    return queryBuilder.getRawMany();
  }

  public findOne(
    where: FindOptionsWhere<LotteryRoundEntity>,
    options?: FindOneOptions<LotteryRoundEntity>,
  ): Promise<LotteryRoundEntity | null> {
    return this.roundEntityRepository.findOne({ where, ...options });
  }

  public async current(dto: ILotteryCurrentDto): Promise<LotteryRoundEntity> {
    const { contractId } = dto;

    const lotteryRound = await this.findCurrentRoundWithRelations(contractId);

    if (!lotteryRound) {
      throw new NotFoundException("roundNotFound");
    }

    const ticketCount = await this.lotteryTokenService.getTicketCount(lotteryRound.id);

    return Object.assign(lotteryRound, { ticketCount });
  }

  public async latest(dto: ILotteryCurrentDto): Promise<LotteryRoundEntity | null> {
    const { contractId } = dto;

    const lotteryRound = await this.findOne(
      { contractId },
      {
        order: {
          createdAt: "DESC",
        },
      },
    );

    if (!lotteryRound) {
      throw new NotFoundException("roundNotFound");
    }

    return this.statistic(lotteryRound.id);
  }

  public findCurrentRoundWithRelations(contractId: number): Promise<LotteryRoundEntity | null> {
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

    queryBuilder.andWhere("round.contractId = :contractId", {
      contractId,
    });

    queryBuilder.andWhere("round.endTimestamp IS NULL");

    return queryBuilder.getOne();
  }

  public async statistic(roundId: number): Promise<LotteryRoundEntity | null> {
    return this.findOne({ id: roundId }, { relations: { aggregation: true } });
  }
}
