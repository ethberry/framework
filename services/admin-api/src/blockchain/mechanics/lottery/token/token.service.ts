import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";

import { ILotteryTokenSearchDto, ModuleType, TokenMetadata } from "@framework/types";

import { TokenEntity } from "../../../hierarchy/token/token.entity";
import { TokenService } from "../../../hierarchy/token/token.service";
import { LotteryRoundEntity } from "../round/round.entity";

@Injectable()
export class LotteryTokenService extends TokenService {
  constructor(
    @InjectRepository(TokenEntity)
    protected readonly tokenEntityRepository: Repository<TokenEntity>,
  ) {
    super(tokenEntityRepository);
  }

  public async search(dto: Partial<ILotteryTokenSearchDto>): Promise<[Array<TokenEntity>, number]> {
    const { roundIds, skip, take } = dto;

    const queryBuilder = this.tokenEntityRepository.createQueryBuilder("ticket");
    queryBuilder.leftJoinAndSelect("ticket.template", "template");
    queryBuilder.leftJoinAndSelect("template.contract", "contract");
    queryBuilder.leftJoinAndSelect("ticket.balance", "balance");

    queryBuilder.select();

    queryBuilder.where("contract.contractModule = :contractModule", {
      contractModule: ModuleType.LOTTERY,
    });

    queryBuilder.leftJoinAndMapOne(
      "ticket.round",
      LotteryRoundEntity,
      "round",
      `(ticket.metadata->>'${TokenMetadata.ROUND}')::numeric = round.round_id AND template.contract_id = round.ticket_contract_id`,
    );

    queryBuilder.leftJoinAndSelect("round.contract", "lottery_contract");

    queryBuilder.andWhere("template.contractId = round.ticketContractId");

    if (roundIds) {
      if (roundIds.length === 1) {
        queryBuilder.andWhere("round.roundId = :roundId", {
          roundId: roundIds[0],
        });
      } else {
        queryBuilder.andWhere("round.roundId IN(:...roundIds)", { roundIds });
      }
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy("ticket.createdAt", "DESC");

    return queryBuilder.getManyAndCount();
  }

  public findOneWithRelations(where: FindOptionsWhere<TokenEntity>): Promise<TokenEntity | null> {
    const queryBuilder = this.tokenEntityRepository.createQueryBuilder("ticket");

    queryBuilder.leftJoinAndSelect("ticket.template", "template");
    queryBuilder.leftJoinAndSelect("ticket.balance", "balance");

    queryBuilder.leftJoinAndMapOne(
      "ticket.round",
      LotteryRoundEntity,
      "round",
      `(ticket.metadata->>'${TokenMetadata.ROUND}')::numeric = round.round_id`,
    );
    queryBuilder.leftJoinAndSelect("round.contract", "lottery_contract");

    queryBuilder.andWhere("template.contractId = round.ticketContractId");

    queryBuilder.andWhere("ticket.id = :id", {
      id: where.id,
    });

    return queryBuilder.getOne();
  }
}
