import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
  LoggerService,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, DeleteResult, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { mapLimit } from "async";

import type { ISearchDto } from "@gemunion/types-collection";
import type { IWaitListListCreateDto, IWaitListListUpdateDto } from "@framework/types";

import { UserEntity } from "../../../../infrastructure/user/user.entity";
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
    protected readonly assetService: AssetService,
  ) {}

  public async search(dto: Partial<ISearchDto>, userEntity: UserEntity): Promise<[Array<WaitListListEntity>, number]> {
    const { query, skip, take } = dto;

    const queryBuilder = this.waitListListEntityRepository.createQueryBuilder("waitlist");

    queryBuilder.select();

    queryBuilder.andWhere("waitlist.merchantId = :merchantId", {
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
          item: "waitlist.item",
          item_components: "item.components",
          item_template: "item_components.template",
          item_contract: "item_components.contract",
        },
      },
    });
  }

  public async create(dto: IWaitListListCreateDto, userEntity: UserEntity): Promise<WaitListListEntity> {
    const { item } = dto;

    const assetEntity = await this.assetService.create({
      components: [],
    });

    await this.assetService.update(assetEntity, item);

    return this.waitListListEntityRepository
      .create({
        ...dto,
        item: assetEntity,
        merchantId: userEntity.merchantId,
      })
      .save();
  }

  public async update(
    where: FindOptionsWhere<WaitListListEntity>,
    dto: IWaitListListUpdateDto,
    userEntity: UserEntity,
  ): Promise<WaitListListEntity> {
    const { item, ...rest } = dto;

    const waitListListEntity = await this.findOne(where, {
      join: {
        alias: "waitlist",
        leftJoinAndSelect: {
          item: "waitlist.item",
          components: "item.components",
        },
      },
    });

    if (!waitListListEntity) {
      throw new NotFoundException("waitlistNotFound");
    }

    if (waitListListEntity.merchantId !== userEntity.merchantId) {
      throw new ForbiddenException("insufficientPermissions");
    }

    Object.assign(waitListListEntity, rest);

    if (item) {
      await this.assetService.update(waitListListEntity.item, item);
    }

    return waitListListEntity.save();
  }

  public async autocomplete(userEntity: UserEntity): Promise<Array<WaitListListEntity>> {
    return this.waitListListEntityRepository.find({
      where: {
        merchantId: userEntity.merchantId,
      },
      select: {
        id: true,
        title: true,
      },
    });
  }

  public async delete(where: FindOptionsWhere<WaitListListEntity>, userEntity: UserEntity): Promise<DeleteResult> {
    const waitListListEntity = await this.findOne(where);

    if (!waitListListEntity) {
      throw new NotFoundException("waitListListNotFound");
    }

    if (waitListListEntity.merchantId !== userEntity.merchantId) {
      throw new ForbiddenException("insufficientPermissions");
    }

    return this.waitListListEntityRepository.delete(where);
  }

  public async generate(dto: IWaitListGenerateDto): Promise<{ root: string }> {
    const waitlistListEntity = await this.waitListListEntityRepository.findOne({
      where: { id: dto.listId },
      relations: { items: true },
    });

    if (!waitlistListEntity) {
      throw new NotFoundException("listNotFound");
    }

    const leaves = waitlistListEntity.items.map(waitlistItemEntity => [waitlistItemEntity.account]);
    // const merkleTree = new MerkleTree(leaves.sort(), utils.keccak256, { hashLeaves: true, sortPairs: true });
    const merkleTree = StandardMerkleTree.of(leaves, ["address"]);

    // return { root: merkleTree.getHexRoot() };
    return { root: merkleTree.root };
  }

  public async upload(dto: IWaitListUploadDto, userEntity: UserEntity): Promise<Array<WaitListItemEntity>> {
    const { items, listId } = dto;

    const waitListListEntity = await this.findOne({ id: listId });

    if (!waitListListEntity) {
      throw new NotFoundException("waitListListNotFound");
    }

    if (waitListListEntity.merchantId !== userEntity.merchantId) {
      throw new ForbiddenException("insufficientPermissions");
    }

    return new Promise(resolve => {
      mapLimit(
        items,
        10,
        async (row: IWaitListRow) => {
          return this.waitListItemService.create({
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
