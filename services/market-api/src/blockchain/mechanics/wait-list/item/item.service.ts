import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";

import type { IWaitListItemCreateDto } from "@framework/types";
import { WaitListItemStatus } from "@framework/types";

import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { WaitListItemEntity } from "./item.entity";
import { WaitListProofDto } from "./dto";

@Injectable()
export class WaitListItemService {
  constructor(
    @InjectRepository(WaitListItemEntity)
    private readonly waitListItemEntityRepository: Repository<WaitListItemEntity>,
  ) {}

  public async search(userEntity: UserEntity): Promise<[Array<WaitListItemEntity>, number]> {
    const queryBuilder = this.waitListItemEntityRepository.createQueryBuilder("wait_list_item");

    queryBuilder.select(["wait_list_item.account", "wait_list_item.listId"]);

    queryBuilder.leftJoin("wait_list_item.list", "wait_list_list");
    queryBuilder.leftJoin("wait_list_list.contract", "wait_list_list_contract");
    queryBuilder.addSelect(["wait_list_list.title", "wait_list_list_contract.address", "wait_list_list.root"]);

    // queryBuilder.andWhere("wait_list_list.root IS NOT NULL");

    queryBuilder.andWhere("wait_list_item.account = :account", { account: userEntity.wallet });
    queryBuilder.andWhere("wait_list_item.waitListItemStatus = :waitListItemStatus", {
      waitListItemStatus: WaitListItemStatus.NEW,
    });

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<WaitListItemEntity>,
    options?: FindOneOptions<WaitListItemEntity>,
  ): Promise<WaitListItemEntity | null> {
    return this.waitListItemEntityRepository.findOne({ where, ...options });
  }

  public async create(dto: IWaitListItemCreateDto): Promise<WaitListItemEntity> {
    const waitListEntity = await this.findOne(dto);

    if (waitListEntity) {
      throw new ConflictException("duplicateAccount");
    }

    return this.waitListItemEntityRepository.create(dto).save();
  }

  public async proof(dto: WaitListProofDto, userEntity: UserEntity): Promise<{ proof: Array<string> }> {
    const waitListEntities = await this.waitListItemEntityRepository.find({
      where: { listId: dto.listId },
    });

    if (waitListEntities.length === 0) {
      throw new NotFoundException("listNotFound");
    }

    const accounts = waitListEntities.map(waitListEntity => waitListEntity.account);

    if (!Object.values(accounts).includes(userEntity.wallet)) {
      throw new NotFoundException("accountNotFound");
    }

    const leaves = accounts.map(account => [account]);
    const merkleTree = StandardMerkleTree.of(leaves, ["address"]);

    const proof = merkleTree.getProof(merkleTree.leafLookup([userEntity.wallet]));

    return { proof };
  }
}
