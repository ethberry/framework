import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { ContractEventType, IErc1155TokenApprovalForAllEvent, IEventHistorySearchDto } from "@framework/types";

import { UserEntity } from "../../infrastructure/user/user.entity";
import { EventHistoryEntity } from "./event-history.entity";
import { ContractEntity } from "../hierarchy/contract/contract.entity";

@Injectable()
export class EventHistoryService {
  constructor(
    @InjectRepository(EventHistoryEntity)
    private readonly eventHistoryEntityRepository: Repository<EventHistoryEntity>,
  ) {}

  public async search(dto: IEventHistorySearchDto): Promise<[Array<EventHistoryEntity>, number]> {
    const { address, tokenId, take, skip } = dto;
    const queryBuilder = this.eventHistoryEntityRepository.createQueryBuilder("history");

    queryBuilder.select();

    queryBuilder.andWhere("history.address = :address", { address });
    queryBuilder.andWhere("history.event_data->>'tokenId' = :tokenId", { tokenId });

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    return queryBuilder.getManyAndCount();
  }

  // TODO add All Exchange events
  public async my(dto: any, userEntity: UserEntity): Promise<[Array<EventHistoryEntity>, number]> {
    const { take, skip, eventTypes } = dto;
    const { wallet } = userEntity;
    const queryBuilder = this.eventHistoryEntityRepository.createQueryBuilder("history");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("history.assets", "assets");
    queryBuilder.leftJoinAndSelect("assets.token", "asset_token");
    queryBuilder.leftJoinAndSelect("asset_token.template", "asset_template");
    queryBuilder.leftJoinAndSelect("asset_template.contract", "asset_contract");

    queryBuilder.innerJoinAndMapOne(
      "history.contract",
      ContractEntity,
      "contract",
      "history.address = contract.address",
    );

    queryBuilder.andWhere("history.parent_id IS NULL");

    if (eventTypes) {
      if (eventTypes.length === 1) {
        queryBuilder.andWhere("history.eventType = :eventType", {
          eventType: eventTypes[0],
        });
      } else {
        queryBuilder.andWhere("history.eventType IN(:...eventTypes)", { eventTypes });
      }
    }

    queryBuilder.andWhere(
      new Brackets(qb => {
        // qb.andWhere(
        //   new Brackets(qb1 => {
        //     qb1.andWhere("history.event_type = :eventType1", { eventType1: ContractEventType.Transfer });
        //     qb1.andWhere(
        //       new Brackets(qb2 => {
        //         qb2.andWhere("LOWER(history.event_data->>'from') = :wallet1", { wallet1: wallet });
        //         qb2.orWhere("LOWER(history.event_data->>'to') = :wallet2", { wallet2: wallet });
        //       }),
        //     );
        //   }),
        // );
        // qb.orWhere(
        //   new Brackets(qb1 => {
        //     qb1.andWhere("history.event_type = :eventType2", { eventType2: ContractEventType.Purchase });
        //     qb1.andWhere(
        //       new Brackets(qb2 => {
        //         qb2.andWhere("LOWER(history.event_data->>'account') = :wallet3", { wallet3: wallet });
        //       }),
        //     );
        //   }),
        // );
        qb.orWhere(
          new Brackets(qb1 => {
            qb1.andWhere("history.event_type = :eventType3", { eventType3: ContractEventType.Claim });
            qb1.andWhere(
              new Brackets(qb2 => {
                qb2.andWhere("LOWER(history.event_data->>'account') = :wallet4", { wallet4: wallet });
              }),
            );
          }),
        );
        // qb.orWhere(
        //   new Brackets(qb1 => {
        //     qb1.andWhere("history.event_type = :eventType4", { eventType4: ContractEventType.Lend });
        //     qb1.andWhere(
        //       new Brackets(qb2 => {
        //         qb2.andWhere("LOWER(history.event_data->>'from') = :wallet5", { wallet5: wallet });
        //         qb2.orWhere("LOWER(history.event_data->>'to') = :wallet6", { wallet6: wallet });
        //       }),
        //     );
        //   }),
        // );
        // qb.orWhere(
        //   new Brackets(qb1 => {
        //     qb1.andWhere("history.event_type = :eventType5", { eventType5: ContractEventType.Upgrade });
        //     qb1.andWhere(
        //       new Brackets(qb2 => {
        //         qb2.andWhere("LOWER(history.event_data->>'from') = :wallet5", { wallet5: wallet });
        //         qb2.orWhere("LOWER(history.event_data->>'to') = :wallet6", { wallet6: wallet });
        //       }),
        //     );
        //   }),
        // );
        qb.orWhere(
          new Brackets(qb1 => {
            qb1.andWhere("history.event_type = :eventType5", { eventType5: ContractEventType.WaitListRewardClaimed });
            qb1.andWhere(
              new Brackets(qb2 => {
                qb2.andWhere("LOWER(history.event_data->>'account') = :wallet", { wallet });
              }),
            );
          }),
        );
        qb.orWhere(
          new Brackets(qb1 => {
            qb1.andWhere("history.event_type = :eventType6", { eventType6: ContractEventType.PurchaseRaffle });
            qb1.andWhere(
              new Brackets(qb2 => {
                qb2.andWhere("LOWER(history.event_data->>'account') = :wallet", { wallet });
              }),
            );
          }),
        );
        qb.orWhere(
          new Brackets(qb1 => {
            qb1.andWhere("history.event_type = :eventType7", { eventType7: ContractEventType.PurchaseLottery });
            qb1.andWhere(
              new Brackets(qb2 => {
                qb2.andWhere("LOWER(history.event_data->>'account') = :wallet", { wallet });
              }),
            );
          }),
        );
      }),
    );

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "history.id": "ASC",
      // "history.createdAt": "DESC",
    });

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<EventHistoryEntity>,
    options?: FindOneOptions<EventHistoryEntity>,
  ): Promise<EventHistoryEntity | null> {
    return this.eventHistoryEntityRepository.findOne({ where, ...options });
  }

  public async getApprove(userEntity: UserEntity, contract: string): Promise<boolean> {
    const account = userEntity.wallet;
    const queryBuilder = this.eventHistoryEntityRepository.createQueryBuilder("history");

    queryBuilder.select();
    queryBuilder.where({ address: contract, eventType: ContractEventType.ApprovalForAll });

    queryBuilder.andWhere("history.event_data->>'account' = :account", { account });
    queryBuilder.addOrderBy("history.updatedAt", "DESC");
    const historyEntity = await queryBuilder.getOne();

    if (!historyEntity) {
      return false;
    }

    return (historyEntity.eventData as IErc1155TokenApprovalForAllEvent).approved;
  }
}
