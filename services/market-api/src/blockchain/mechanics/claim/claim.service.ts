import { Injectable, NotFoundException } from "@nestjs/common";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { ClaimStatus, IClaimSearchDto, TokenType } from "@framework/types";

import { ClaimEntity } from "./claim.entity";
import { IClaimCreateDto } from "./interfaces";

@Injectable()
export class ClaimService {
  constructor(
    @InjectRepository(ClaimEntity)
    private readonly claimEntityRepository: Repository<ClaimEntity>,
  ) {}

  public async search(dto: Partial<IClaimSearchDto>): Promise<[Array<ClaimEntity>, number]> {
    const { skip, take, account, claimStatus, templateIds } = dto;

    const queryBuilder = this.claimEntityRepository.createQueryBuilder("claim");

    queryBuilder.select();

    queryBuilder.andWhere("claim.account = :account", { account });

    queryBuilder.leftJoinAndSelect("claim.item", "item");
    queryBuilder.leftJoinAndSelect("item.components", "item_components");
    queryBuilder.leftJoinAndSelect("item_components.template", "item_template");
    queryBuilder.leftJoinAndSelect("item_components.contract", "item_contract");
    // we need to get single token for Native, erc20 and erc1155
    queryBuilder.leftJoinAndSelect(
      "item_template.tokens",
      "item_tokens",
      "item_contract.contractType IN(:...tokenTypes)",
      { tokenTypes: [TokenType.NATIVE, TokenType.ERC20, TokenType.ERC1155] },
    );

    if (claimStatus) {
      if (claimStatus.length === 1) {
        queryBuilder.andWhere("claim.claimStatus = :claimStatus", { claimStatus: claimStatus[0] });
      } else {
        queryBuilder.andWhere("claim.claimStatus IN(:...claimStatus)", { claimStatus });
      }
    }

    if (templateIds) {
      if (templateIds.length === 1) {
        queryBuilder.andWhere("claim.templateId = :templateId", {
          templateId: templateIds[0],
        });
      } else {
        queryBuilder.andWhere("claim.templateId IN(:...templateIds)", { templateIds });
      }
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "claim.createdAt": "DESC",
    });

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<ClaimEntity>,
    options?: FindOneOptions<ClaimEntity>,
  ): Promise<ClaimEntity | null> {
    return this.claimEntityRepository.findOne({ where, ...options });
  }

  public async create(dto: IClaimCreateDto): Promise<ClaimEntity> {
    const { account, itemId, endTimestamp, merchantId } = dto;

    return await this.claimEntityRepository
      .create({
        account,
        itemId,
        signature: "0x",
        nonce: "",
        merchantId,
        endTimestamp,
        claimStatus: ClaimStatus.NEW,
      })
      .save();
  }

  public async update(
    where: FindOptionsWhere<ClaimEntity>,
    dto: Partial<ClaimEntity>,
  ): Promise<ClaimEntity | undefined> {
    const claimEntity = await this.claimEntityRepository.findOne({ where });

    if (!claimEntity) {
      throw new NotFoundException("claimNotFound");
    }

    Object.assign(claimEntity, dto);

    return claimEntity.save();
  }

  // public async updateClaim(dto: Partial<IClaimCreateDto>): Promise<ClaimEntity> {
  //   const { account, itemId, endTimestamp, nonce, signature, merchantId } = dto;
  //
  //   // TODO check user.merchant ?
  //   // if (merchantId !== userEntity.merchantId) {
  //   //   throw new ForbiddenException("insufficientPermissions");
  //   // }
  //   return await this.claimEntityRepository
  //     .create({
  //       account,
  //       itemId,
  //       signature,
  //       nonce,
  //       merchantId,
  //       endTimestamp,
  //       claimStatus: ClaimStatus.NEW,
  //     })
  //     .save();
  // }
}
