import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, DeleteResult, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";

import type { ISearchableDto, ISearchDto } from "@gemunion/types-collection";

import { IWaitListListCreateDto } from "./interfaces";
import { WaitListListEntity } from "./list.entity";
import { WaitListGenerateDto } from "./dto";
import { UserEntity } from "../../../../infrastructure/user/user.entity";

@Injectable()
export class WaitListListService {
  constructor(
    @InjectRepository(WaitListListEntity)
    private readonly waitListListEntityRepository: Repository<WaitListListEntity>,
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

  public async create(dto: IWaitListListCreateDto, userEntity: UserEntity): Promise<WaitListListEntity> {
    return this.waitListListEntityRepository
      .create({
        ...dto,
        merchantId: userEntity.merchantId,
      })
      .save();
  }

  public async update(
    where: FindOptionsWhere<WaitListListEntity>,
    dto: Partial<ISearchableDto>,
  ): Promise<WaitListListEntity> {
    const waitListListEntity = await this.findOne(where);

    if (!waitListListEntity) {
      throw new NotFoundException("waitlistNotFound");
    }

    Object.assign(waitListListEntity, dto);

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

  public async delete(where: FindOptionsWhere<WaitListListEntity>): Promise<DeleteResult> {
    return this.waitListListEntityRepository.delete(where);
  }

  public async generate(dto: WaitListGenerateDto): Promise<{ root: string }> {
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
