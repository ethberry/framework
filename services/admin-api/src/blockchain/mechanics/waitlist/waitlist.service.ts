import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { MerkleTree } from "merkletreejs";
import { utils } from "ethers";

import { IWaitlistSearchDto } from "@framework/types";

import { IWaitlistItemCreateDto } from "./interfaces";
import { WaitlistEntity } from "./waitlist.entity";

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

  public async generate(): Promise<{ proof: string }> {
    const waitlistEntities = await this.waitlistEntityRepository.find({});

    const leaves = waitlistEntities.map(waitlistEntity => waitlistEntity.account).map(x => utils.keccak256(x));

    const merkleTree = new MerkleTree(leaves, utils.keccak256);

    return { proof: merkleTree.getHexRoot() };
  }

  public async proof(): Promise<{ proof: string }> {
    const waitlistEntities = await this.waitlistEntityRepository.find({});
    console.log("waitlistEntities[0]", waitlistEntities[0]);
    const leaves = waitlistEntities.map(waitlistEntity => waitlistEntity.account).map(x => utils.keccak256(x));

    const merkleTree = new MerkleTree(leaves, utils.keccak256);

    // const prf = merkleTree.getProof(leaves[0]);
    // console.log("prf", prf);
    console.log("leaves", leaves);
    // const root = merkleTree.getRoot();
    // const proof = merkleTree.getProof(leaves[0]);
    const proofHex = merkleTree.getHexProof(leaves[0]);
    console.log("proofHex", proofHex);
    // console.log("proof", proof);
    // const verified = merkleTree.verify(proof, leaves[0], root);
    // console.log("verified", verified);
    // const proofdata = utils.hexlify(proof[0].data);
    // console.log("proofdata", proofdata);
    return { proof: proofHex[0] };
  }
}
