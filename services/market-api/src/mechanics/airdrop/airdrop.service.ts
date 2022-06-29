import { Injectable } from "@nestjs/common";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { IAirdropSearchDto } from "@framework/types";

import { AirdropEntity } from "./airdrop.entity";

@Injectable()
export class Erc998AirdropService {
  constructor(
    @InjectRepository(AirdropEntity)
    private readonly airdropEntityRepository: Repository<AirdropEntity>,
  ) {}

  public async search(dto: Partial<IAirdropSearchDto>): Promise<[Array<AirdropEntity>, number]> {
    const { skip, take, account, airdropStatus, uniTemplateIds } = dto;

    const queryBuilder = this.airdropEntityRepository.createQueryBuilder("airdrop");

    queryBuilder.select();

    queryBuilder.andWhere("airdrop.account = :account", { account });

    queryBuilder.leftJoin("airdrop.erc998Token", "token");
    queryBuilder.addSelect(["token.id", "token.tokenId"]);

    queryBuilder.leftJoin("airdrop.erc998Template", "template");
    queryBuilder.addSelect(["template.title", "template.imageUrl"]);

    if (airdropStatus) {
      if (airdropStatus.length === 1) {
        queryBuilder.andWhere("airdrop.airdropStatus = :airdropStatus", { airdropStatus: airdropStatus[0] });
      } else {
        queryBuilder.andWhere("airdrop.airdropStatus IN(:...airdropStatus)", { airdropStatus });
      }
    }

    if (uniTemplateIds) {
      if (uniTemplateIds.length === 1) {
        queryBuilder.andWhere("airdrop.uniTemplateId = :uniTemplateId", {
          uniTemplateId: uniTemplateIds[0],
        });
      } else {
        queryBuilder.andWhere("airdrop.uniTemplateId IN(:...uniTemplateIds)", { uniTemplateIds });
      }
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "airdrop.id": "ASC",
    });

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<AirdropEntity>,
    options?: FindOneOptions<AirdropEntity>,
  ): Promise<AirdropEntity | null> {
    return this.airdropEntityRepository.findOne({ where, ...options });
  }
}
