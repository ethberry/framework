import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";

import { IWaitListItemCreateDto } from "./interfaces";
import { WaitListItemEntity } from "./item.entity";
import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { WaitListProofDto } from "./dto";
import { WaitListStatus } from "@framework/types";

@Injectable()
export class WaitListItemService {
  constructor(
    @InjectRepository(WaitListItemEntity)
    private readonly waitlistItemEntityRepository: Repository<WaitListItemEntity>,
  ) {}

  public async search(userEntity: UserEntity): Promise<[Array<WaitListItemEntity>, number]> {
    const queryBuilder = this.waitlistItemEntityRepository.createQueryBuilder("wait_list_item");

    queryBuilder.select(["wait_list_item.account", "wait_list_item.listId"]);

    queryBuilder.leftJoin("wait_list_item.list", "wait_list_list");
    queryBuilder.addSelect(["wait_list_list.title"]);

    queryBuilder.andWhere("wait_list_item.account = :account", { account: userEntity.wallet });
    queryBuilder.andWhere("wait_list_item.waitListStatus = :waitListStatus", { waitListStatus: WaitListStatus.NEW });

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<WaitListItemEntity>,
    options?: FindOneOptions<WaitListItemEntity>,
  ): Promise<WaitListItemEntity | null> {
    return this.waitlistItemEntityRepository.findOne({ where, ...options });
  }

  public async create(dto: IWaitListItemCreateDto): Promise<WaitListItemEntity> {
    const waitListEntity = await this.findOne(dto);

    if (waitListEntity) {
      throw new ConflictException("duplicateAccount");
    }

    return this.waitlistItemEntityRepository.create(dto).save();
  }

  public async proof(dto: WaitListProofDto, userEntity: UserEntity): Promise<{ proof: Array<string> }> {
    const waitListEntities = await this.waitlistItemEntityRepository.find({
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
