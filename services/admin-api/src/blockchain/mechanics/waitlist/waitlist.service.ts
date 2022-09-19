import { ConflictException, NotFoundException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { MerkleTree } from "merkletreejs";
import { utils } from "ethers";

import { IWaitlistSearchDto } from "@framework/types";

import { IWaitlistItemCreateDto } from "./interfaces";
import { WaitlistEntity } from "./waitlist.entity";
import { WaitlistClaimDto, WaitlistGenerateDto } from "./dto";

@Injectable()
export class WaitlistService {
  constructor(
    @InjectRepository(WaitlistEntity)
    private readonly waitlistEntityRepository: Repository<WaitlistEntity>,
  ) {}

  public async search(dto: Partial<IWaitlistSearchDto>): Promise<[Array<WaitlistEntity>, number]> {
    const { skip, take, account } = dto;

    const queryBuilder = this.waitlistEntityRepository.createQueryBuilder("waitlist");

    queryBuilder.select();

    if (account) {
      queryBuilder.andWhere("waitlist.account ILIKE '%' || :account || '%'", { account });
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "waitlist.createdAt": "ASC",
    });

    return queryBuilder.getManyAndCount();
  }

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

  public async delete(where: FindOptionsWhere<WaitlistEntity>): Promise<DeleteResult> {
    return this.waitlistEntityRepository.delete(where);
  }

  public async generate(dto: WaitlistGenerateDto): Promise<{ root: string }> {
    const waitlistEntities = await this.waitlistEntityRepository.find({ where: { listId: dto.listId } });

    if (!waitlistEntities) {
      throw new NotFoundException("listNotFound");
    }

    const leaves = waitlistEntities.map(waitlistEntity => waitlistEntity.account).sort();
    const merkleTree = new MerkleTree(leaves, utils.keccak256, { hashLeaves: true, sortPairs: true });

    return { root: merkleTree.getHexRoot() };
  }

  public async proof(dto: WaitlistClaimDto): Promise<{ proof: Array<string> }> {
    const waitlistEntities = await this.waitlistEntityRepository.find({
      where: { listId: dto.listId },
    });

    if (waitlistEntities.length === 0) {
      throw new NotFoundException("listNotFound");
    }

    const leaves = waitlistEntities.map(waitlistEntity => waitlistEntity.account).sort();

    if (!Object.values(leaves).includes(dto.account)) {
      throw new NotFoundException("accountNotFound");
    }

    const merkleTree = new MerkleTree(leaves, utils.keccak256, { hashLeaves: true, sortPairs: true });
    const proofHex = merkleTree.getHexProof(utils.keccak256(dto.account));

    return { proof: proofHex };
  }
}
