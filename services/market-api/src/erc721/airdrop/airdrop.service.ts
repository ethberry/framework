import { Injectable } from "@nestjs/common";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { IErc721AirdropSearchDto } from "@framework/types";

import { Erc721AirdropEntity } from "./airdrop.entity";

@Injectable()
export class Erc721AirdropService {
  constructor(
    @InjectRepository(Erc721AirdropEntity)
    private readonly erc721AirdropEntityRepository: Repository<Erc721AirdropEntity>,
  ) {}

  public async search(dto: Partial<IErc721AirdropSearchDto>): Promise<[Array<Erc721AirdropEntity>, number]> {
    const { skip, take, query, airdropStatus, erc721TemplateIds } = dto;

    const queryBuilder = this.erc721AirdropEntityRepository.createQueryBuilder("airdrop");

    queryBuilder.select();

    // queryBuilder.andWhere("airdrop.owner = :owner", { query });

    if (query) {
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("airdrop.owner ILIKE '%' || :owner || '%'", { owner: query.toLowerCase() });
        }),
      );
    }

    queryBuilder.leftJoin("airdrop.erc721Token", "token");
    queryBuilder.addSelect(["token.id", "token.tokenId"]);

    queryBuilder.leftJoin("airdrop.erc721Template", "template");
    queryBuilder.addSelect(["template.title", "template.imageUrl"]);

    if (airdropStatus) {
      if (airdropStatus.length === 1) {
        queryBuilder.andWhere("airdrop.airdropStatus = :airdropStatus", { airdropStatus: airdropStatus[0] });
      } else {
        queryBuilder.andWhere("airdrop.airdropStatus IN(:...airdropStatus)", { airdropStatus });
      }
    }

    if (erc721TemplateIds) {
      if (erc721TemplateIds.length === 1) {
        queryBuilder.andWhere("airdrop.erc721TemplateId = :erc721TemplateId", {
          erc721TemplateId: erc721TemplateIds[0],
        });
      } else {
        queryBuilder.andWhere("airdrop.erc721TemplateId IN(:...erc721TemplateIds)", { erc721TemplateIds });
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
    where: FindOptionsWhere<Erc721AirdropEntity>,
    options?: FindOneOptions<Erc721AirdropEntity>,
  ): Promise<Erc721AirdropEntity | null> {
    return this.erc721AirdropEntityRepository.findOne({ where, ...options });
  }
}
