import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { Erc1155TokenHistoryEntity } from "./token-history.entity";
import { UserEntity } from "../../user/user.entity";
import { Erc1155TokenEventType, IErc1155TokenApprovalForAll } from "@framework/types";

@Injectable()
export class Erc1155TokenHistoryService {
  constructor(
    @InjectRepository(Erc1155TokenHistoryEntity)
    private readonly Erc1155TokenHistoryEntityRepository: Repository<Erc1155TokenHistoryEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<Erc1155TokenHistoryEntity>,
    options?: FindOneOptions<Erc1155TokenHistoryEntity>,
  ): Promise<Erc1155TokenHistoryEntity | null> {
    return this.Erc1155TokenHistoryEntityRepository.findOne({ where, ...options });
  }

  public async getApprove(userEntity: UserEntity, contract: string): Promise<boolean> {
    const wallet = userEntity.wallet;
    const queryBuilder = this.Erc1155TokenHistoryEntityRepository.createQueryBuilder("history");

    queryBuilder.select();
    queryBuilder.where({ address: contract, eventType: Erc1155TokenEventType.ApprovalForAll });

    queryBuilder.andWhere("history.event_data->>'account' = :wallet", { wallet });
    queryBuilder.addOrderBy("history.updatedAt", "DESC");
    const historyEntity = await queryBuilder.getOne();

    if (!historyEntity) {
      return false;
    }

    return (historyEntity.eventData as IErc1155TokenApprovalForAll).approved;
  }
}
