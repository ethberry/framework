import { Injectable } from "@nestjs/common";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { IClaimSearchDto } from "@framework/types";

import { ClaimEntity } from "./claim.entity";

@Injectable()
export class ClaimService {
  constructor(
    @InjectRepository(ClaimEntity)
    private readonly claimEntityRepository: Repository<ClaimEntity>,
  ) {}

  public async search(dto: Partial<IClaimSearchDto>): Promise<[Array<ClaimEntity>, number]> {
    const { skip, take, account, claimStatus, templateIds } = dto;

    const queryBuilder = this.claimEntityRepository.createQueryBuilder("claim");

    queryBuilder.select();

    queryBuilder.andWhere("claim.account = :account", { account });

    queryBuilder.leftJoinAndSelect("claim.item", "item");
    queryBuilder.leftJoinAndSelect("item.components", "item_components");
    queryBuilder.leftJoinAndSelect("item_components.template", "item_template");
    queryBuilder.leftJoinAndSelect("item_components.contract", "item_contract");
    queryBuilder.leftJoinAndSelect("item_template.tokens", "item_tokens");

    if (claimStatus) {
      if (claimStatus.length === 1) {
        queryBuilder.andWhere("claim.claimStatus = :claimStatus", { claimStatus: claimStatus[0] });
      } else {
        queryBuilder.andWhere("claim.claimStatus IN(:...claimStatus)", { claimStatus });
      }
    }

    if (templateIds) {
      if (templateIds.length === 1) {
        queryBuilder.andWhere("claim.templateId = :templateId", {
          templateId: templateIds[0],
        });
      } else {
        queryBuilder.andWhere("claim.templateId IN(:...templateIds)", { templateIds });
      }
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "claim.createdAt": "DESC",
    });

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<ClaimEntity>,
    options?: FindOneOptions<ClaimEntity>,
  ): Promise<ClaimEntity | null> {
    return this.claimEntityRepository.findOne({ where, ...options });
  }
}
