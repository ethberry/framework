import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { hexlify, randomBytes, toBeHex, zeroPadValue } from "ethers";

import type { ISignatureParams } from "@gemunion/types-blockchain";
import { comparator } from "@gemunion/utils";
import { SignerService } from "@framework/nest-js-module-exchange-signer";
import type { IClaimCreateDto, IClaimSearchDto, IClaimUpdateDto } from "@framework/types";
import { ClaimStatus, ClaimType, ModuleType, TokenType } from "@framework/types";

import { ClaimEntity } from "./claim.entity";
import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { AssetService } from "../../../exchange/asset/asset.service";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { ContractEntity } from "../../../hierarchy/contract/contract.entity";

@Injectable()
export class ClaimService {
  constructor(
    @InjectRepository(ClaimEntity)
    private readonly claimEntityRepository: Repository<ClaimEntity>,
    protected readonly assetService: AssetService,
    protected readonly contractService: ContractService,
    private readonly signerService: SignerService,
  ) {}

  public async search(dto: Partial<IClaimSearchDto>, userEntity: UserEntity): Promise<[Array<ClaimEntity>, number]> {
    const { skip, take, /* account, */ claimStatus, claimType } = dto;

    const queryBuilder = this.claimEntityRepository.createQueryBuilder("claim");

    // queryBuilder.andWhere("claim.account = :account", { account });
    queryBuilder.andWhere("claim.account = :account", { account: userEntity.wallet });

    queryBuilder.leftJoinAndSelect("claim.merchant", "merchant");

    queryBuilder.leftJoinAndSelect("claim.item", "item");
    queryBuilder.leftJoinAndSelect("item.components", "item_components");
    queryBuilder.leftJoinAndSelect("item_components.template", "item_template");
    queryBuilder.leftJoinAndSelect("item_components.contract", "item_contract");
    queryBuilder.leftJoinAndSelect("item_components.token", "item_token");

    queryBuilder.select();

    queryBuilder.andWhere("item_contract.chainId = :chainId", {
      chainId: userEntity.chainId,
    });

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

    if (claimType) {
      if (claimType.length === 1) {
        queryBuilder.andWhere("claim.claimType = :claimType", { claimType: claimType[0] });
      } else {
        queryBuilder.andWhere("claim.claimType IN(:...claimType)", { claimType });
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
          item_contract: "item_components.contract",
          item_template: "item_components.template",
          item_token: "item_components.token",
        },
      },
    });
  }

  public async create(dto: IClaimCreateDto, userEntity: UserEntity): Promise<ClaimEntity> {
    const { account, endTimestamp, item } = dto;

    // create new asset and update it with actual item
    // const assetEntity = await this.assetService.create();
    // await this.assetService.update(assetEntity, { components: dto.item.components });

    const claimEntity = await this.claimEntityRepository
      .create({
        account,
        item,
        signature: "0x",
        nonce: "",
        merchantId: userEntity.merchantId,
        endTimestamp,
      })
      .save();

    return this.update({ id: claimEntity.id }, dto, userEntity);
  }

  public async createEmpty(
    account: string,
    merchantId: number,
    itemId: number,
    claimType: ClaimType,
  ): Promise<ClaimEntity> {
    return this.claimEntityRepository
      .create({
        account,
        itemId,
        signature: "0x",
        nonce: "",
        merchantId,
        endTimestamp: new Date(0).toISOString(),
        claimType,
      })
      .save();
  }

  public async update(
    where: FindOptionsWhere<ClaimEntity>,
    dto: IClaimUpdateDto,
    userEntity: UserEntity,
  ): Promise<ClaimEntity> {
    const { account, endTimestamp, chainId } = dto;

    const claimEntity = await this.findOneWithRelations(where);
    if (!claimEntity) {
      throw new NotFoundException("claimNotFound");
    }

    // check permissions
    if (claimEntity.account !== userEntity.wallet) {
      throw new ForbiddenException("insufficientPermissions");
    }

    // Update only NEW Claims
    if (claimEntity.claimStatus !== ClaimStatus.NEW) {
      throw new BadRequestException("claimRedeemed");
    }

    const nonce = randomBytes(32);
    const expiresAt = Math.ceil(new Date(endTimestamp).getTime() / 1000);
    const signature = await this.getSignature(
      await this.contractService.findOneOrFail({ contractModule: ModuleType.EXCHANGE, chainId }),
      account,
      {
        externalId: claimEntity.id,
        expiresAt,
        nonce,
        extra: zeroPadValue(toBeHex(Math.ceil(new Date(endTimestamp).getTime() / 1000)), 32),
        receiver: claimEntity.merchant.wallet,
        referrer: zeroPadValue(toBeHex(Object.values(ClaimType).indexOf(claimEntity.claimType)), 20),
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
    return this.signerService.getManyToManySignature(
      verifyingContract,
      account,
      params,
      claimEntity.item.components
        .slice()
        .sort(comparator("id"))
        .map(component => ({
          tokenType: Object.values(TokenType).indexOf(component.tokenType),
          token: component.contract.address,
          tokenId:
            component.contract.contractType === TokenType.ERC1155
              ? component.template.tokens[0].tokenId
              : claimEntity.claimType === ClaimType.TEMPLATE
                ? (component.templateId || 0).toString()
                : (component.token.tokenId || 0).toString(), // suppression types check with 0
          amount: component.amount,
        })),
      [],
    );
  }
}
