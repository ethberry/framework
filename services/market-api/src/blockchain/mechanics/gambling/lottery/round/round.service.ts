import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { TokenType } from "@framework/types";

import { LotteryRoundEntity } from "./round.entity";
import type { ILotteryCurrentDto } from "./interfaces";
import { LotteryTicketTokenService } from "../ticket/token/token.service";

@Injectable()
export class LotteryRoundService {
  constructor(
    @InjectRepository(LotteryRoundEntity)
    private readonly roundEntityRepository: Repository<LotteryRoundEntity>,
    private readonly lotteryTokenService: LotteryTicketTokenService,
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

  public async current(dto: ILotteryCurrentDto): Promise<LotteryRoundEntity | null> {
    const { contractId } = dto;

    const lotteryRoundEntity = await this.findCurrentRoundWithRelations(contractId);

    if (lotteryRoundEntity) {
      const ticketCount = await this.lotteryTokenService.getTicketCount(lotteryRoundEntity.id);
      Object.assign(lotteryRoundEntity, { ticketCount });
    }

    return lotteryRoundEntity;
  }

  public async latest(dto: ILotteryCurrentDto): Promise<LotteryRoundEntity | null> {
    const { contractId } = dto;

    const lotteryRoundEntity = await this.findOne(
      { contractId },
      {
        order: {
          createdAt: "DESC",
        },
      },
    );

    if (!lotteryRoundEntity) {
      throw new NotFoundException("roundNotFound");
    }

    return this.statistic(lotteryRoundEntity.id);
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

  public async findAllRoundIds(dto: ILotteryCurrentDto): Promise<[Array<number>, number]> {
    const { contractId } = dto;
    const queryBuilder = this.roundEntityRepository.createQueryBuilder("round");

    queryBuilder.andWhere("round.contractId = :contractId", {
      contractId,
    });

    queryBuilder.andWhere("round.endTimestamp IS NOT NULL");

    queryBuilder.orderBy({
      "round.endTimestamp": "ASC",
    });

    return queryBuilder.getManyAndCount().then(result => [result[0].map(r => r.id), result[1]]);
  }

  public async statistic(roundId: number): Promise<LotteryRoundEntity | null> {
    return this.findOne(
      { id: roundId },
      {
        relations: {
          aggregation: {
            price: {
              components: {
                contract: true,
                template: true,
              },
            },
          },
          price: {
            components: {
              contract: true,
              template: true,
            },
          },
        },
      },
    );
  }
}
