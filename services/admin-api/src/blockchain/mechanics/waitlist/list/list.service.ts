import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, DeleteResult, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { MerkleTree } from "merkletreejs";
import { utils } from "ethers";

import type { ISearchableDto, ISearchDto } from "@gemunion/types-collection";

import { IWaitlistListCreateDto } from "./interfaces";
import { WaitlistListEntity } from "./list.entity";
import { WaitlistGenerateDto } from "./dto";

@Injectable()
export class WaitlistListService {
  constructor(
    @InjectRepository(WaitlistListEntity)
    private readonly waitlistListEntityRepository: Repository<WaitlistListEntity>,
  ) {}

  public async search(dto: Partial<ISearchDto>): Promise<[Array<WaitlistListEntity>, number]> {
    const { query, skip, take } = dto;

    const queryBuilder = this.waitlistListEntityRepository.createQueryBuilder("waitlist");

    queryBuilder.select();

    if (query) {
      queryBuilder.leftJoin(
        "(SELECT 1)",
        "dummy",
        "TRUE LEFT JOIN LATERAL json_array_elements(waitlist.description->'blocks') blocks ON TRUE",
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
    where: FindOptionsWhere<WaitlistListEntity>,
    options?: FindOneOptions<WaitlistListEntity>,
  ): Promise<WaitlistListEntity | null> {
    return this.waitlistListEntityRepository.findOne({ where, ...options });
  }

  public async create(dto: IWaitlistListCreateDto): Promise<WaitlistListEntity> {
    return this.waitlistListEntityRepository.create(dto).save();
  }

  public async update(
    where: FindOptionsWhere<WaitlistListEntity>,
    dto: Partial<ISearchableDto>,
  ): Promise<WaitlistListEntity> {
    const waitlistListEntity = await this.findOne(where);

    if (!waitlistListEntity) {
      throw new NotFoundException("waitlistNotFound");
    }

    Object.assign(waitlistListEntity, dto);

    return waitlistListEntity.save();
  }

  public async autocomplete(): Promise<Array<WaitlistListEntity>> {
    return this.waitlistListEntityRepository.find({
      select: {
        id: true,
        title: true,
      },
    });
  }

  public async delete(where: FindOptionsWhere<WaitlistListEntity>): Promise<DeleteResult> {
    return this.waitlistListEntityRepository.delete(where);
  }

  public async generate(dto: WaitlistGenerateDto): Promise<{ root: string }> {
    const waitlistListEntity = await this.waitlistListEntityRepository.findOne({
      where: { id: dto.listId },
      relations: { items: true },
    });

    if (!waitlistListEntity) {
      throw new NotFoundException("listNotFound");
    }

    const leaves = waitlistListEntity.items.map(waitlistItemEntity => waitlistItemEntity.account);
    const merkleTree = new MerkleTree(leaves.sort(), utils.keccak256, { hashLeaves: true, sortPairs: true });

    return { root: merkleTree.getHexRoot() };
  }
}
