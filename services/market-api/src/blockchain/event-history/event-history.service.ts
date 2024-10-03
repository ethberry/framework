import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import {
  AccessControlEventType,
  Erc1155EventType,
  Erc20EventType,
  ExchangeEventType,
  IErc1155TokenApprovalForAllEvent,
  MysteryEventType,
  WaitListEventType,
} from "@framework/types";

import { UserEntity } from "../../infrastructure/user/user.entity";
import { ContractEntity } from "../hierarchy/contract/contract.entity";
import { EventHistoryEntity } from "./event-history.entity";
import type { IEventHistoryCraftSearchDto, IEventHistoryTokenSearchDto } from "./interfaces";
import { EventHistorySearchDto2 } from "./dto";
import { getSortOrder } from "../../common/utils/sorter";

@Injectable()
export class EventHistoryService {
  constructor(
    @InjectRepository(EventHistoryEntity)
    private readonly eventHistoryEntityRepository: Repository<EventHistoryEntity>,
  ) {}

  public async token(dto: IEventHistoryTokenSearchDto): Promise<[Array<EventHistoryEntity>, number]> {
    const { tokenId, take, skip } = dto;
    const queryBuilder = this.eventHistoryEntityRepository.createQueryBuilder("history");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("history.assets", "assets_filter");
    // queryBuilder.andWhere("assets_filter.tokenId = :tokenId", { tokenId });

    // include all events for given tokenId
    queryBuilder.andWhere(
      new Brackets(qb => {
        qb.where("assets_filter.tokenId = :tokenId", { tokenId });
        qb.orWhere("history.tokenId = :tokenId", { tokenId });
      }),
    );

    queryBuilder.leftJoinAndSelect("history.token", "token");
    queryBuilder.leftJoinAndSelect("token.template", "template");
    queryBuilder.leftJoinAndSelect("template.contract", "contract");
    queryBuilder.leftJoinAndSelect("history.assets", "assets");
    queryBuilder.leftJoinAndSelect("assets.token", "asset_token");
    queryBuilder.leftJoinAndSelect("asset_token.template", "asset_template");
    queryBuilder.leftJoinAndSelect("asset_template.contract", "asset_contract");

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "history.id": "ASC",
    });

    return queryBuilder.getManyAndCount();
  }

  public async craft(dto: IEventHistoryCraftSearchDto): Promise<[Array<EventHistoryEntity>, number]> {
    const { craftId, take, skip } = dto;
    const queryBuilder = this.eventHistoryEntityRepository.createQueryBuilder("history");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("history.assets", "assets");
    queryBuilder.leftJoinAndSelect("assets.token", "asset_token");
    queryBuilder.leftJoinAndSelect("asset_token.template", "asset_template");
    queryBuilder.leftJoinAndSelect("asset_template.contract", "asset_contract");

    queryBuilder.andWhere("history.eventType = :eventType", { eventType: ExchangeEventType.Craft });
    queryBuilder.andWhere("history.event_data->>'externalId' = :externalId", { externalId: craftId });

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "history.id": "ASC",
      // "history.createdAt": "DESC",
    });

    return queryBuilder.getManyAndCount();
  }

  // TODO add All Exchange events
  // TODO include others events, such as LevelUp
  public async my(dto: EventHistorySearchDto2, userEntity: UserEntity): Promise<[Array<EventHistoryEntity>, number]> {
    const { take, skip, order, eventTypes } = dto;

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

    queryBuilder.andWhere("contract.chainId = :chainId", {
      chainId: userEntity.chainId,
    });

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
        /* HIERARCHY 0xx */
        qb.orWhere(
          new Brackets(qb1 => {
            qb1.andWhere("history.event_type = :eventType001", { eventType001: Erc20EventType.Transfer }); // Erc721EventType is identical
            qb1.andWhere(
              new Brackets(qb2 => {
                qb2.andWhere("LOWER(history.event_data->>'from') = :wallet", { wallet });
                qb2.orWhere("LOWER(history.event_data->>'to') = :wallet", { wallet });
              }),
            );
          }),
        );
        qb.orWhere(
          new Brackets(qb1 => {
            qb1.andWhere("history.event_type = :eventType002", { eventType002: Erc1155EventType.TransferSingle });
            qb1.andWhere(
              new Brackets(qb2 => {
                qb2.andWhere("LOWER(history.event_data->>'from') = :wallet", { wallet });
                qb2.orWhere("LOWER(history.event_data->>'to') = :wallet", { wallet });
              }),
            );
          }),
        );
        qb.orWhere(
          new Brackets(qb1 => {
            qb1.andWhere("history.event_type = :eventType003", { eventType003: Erc1155EventType.TransferBatch });
            qb1.andWhere(
              new Brackets(qb2 => {
                qb2.andWhere("LOWER(history.event_data->>'from') = :wallet", { wallet });
                qb2.orWhere("LOWER(history.event_data->>'to') = :wallet", { wallet });
              }),
            );
          }),
        );
        qb.orWhere(
          new Brackets(qb1 => {
            qb1.andWhere("history.event_type = :eventType010", {
              eventType010: AccessControlEventType.OwnershipTransferred,
            });
            qb1.andWhere(
              new Brackets(qb2 => {
                qb2.andWhere("LOWER(history.event_data->>'previousOwner') = :wallet", { wallet });
                qb2.orWhere("LOWER(history.event_data->>'newOwner') = :wallet", { wallet });
              }),
            );
          }),
        );
        qb.orWhere(
          new Brackets(qb1 => {
            qb1.andWhere("history.event_type = :eventType011", {
              eventType011: AccessControlEventType.RoleGranted,
            });
            qb1.andWhere(
              new Brackets(qb2 => {
                qb2.andWhere("LOWER(history.event_data->>'account') = :wallet", { wallet });
                qb2.orWhere("LOWER(history.event_data->>'sender') = :wallet", { wallet });
              }),
            );
          }),
        );
        qb.orWhere(
          new Brackets(qb1 => {
            qb1.andWhere("history.event_type = :eventType012", {
              eventType012: AccessControlEventType.RoleRevoked,
            });
            qb1.andWhere(
              new Brackets(qb2 => {
                qb2.andWhere("LOWER(history.event_data->>'account') = :wallet", { wallet });
                qb2.orWhere("LOWER(history.event_data->>'sender') = :wallet", { wallet });
              }),
            );
          }),
        );

        /* EXCHANGE 1xx */
        qb.orWhere(
          new Brackets(qb1 => {
            qb1.andWhere("history.event_type = :eventType101", { eventType101: ExchangeEventType.Purchase });
            qb1.andWhere("LOWER(history.event_data->>'account') = :wallet", { wallet });
          }),
        );
        qb.orWhere(
          new Brackets(qb1 => {
            qb1.andWhere("history.event_type = :eventType102", { eventType102: ExchangeEventType.PurchaseRaffle });
            qb1.andWhere("LOWER(history.event_data->>'account') = :wallet", { wallet });
          }),
        );
        qb.orWhere(
          new Brackets(qb1 => {
            qb1.andWhere("history.event_type = :eventType103", { eventType103: ExchangeEventType.PurchaseLottery });
            qb1.andWhere("LOWER(history.event_data->>'account') = :wallet", { wallet });
          }),
        );
        qb.orWhere(
          new Brackets(qb1 => {
            qb1.andWhere("history.event_type = :eventType104", { eventType104: ExchangeEventType.PurchaseMysteryBox });
            qb1.andWhere("LOWER(history.event_data->>'account') = :wallet", { wallet });
          }),
        );
        qb.orWhere(
          new Brackets(qb1 => {
            qb1.andWhere("history.event_type = :eventType105", { eventType105: ExchangeEventType.PurchaseLootBox });
            qb1.andWhere("LOWER(history.event_data->>'account') = :wallet", { wallet });
          }),
        );
        qb.orWhere(
          new Brackets(qb1 => {
            qb1.andWhere("history.event_type = :eventType106", { eventType106: ExchangeEventType.Upgrade });
            qb1.andWhere("LOWER(history.event_data->>'account') = :wallet", { wallet });
          }),
        );

        /* EXCHANGE 2xx */
        qb.orWhere(
          new Brackets(qb1 => {
            qb1.andWhere("history.event_type = :eventType201", { eventType201: ExchangeEventType.Claim });
            qb1.andWhere("LOWER(history.event_data->>'account') = :wallet", { wallet });
          }),
        );
        qb.orWhere(
          new Brackets(qb1 => {
            qb1.andWhere("history.event_type = :eventType202", { eventType202: ExchangeEventType.Craft });
            qb1.andWhere("LOWER(history.event_data->>'account') = :wallet", { wallet });
          }),
        );
        qb.orWhere(
          new Brackets(qb1 => {
            qb1.andWhere("history.event_type = :eventType203", { eventType203: ExchangeEventType.Dismantle });
            qb1.andWhere("LOWER(history.event_data->>'account') = :wallet", { wallet });
          }),
        );
        qb.orWhere(
          new Brackets(qb1 => {
            qb1.andWhere("history.event_type = :eventType204", { eventType204: ExchangeEventType.Merge });
            qb1.andWhere("LOWER(history.event_data->>'account') = :wallet", { wallet });
          }),
        );

        /* MECHANICS 2xx */
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

        qb.orWhere(
          new Brackets(qb1 => {
            qb1.andWhere("history.event_type = :eventType301", {
              eventType301: WaitListEventType.WaitListRewardClaimed,
            });
            qb1.andWhere("LOWER(history.event_data->>'account') = :wallet", { wallet });
          }),
        );
        qb.orWhere(
          new Brackets(qb1 => {
            qb1.andWhere("history.event_type = :eventType302", { eventType302: MysteryEventType.UnpackMysteryBox });
            qb1.andWhere("LOWER(history.event_data->>'account') = :wallet", { wallet });
          }),
        );
      }),
    );

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    const sortOrder = getSortOrder<EventHistoryEntity>("history", order);

    queryBuilder.orderBy({ ...sortOrder, "history.id": "ASC" });

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
    queryBuilder.where({ address: contract, eventType: Erc1155EventType.ApprovalForAll }); // erc721 is identical

    queryBuilder.andWhere("history.event_data->>'account' = :account", { account });
    queryBuilder.addOrderBy("history.updatedAt", "DESC");
    const historyEntity = await queryBuilder.getOne();

    if (!historyEntity) {
      return false;
    }

    return (historyEntity.eventData as IErc1155TokenApprovalForAllEvent).approved;
  }
}
