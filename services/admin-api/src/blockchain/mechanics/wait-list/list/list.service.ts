import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
  LoggerService,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, In, IsNull, Not, Repository } from "typeorm";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { mapLimit } from "async";

import type { ISearchDto } from "@gemunion/types-collection";
import type { IWaitListListAutocompleteDto, IWaitListListCreateDto, IWaitListListUpdateDto } from "@framework/types";

import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { AssetService } from "../../../exchange/asset/asset.service";
import { WaitListItemEntity } from "../item/item.entity";
import { WaitListItemService } from "../item/item.service";
import { WaitListListEntity } from "./list.entity";
import type { IWaitListGenerateDto, IWaitListRow, IWaitListUploadDto } from "./interfaces";

@Injectable()
export class WaitListListService {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    @InjectRepository(WaitListListEntity)
    private readonly waitListListEntityRepository: Repository<WaitListListEntity>,
    @Inject(forwardRef(() => WaitListItemService))
    private readonly waitListItemService: WaitListItemService,
    private readonly assetService: AssetService,
    private readonly contractService: ContractService,
  ) {}

  public async search(dto: Partial<ISearchDto>, userEntity: UserEntity): Promise<[Array<WaitListListEntity>, number]> {
    const { query, skip, take } = dto;

    const queryBuilder = this.waitListListEntityRepository.createQueryBuilder("waitlist");

    queryBuilder.select();

    queryBuilder.leftJoin("waitlist.contract", "contract");
    queryBuilder.addSelect(["contract.contractStatus"]);

    queryBuilder.andWhere("contract.merchantId = :merchantId", {
      merchantId: userEntity.merchantId,
    });

    if (query) {
      queryBuilder.leftJoin(
        qb => {
          qb.getQuery = () => `LATERAL json_array_elements(waitlist.description->'blocks')`;
          return qb;
        },
        `blocks`,
        `TRUE`,
      );
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("waitlist.title ILIKE '%' || :title || '%'", { title: query });
          qb.orWhere("blocks->>'text' ILIKE '%' || :description || '%'", { description: query });
        }),
      );
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "waitlist.createdAt": "ASC",
    });

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<WaitListListEntity>,
    options?: FindOneOptions<WaitListListEntity>,
  ): Promise<WaitListListEntity | null> {
    return this.waitListListEntityRepository.findOne({ where, ...options });
  }

  public findOneWithRelations(where: FindOptionsWhere<WaitListListEntity>): Promise<WaitListListEntity | null> {
    return this.findOne(where, {
      join: {
        alias: "waitlist",
        leftJoinAndSelect: {
          contract: "waitlist.contract",
          items: "waitlist.items",
          item: "waitlist.item",
          item_components: "item.components",
          item_template: "item_components.template",
          item_contract: "item_components.contract",
        },
      },
    });
  }

  public async create(dto: IWaitListListCreateDto, userEntity: UserEntity): Promise<WaitListListEntity> {
    const { item, contractId } = dto;

    const contractEntity = await this.contractService.findOne({ id: contractId });

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    if (contractEntity.merchantId !== userEntity.merchantId) {
      throw new ForbiddenException("insufficientPermissions");
    }

    const assetEntity = await this.assetService.create();
    await this.assetService.update(assetEntity, item, userEntity);

    return this.waitListListEntityRepository
      .create({
        ...dto,
        item: assetEntity,
      })
      .save();
  }

  public async update(
    where: FindOptionsWhere<WaitListListEntity>,
    dto: IWaitListListUpdateDto,
    userEntity: UserEntity,
  ): Promise<WaitListListEntity> {
    const { /* item, */ isPrivate, ...rest } = dto;

    const waitListListEntity = await this.findOne(where, {
      join: {
        alias: "waitlist",
        leftJoinAndSelect: {
          contract: "waitlist.contract",
          item: "waitlist.item",
          components: "item.components",
        },
      },
    });

    if (!waitListListEntity) {
      throw new NotFoundException("waitlistNotFound");
    }

    if (waitListListEntity.contract.merchantId !== userEntity.merchantId) {
      throw new ForbiddenException("insufficientPermissions");
    }

    if (waitListListEntity.root && waitListListEntity.isPrivate !== isPrivate) {
      throw new BadRequestException([
        {
          target: dto,
          value: dto.isPrivate,
          property: "isPrivate",
          children: [],
          constraints: { isCustom: "waitListRewardIsAlreadySet" },
        },
      ]);
    }

    Object.assign(waitListListEntity, rest);

    // update of the item is not allowed, because user signed off for certain item
    // if (item) {
    //   await this.assetService.update(waitListListEntity.item, item);
    // }

    return waitListListEntity.save();
  }

  public async autocomplete(
    dto: Partial<IWaitListListAutocompleteDto>,
    userEntity: UserEntity,
  ): Promise<Array<WaitListListEntity>> {
    const { contractStatus, isRewardSet } = dto;

    const where = {
      contract: {
        merchantId: userEntity.merchantId,
      },
    };

    if (isRewardSet !== void 0) {
      Object.assign(where, {
        root: isRewardSet ? Not(IsNull()) : IsNull(),
      });
    }

    if (contractStatus) {
      Object.assign(where.contract, {
        contractStatus: In(contractStatus),
      });
    }

    return this.waitListListEntityRepository.find({
      where,
      select: {
        id: true,
        title: true,
      },
      relations: {
        contract: true,
      },
    });
  }

  public async delete(
    where: FindOptionsWhere<WaitListListEntity>,
    userEntity: UserEntity,
  ): Promise<WaitListListEntity> {
    const waitListListEntity = await this.findOne(where, { relations: { contract: true } });

    if (!waitListListEntity) {
      throw new NotFoundException("waitListListNotFound");
    }

    if (waitListListEntity.contract.merchantId !== userEntity.merchantId) {
      throw new ForbiddenException("insufficientPermissions");
    }

    return waitListListEntity.remove();
  }

  public async generate(dto: IWaitListGenerateDto): Promise<WaitListListEntity> {
    const { listId } = dto;
    const waitListListEntity = await this.findOneWithRelations({ id: listId });

    if (!waitListListEntity) {
      throw new NotFoundException("listNotFound");
    }

    const leaves = waitListListEntity.items.map(waitlistItemEntity => [waitlistItemEntity.account]);
    const merkleTree = StandardMerkleTree.of(leaves, ["address"]);

    Object.assign(waitListListEntity, {
      root: merkleTree.root,
    });

    // DO NOT SAVE
    return waitListListEntity;
  }

  public async upload(dto: IWaitListUploadDto, userEntity: UserEntity): Promise<Array<WaitListItemEntity>> {
    const { items, listId } = dto;

    const waitListListEntity = await this.findOne({ id: listId }, { relations: { contract: true } });

    if (!waitListListEntity) {
      throw new NotFoundException("waitListListNotFound");
    }

    if (waitListListEntity.contract.merchantId !== userEntity.merchantId) {
      throw new ForbiddenException("insufficientPermissions");
    }

    return new Promise(resolve => {
      mapLimit(
        items,
        10,
        async (row: IWaitListRow) => {
          return this.waitListItemService.createOrFail({
            listId,
            account: row.account,
          });
        },
        (e, results) => {
          if (e) {
            this.loggerService.error(e, WaitListItemService.name);
          }
          resolve(results as Array<WaitListItemEntity>);
        },
      );
    });
  }
}
