import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { utils } from "ethers";
import { MerkleTree } from "merkletreejs";

import { IWaitlistItemCreateDto } from "./interfaces";
import { WaitlistEntity } from "./waitlist.entity";
import { UserEntity } from "../../../user/user.entity";

@Injectable()
export class WaitlistService {
  constructor(
    @InjectRepository(WaitlistEntity)
    private readonly waitlistEntityRepository: Repository<WaitlistEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<WaitlistEntity>,
    options?: FindOneOptions<WaitlistEntity>,
  ): Promise<WaitlistEntity | null> {
    return this.waitlistEntityRepository.findOne({ where, ...options });
  }

  public async create(dto: IWaitlistItemCreateDto): Promise<WaitlistEntity> {
    const waitlistEntity = await this.findOne(dto);

    if (waitlistEntity) {
      throw new ConflictException("duplicateAccount");
    }

    return this.waitlistEntityRepository.create(dto).save();
  }

  public async proof(userEntity: UserEntity): Promise<{ proof: Array<string> }> {
    const waitlistEntities = await this.waitlistEntityRepository.find({});
    const leaves = waitlistEntities.map(waitlistEntity => waitlistEntity.account).sort();

    const merkleTree = new MerkleTree(leaves, utils.keccak256, { hashLeaves: true, sortPairs: true });

    const proofHex = merkleTree.getHexProof(utils.keccak256(userEntity.wallet));
    return { proof: proofHex };
  }
}
