import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { randomBytes, hexlify, ZeroAddress, encodeBytes32String } from "ethers";

import type { IParams } from "@gemunion/nest-js-module-exchange-signer";
import { SignerService } from "@gemunion/nest-js-module-exchange-signer";
import type { IClaimItemCreateDto, IClaimItemUpdateDto } from "@framework/types";
import { ClaimStatus, IClaimSearchDto, TokenType } from "@framework/types";

import { ClaimEntity } from "./claim.entity";
import { UserEntity } from "../../../infrastructure/user/user.entity";
import { AssetService } from "../../exchange/asset/asset.service";

@Injectable()
export class ClaimService {
  constructor(
    @InjectRepository(ClaimEntity)
    private readonly claimEntityRepository: Repository<ClaimEntity>,
    protected readonly assetService: AssetService,
    private readonly signerService: SignerService,
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

  public findOneWithRelations(where: FindOptionsWhere<ClaimEntity>): Promise<ClaimEntity | null> {
    return this.findOne(where, {
      join: {
        alias: "claim",
        leftJoinAndSelect: {
          item: "claim.item",
          item_components: "item.components",
          item_contract: "item_components.contract",
          item_template: "item_components.template",
        },
      },
    });
  }

  public async create(dto: IClaimItemCreateDto, userEntity: UserEntity): Promise<ClaimEntity> {
    const { account, endTimestamp } = dto;

    const assetEntity = await this.assetService.create({
      components: [],
    });

    const claimEntity = await this.claimEntityRepository
      .create({
        account,
        item: assetEntity,
        signature: "0x",
        nonce: "",
        merchantId: userEntity.merchantId,
        endTimestamp,
      })
      .save();

    return this.update({ id: claimEntity.id }, dto, userEntity);
  }

  public async update(
    where: FindOptionsWhere<ClaimEntity>,
    dto: IClaimItemUpdateDto,
    userEntity: UserEntity,
  ): Promise<ClaimEntity> {
    const { account, item, endTimestamp } = dto;

    let claimEntity = await this.findOneWithRelations(where);

    if (!claimEntity) {
      throw new NotFoundException("claimNotFound");
    }

    if (claimEntity.merchantId !== userEntity.merchantId) {
      throw new ForbiddenException("insufficientPermissions");
    }

    // Update only NEW Claims
    if (claimEntity.claimStatus !== ClaimStatus.NEW) {
      throw new BadRequestException("claimRedeemed");
    }

    await this.assetService.update(claimEntity.item, item);

    claimEntity = await this.findOneWithRelations(where);

    if (!claimEntity) {
      throw new NotFoundException("claimNotFound");
    }

    const nonce = randomBytes(32);
    const expiresAt = Math.ceil(new Date(endTimestamp).getTime() / 1000);
    const signature = await this.getSignature(
      account,
      {
        nonce,
        externalId: claimEntity.id,
        expiresAt,
        referrer: ZeroAddress,
        // @TODO fix to use expiresAt as extra, temporary set to empty
        extra: encodeBytes32String("0x"),
      },

      claimEntity,
    );

    Object.assign(claimEntity, { nonce: hexlify(nonce), signature, account, endTimestamp });
    return claimEntity.save();
  }

  public async getSignature(account: string, params: IParams, claimEntity: ClaimEntity): Promise<string> {
    return this.signerService.getManyToManySignature(
      account,
      params,
      claimEntity.item.components.map(component => ({
        tokenType: Object.values(TokenType).indexOf(component.tokenType),
        token: component.contract.address,
        tokenId:
          component.contract.contractType === TokenType.ERC1155
            ? component.template.tokens[0].tokenId
            : (component.templateId || 0).toString(), // suppression types check with 0
        amount: component.amount,
      })),
      [],
    );
  }
}
