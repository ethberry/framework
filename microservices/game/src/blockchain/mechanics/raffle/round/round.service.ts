import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { TokenType } from "@framework/types";
import { RaffleRoundEntity } from "./round.entity";
import { RaffleTokenService } from "../token/token.service";
import type { IRaffleCurrentDto } from "./interfaces";
import { MerchantEntity } from "../../../../infrastructure/merchant/merchant.entity";

@Injectable()
export class RaffleRoundService {
  constructor(
    @InjectRepository(RaffleRoundEntity)
    private readonly roundEntityRepository: Repository<RaffleRoundEntity>,
    private readonly raffleTokenService: RaffleTokenService,
  ) {}

  public async autocomplete(merchantEntity: MerchantEntity): Promise<Array<RaffleRoundEntity>> {
    const queryBuilder = this.roundEntityRepository.createQueryBuilder("round");

    queryBuilder.select(["id", "id::VARCHAR as title"]);
    queryBuilder.leftJoin("round.contract", "contract");

    queryBuilder.where("contract.merchantId = :merchantId", { merchantId: merchantEntity.id });

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

  public async current(dto: IRaffleCurrentDto, merchantEntity: MerchantEntity): Promise<RaffleRoundEntity> {
    const { contractId } = dto;

    const raffleRoundEntity = await this.findCurrentRoundWithRelations(contractId);

    if (!raffleRoundEntity) {
      throw new NotFoundException("roundNotFound");
    }

    if (raffleRoundEntity.contract.merchantId !== merchantEntity.id) {
      throw new ForbiddenException("insufficientPermissions");
    }

    const ticketCount = await this.raffleTokenService.getTicketCount(raffleRoundEntity.id);

    return Object.assign(raffleRoundEntity, { ticketCount });
  }

  public async latest(dto: IRaffleCurrentDto, merchantEntity: MerchantEntity): Promise<RaffleRoundEntity | null> {
    const { contractId } = dto;

    const raffleRoundEntity = await this.findOne(
      { contractId },
      {
        relations: {
          contract: true,
        },
        order: {
          createdAt: "DESC",
        },
      },
    );

    if (!raffleRoundEntity) {
      throw new NotFoundException("roundNotFound");
    }

    if (raffleRoundEntity.contract.merchantId !== merchantEntity.id) {
      throw new ForbiddenException("insufficientPermissions");
    }

    return this.statistic(raffleRoundEntity.id, merchantEntity);
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

  public async statistic(roundId: number, merchantEntity: MerchantEntity): Promise<RaffleRoundEntity | null> {
    const raffleRoundEntity = await this.findOne(
      { id: roundId },
      {
        relations: {
          contract: true,
        },
        order: {
          createdAt: "DESC",
        },
      },
    );

    if (!raffleRoundEntity) {
      throw new NotFoundException("roundNotFound");
    }

    if (raffleRoundEntity.contract.merchantId !== merchantEntity.id) {
      throw new ForbiddenException("insufficientPermissions");
    }

    return raffleRoundEntity;
  }
}
