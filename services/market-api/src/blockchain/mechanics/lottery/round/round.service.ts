import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";

import type { ILotteryScheduleUpdateDto } from "@framework/types";
import { CronExpression, ModuleType, TokenType } from "@framework/types";

import { ContractService } from "../../../hierarchy/contract/contract.service";
import { LotteryRoundEntity } from "./round.entity";
import { ILotteryOptionsDto } from "./interfaces/options";

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

  public async options(dto: ILotteryOptionsDto): Promise<ILotteryScheduleUpdateDto> {
    const { contractId } = dto;

    const lotteryEntity = await this.contractService.findOne({ id: contractId });

    if (!lotteryEntity) {
      throw new NotFoundException("contractNotFound");
    }

    const lotteryRound = await this.getCurrentRound(contractId);

    // const descriptionJson: Partial<ILotteryOption> = JSON.parse(lotteryEntity.parameters);
    return {
      address: lotteryEntity.address,
      description: lotteryEntity.description,
      schedule: lotteryEntity.parameters.schedule as unknown as CronExpression,
      round: lotteryRound || undefined,
    };
  }

  public getCurrentRound(contractId: number): Promise<LotteryRoundEntity | null> {
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

  public findCurrentRoundWithRelations(
    where?: FindOptionsWhere<LotteryRoundEntity>,
  ): Promise<LotteryRoundEntity | null> {
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
      // TODO better find current round
      queryBuilder.andWhere("round.endTimestamp IS NULL");
    }

    return queryBuilder.getOne();
  }
}
