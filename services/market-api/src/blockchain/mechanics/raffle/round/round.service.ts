import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";

import { IRaffleContractRound, TokenType } from "@framework/types";

import { ContractService } from "../../../hierarchy/contract/contract.service";
import { RaffleRoundEntity } from "./round.entity";
import { RaffleTokenService } from "../token/token.service";
import { IRaffleOptionsDto } from "./interfaces";

@Injectable()
export class RaffleRoundService {
  constructor(
    @InjectRepository(RaffleRoundEntity)
    private readonly roundEntityRepository: Repository<RaffleRoundEntity>,
    private readonly contractService: ContractService,
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

  public async options(dto: IRaffleOptionsDto): Promise<IRaffleContractRound> {
    const { contractId } = dto;

    const raffleEntity = await this.contractService.findOne({ id: contractId });

    if (!raffleEntity) {
      throw new NotFoundException("contractNotFound");
    }

    const raffleRound = await this.getCurrentRound(contractId);

    const ticketCount = raffleRound ? await this.ticketService.getTicketCount(raffleRound.id) : 0;

    return Object.assign(raffleEntity, { round: raffleRound, count: ticketCount });
  }

  public getCurrentRound(contractId: number): Promise<RaffleRoundEntity | null> {
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
