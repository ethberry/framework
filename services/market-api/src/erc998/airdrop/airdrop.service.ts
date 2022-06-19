import { Injectable } from "@nestjs/common";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { IErc998AirdropSearchDto } from "@framework/types";

import { Erc998AirdropEntity } from "./airdrop.entity";

@Injectable()
export class Erc998AirdropService {
  constructor(
    @InjectRepository(Erc998AirdropEntity)
    private readonly erc998AirdropEntityRepository: Repository<Erc998AirdropEntity>,
  ) {}

  public async search(dto: Partial<IErc998AirdropSearchDto>): Promise<[Array<Erc998AirdropEntity>, number]> {
    const { skip, take, query, airdropStatus, erc998TemplateIds } = dto;

    const queryBuilder = this.erc998AirdropEntityRepository.createQueryBuilder("airdrop");

    queryBuilder.select();

    queryBuilder.andWhere("airdrop.owner = :owner", { query });

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

    if (erc998TemplateIds) {
      if (erc998TemplateIds.length === 1) {
        queryBuilder.andWhere("airdrop.erc998TemplateId = :erc998TemplateId", {
          erc998TemplateId: erc998TemplateIds[0],
        });
      } else {
        queryBuilder.andWhere("airdrop.erc998TemplateId IN(:...erc998TemplateIds)", { erc998TemplateIds });
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
    where: FindOptionsWhere<Erc998AirdropEntity>,
    options?: FindOneOptions<Erc998AirdropEntity>,
  ): Promise<Erc998AirdropEntity | null> {
    return this.erc998AirdropEntityRepository.findOne({ where, ...options });
  }
}
