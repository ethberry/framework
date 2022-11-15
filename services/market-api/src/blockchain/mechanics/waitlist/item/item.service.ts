import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";

import { IWaitlistItemCreateDto } from "./interfaces";
import { WaitlistItemEntity } from "./item.entity";
import { UserEntity } from "../../../../user/user.entity";
import { WaitlistProofDto } from "./dto";

@Injectable()
export class WaitlistItemService {
  constructor(
    @InjectRepository(WaitlistItemEntity)
    private readonly waitlistItemEntityRepository: Repository<WaitlistItemEntity>,
  ) {}

  public async search(userEntity: UserEntity): Promise<[Array<WaitlistItemEntity>, number]> {
    const { wallet } = userEntity;

    const queryBuilder = this.waitlistItemEntityRepository.createQueryBuilder("waitlist");

    queryBuilder.select(["waitlist.account", "waitlist.listId"]);

    queryBuilder.leftJoin("waitlist.list", "list");
    queryBuilder.addSelect(["list.title"]);

    if (wallet) {
      queryBuilder.andWhere("waitlist.account = :account", { account: wallet });
    }

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<WaitlistItemEntity>,
    options?: FindOneOptions<WaitlistItemEntity>,
  ): Promise<WaitlistItemEntity | null> {
    return this.waitlistItemEntityRepository.findOne({ where, ...options });
  }

  public async create(dto: IWaitlistItemCreateDto): Promise<WaitlistItemEntity> {
    const waitlistEntity = await this.findOne(dto);

    if (waitlistEntity) {
      throw new ConflictException("duplicateAccount");
    }

    return this.waitlistItemEntityRepository.create(dto).save();
  }

  public async proof(dto: WaitlistProofDto, userEntity: UserEntity): Promise<{ proof: Array<string> }> {
    const waitlistEntities = await this.waitlistItemEntityRepository.find({
      where: { listId: dto.listId },
    });

    if (waitlistEntities.length === 0) {
      throw new NotFoundException("listNotFound");
    }

    const accounts = waitlistEntities.map(waitlistEntity => waitlistEntity.account);

    if (!Object.values(accounts).includes(userEntity.wallet)) {
      throw new NotFoundException("accountNotFound");
    }
    // const merkleTree = new MerkleTree(leaves, utils.keccak256, { hashLeaves: true, sortPairs: true });
    const leaves = accounts.map(account => [account]);
    const merkleTree = StandardMerkleTree.of(leaves, ["address"]);
    // const proofHex = merkleTree.getHexProof(utils.keccak256(userEntity.wallet));

    let proofHex: Array<string> = [];
    for (const [i, v] of merkleTree.entries()) {
      if (v[0] === userEntity.wallet) {
        proofHex = merkleTree.getProof(i);
      }
    }
    return { proof: proofHex };
  }
}
