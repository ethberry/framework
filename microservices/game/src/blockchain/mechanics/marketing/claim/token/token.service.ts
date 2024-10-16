import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { hexlify, randomBytes, ZeroAddress, ZeroHash } from "ethers";

import type { ISignatureParams } from "@ethberry/types-blockchain";
import { SignerService } from "@framework/nest-js-module-exchange-signer";
import type { IClaimCreateDto, IClaimSearchDto, IClaimUpdateDto } from "@framework/types";
import { ClaimStatus, ClaimType, ModuleType } from "@framework/types";
import { convertDatabaseAssetToChainAsset } from "@framework/exchange";

import { MerchantEntity } from "../../../../../infrastructure/merchant/merchant.entity";
import { AssetService } from "../../../../exchange/asset/asset.service";
import { ContractEntity } from "../../../../hierarchy/contract/contract.entity";
import { ContractService } from "../../../../hierarchy/contract/contract.service";
import { ClaimEntity } from "../claim.entity";

@Injectable()
export class ClaimTokenService {
  constructor(
    @InjectRepository(ClaimEntity)
    private readonly claimEntityRepository: Repository<ClaimEntity>,
    protected readonly assetService: AssetService,
    protected readonly contractService: ContractService,
    private readonly signerService: SignerService,
  ) {}

  public async search(
    dto: Partial<IClaimSearchDto>,
    merchantEntity: MerchantEntity,
  ): Promise<[Array<ClaimEntity>, number]> {
    const { account, claimStatus, chainId, skip, take } = dto;

    const queryBuilder = this.claimEntityRepository.createQueryBuilder("claim");

    queryBuilder.leftJoinAndSelect("claim.item", "item");
    queryBuilder.leftJoinAndSelect("item.components", "item_components");
    queryBuilder.leftJoinAndSelect("item_components.template", "item_template");
    queryBuilder.leftJoinAndSelect("item_template.contract", "item_contract");
    queryBuilder.leftJoinAndSelect("item_components.token", "item_token");

    queryBuilder.select();

    queryBuilder.andWhere("item_contract.chainId = :chainId", {
      chainId,
    });

    queryBuilder.andWhere("claim.merchantId = :merchantId", {
      merchantId: merchantEntity.id,
    });

    queryBuilder.andWhere("claim.claimType = :claimType", {
      claimType: ClaimType.TOKEN,
    });

    if (account) {
      queryBuilder.andWhere("claim.account ILIKE '%' || :account || '%'", { account });
    }

    if (claimStatus) {
      if (claimStatus.length === 1) {
        queryBuilder.andWhere("claim.claimStatus = :claimStatus", { claimStatus: claimStatus[0] });
      } else {
        queryBuilder.andWhere("claim.claimStatus IN(:...claimStatus)", { claimStatus });
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
          merchant: "claim.merchant",
          item: "claim.item",
          item_components: "item.components",
          item_template: "item_components.template",
          item_contract: "item_template.contract",
          item_token: "item_components.token",
        },
      },
    });
  }

  public async create(dto: IClaimCreateDto, merchantEntity: MerchantEntity): Promise<ClaimEntity> {
    const { account, endTimestamp } = dto;

    const assetEntity = await this.assetService.create();
    const claimEntity = await this.claimEntityRepository
      .create({
        account,
        item: assetEntity,
        signature: "0x",
        nonce: "",
        merchantId: merchantEntity.id,
        endTimestamp,
        claimType: ClaimType.TOKEN,
      })
      .save();

    return this.update({ id: claimEntity.id }, dto, merchantEntity);
  }

  public async update(
    where: FindOptionsWhere<ClaimEntity>,
    dto: IClaimUpdateDto,
    merchantEntity: MerchantEntity,
  ): Promise<ClaimEntity> {
    const { account, item, endTimestamp, chainId } = dto;

    let claimEntity = await this.findOneWithRelations(where);

    if (!claimEntity) {
      throw new NotFoundException("claimNotFound");
    }

    if (claimEntity.merchantId !== merchantEntity.id) {
      throw new ForbiddenException("insufficientPermissions");
    }

    // Update only NEW Claims
    if (claimEntity.claimStatus !== ClaimStatus.NEW) {
      throw new BadRequestException("claimRedeemed");
    }

    if (claimEntity.claimType !== ClaimType.TOKEN) {
      throw new BadRequestException("claimWrongType");
    }

    await this.assetService.update(claimEntity.item, item, merchantEntity);

    claimEntity = await this.findOneWithRelations(where);

    if (!claimEntity) {
      throw new NotFoundException("claimNotFound");
    }

    const nonce = randomBytes(32);

    const signature = await this.getSignature(
      await this.contractService.findOneOrFail({ contractModule: ModuleType.EXCHANGE, chainId }),
      account,
      {
        externalId: claimEntity.id,
        expiresAt: Math.ceil(new Date(endTimestamp).getTime() / 1000),
        nonce,
        extra: ZeroHash,
        receiver: claimEntity.merchant.wallet,
        referrer: ZeroAddress,
      },
      claimEntity,
    );

    Object.assign(claimEntity, { nonce: hexlify(nonce), signature, account, endTimestamp });
    return claimEntity.save();
  }

  public async getSignature(
    verifyingContract: ContractEntity,
    account: string,
    params: ISignatureParams,
    claimEntity: ClaimEntity,
  ): Promise<string> {
    const items = convertDatabaseAssetToChainAsset(claimEntity.item.components);
    return this.signerService.getManyToManySignature(verifyingContract, account, params, items, []);
  }
}
