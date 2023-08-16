import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { TokenType } from "@framework/types";
import { RaffleRoundEntity } from "./round.entity";
import { RaffleTokenService } from "../token/token.service";
import type { IRaffleCurrentDto, IRaffleRoundStatistic } from "./interfaces";

@Injectable()
export class RaffleRoundService {
  constructor(
    @InjectRepository(RaffleRoundEntity)
    private readonly roundEntityRepository: Repository<RaffleRoundEntity>,
    private readonly ticketService: RaffleTokenService,
  ) {}

  public async autocomplete(): Promise<Array<RaffleRoundEntity>> {
    const queryBuilder = this.roundEntityRepository.createQueryBuilder("round");

    queryBuilder.select(["id", "id::VARCHAR as title"]);

    queryBuilder.orderBy({
      "round.createdAt": "DESC",
    });

    return queryBuilder.getRawMany();
  }

  public findOne(
    where: FindOptionsWhere<RaffleRoundEntity>,
    options?: FindOneOptions<RaffleRoundEntity>,
  ): Promise<RaffleRoundEntity | null> {
    return this.roundEntityRepository.findOne({ where, ...options });
  }

  public async current(dto: IRaffleCurrentDto): Promise<RaffleRoundEntity> {
    const { contractId } = dto;

    const lotteryRound = await this.findCurrentRoundWithRelations(contractId);

    if (!lotteryRound) {
      throw new NotFoundException("roundNotFound");
    }

    const ticketCount = await this.ticketService.getTicketCount(lotteryRound.id);

    return Object.assign(lotteryRound, { ticketCount });
  }

  public async latest(dto: IRaffleCurrentDto): Promise<IRaffleRoundStatistic> {
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

  public findCurrentRoundWithRelations(contractId: number): Promise<RaffleRoundEntity | null> {
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

  public async statistic(roundId: number): Promise<IRaffleRoundStatistic> {
    const raffleRoundEntity = await this.findOne({ id: roundId });

    if (!raffleRoundEntity) {
      throw new NotFoundException("roundNotFound");
    }

    // TODO get statistic

    return {
      round: raffleRoundEntity,
      matches: [
        {
          winners: 1,
        },
      ],
    };
  }
}
