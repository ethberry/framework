import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";

import { ModuleType, TokenType } from "@framework/types";

import { ContractService } from "../../../hierarchy/contract/contract.service";
import { ContractEntity } from "../../../hierarchy/contract/contract.entity";
import { RaffleRoundEntity } from "./round.entity";

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

  public async options(): Promise<ContractEntity> {
    const raffleEntity = await this.contractService.findOne({
      contractModule: ModuleType.RAFFLE,
      contractType: undefined,
    });

    if (!raffleEntity) {
      throw new NotFoundException("contractNotFound");
    }

    const raffleRound = await this.findCurrentRoundWithRelations();

    return Object.assign(raffleEntity, { round: raffleRound });
  }

  public findCurrentRoundWithRelations(where?: FindOptionsWhere<RaffleRoundEntity>): Promise<RaffleRoundEntity | null> {
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
