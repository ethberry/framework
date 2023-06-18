import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, DeleteResult, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";

import type { ISearchDto } from "@gemunion/types-collection";
import type { IWaitListListCreateDto, IWaitListListUpdateDto } from "@framework/types";

import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { AssetService } from "../../../exchange/asset/asset.service";
import { WaitListListEntity } from "./list.entity";
import type { IWaitListGenerateDto } from "./interfaces";

@Injectable()
export class WaitListListService {
  constructor(
    @InjectRepository(WaitListListEntity)
    private readonly waitListListEntityRepository: Repository<WaitListListEntity>,
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

  public async autocomplete(): Promise<Array<WaitListListEntity>> {
    return this.waitListListEntityRepository.find({
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
}
