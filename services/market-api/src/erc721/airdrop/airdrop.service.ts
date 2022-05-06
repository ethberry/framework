import { Injectable } from "@nestjs/common";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { IErc721AirdropSearchDto } from "@framework/types";

import { UserEntity } from "../../user/user.entity";
import { Erc721AirdropEntity } from "./airdrop.entity";

@Injectable()
export class Erc721AirdropService {
  constructor(
    @InjectRepository(Erc721AirdropEntity)
    private readonly erc721AirdropEntityRepository: Repository<Erc721AirdropEntity>,
  ) {}

  public async search(
    userEntity: UserEntity,
    dto: Partial<IErc721AirdropSearchDto>,
  ): Promise<[Array<Erc721AirdropEntity>, number]> {
    const { skip, take, erc721TemplateIds } = dto;

    const queryBuilder = this.erc721AirdropEntityRepository.createQueryBuilder("airdrop");

    queryBuilder.select();

    queryBuilder.leftJoin("airdrop.erc721Token", "token");
    queryBuilder.addSelect(["token.id", "token.tokenId"]);

    queryBuilder.leftJoin("airdrop.erc721Template", "template");
    queryBuilder.addSelect(["template.title", "template.imageUrl"]);

    queryBuilder.andWhere("airdrop.owner = :owner", { owner: userEntity.wallet.toLowerCase() });

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
