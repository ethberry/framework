import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import type { IRaffleTokenSearchDto } from "@framework/types";
import { ModuleType, TokenMetadata } from "@framework/types";

import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { TokenEntity } from "../../../hierarchy/token/token.entity";
import { TokenService } from "../../../hierarchy/token/token.service";
import { RaffleRoundEntity } from "../round/round.entity";

@Injectable()
export class RaffleTokenService extends TokenService {
  constructor(
    @InjectRepository(TokenEntity)
    protected readonly tokenEntityRepository: Repository<TokenEntity>,
  ) {
    super(tokenEntityRepository);
  }

  public async search(
    dto: Partial<IRaffleTokenSearchDto>,
    userEntity: UserEntity,
  ): Promise<[Array<TokenEntity>, number]> {
    const { roundIds, skip, take } = dto;

    const queryBuilder = this.tokenEntityRepository.createQueryBuilder("ticket");
    queryBuilder.leftJoinAndSelect("ticket.template", "template");
    queryBuilder.leftJoinAndSelect("template.contract", "contract");
    queryBuilder.leftJoinAndSelect("ticket.balance", "balance");

    queryBuilder.select();

    queryBuilder.where("contract.contractModule = :contractModule", {
      contractModule: ModuleType.RAFFLE,
    });

    queryBuilder.andWhere("balance.account = :account", { account: userEntity.wallet });

    queryBuilder.leftJoinAndMapOne(
      "ticket.round",
      RaffleRoundEntity,
      "round",
      `(ticket.metadata->>'${TokenMetadata.ROUND}')::numeric = round.id AND template.contract_id = round.ticket_contract_id`,
    );

    queryBuilder.leftJoinAndSelect("round.contract", "raffle_contract");

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

  public findOne(
    where: FindOptionsWhere<TokenEntity>,
    options?: FindOneOptions<TokenEntity>,
  ): Promise<TokenEntity | null> {
    return this.tokenEntityRepository.findOne({ where, ...options });
  }

  public findOneWithRelations(where: FindOptionsWhere<TokenEntity>): Promise<TokenEntity | null> {
    const queryBuilder = this.tokenEntityRepository.createQueryBuilder("ticket");

    queryBuilder.leftJoinAndSelect("ticket.template", "template");
    queryBuilder.leftJoinAndSelect("template.contract", "contract");
    queryBuilder.leftJoinAndSelect("ticket.balance", "balance");

    queryBuilder.leftJoinAndMapOne(
      "ticket.round",
      RaffleRoundEntity,
      "round",
      `template.contract_id = round.ticket_contract_id AND (ticket.metadata->>'${TokenMetadata.ROUND}')::numeric = round.id`,
    );

    queryBuilder.leftJoinAndSelect("round.contract", "raffle_contract");

    queryBuilder.andWhere("ticket.id = :id", {
      id: where.id,
    });

    return queryBuilder.getOne();
  }

  public getTicketCount(roundId: number): Promise<number> {
    const queryBuilder = this.tokenEntityRepository.createQueryBuilder("ticket");

    queryBuilder.leftJoin("ticket.template", "template");
    queryBuilder.leftJoin("template.contract", "contract");

    queryBuilder.leftJoinAndMapOne(
      "ticket.round",
      RaffleRoundEntity,
      "round",
      `template.contract_id = round.ticket_contract_id AND (ticket.metadata->>'${TokenMetadata.ROUND}')::numeric = round.id`,
    );

    queryBuilder.leftJoin("round.contract", "raffle_contract");

    queryBuilder.andWhere("round.id = :id", {
      id: roundId,
    });

    return queryBuilder.getCount();
  }
}
