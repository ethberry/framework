import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  LoggerService,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { hexlify, randomBytes, toBeHex, ZeroAddress, zeroPadValue } from "ethers";
import { mapLimit } from "async";

import type { IParams } from "@gemunion/nest-js-module-exchange-signer";
import { SignerService } from "@gemunion/nest-js-module-exchange-signer";
import type { IClaimCreateDto, IClaimSearchDto, IClaimUpdateDto } from "@framework/types";
import { ClaimStatus, ClaimType, TokenType } from "@framework/types";

import { UserEntity } from "../../../infrastructure/user/user.entity";
import { AssetService } from "../../exchange/asset/asset.service";
import { ContractService } from "../../hierarchy/contract/contract.service";
import type { IClaimRowDto, IClaimUploadDto } from "./interfaces";
import { ClaimEntity } from "./claim.entity";

@Injectable()
export class ClaimService {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    @InjectRepository(ClaimEntity)
    private readonly claimEntityRepository: Repository<ClaimEntity>,
    protected readonly assetService: AssetService,
    private readonly signerService: SignerService,
    private readonly contractService: ContractService,
  ) {}

  public async search(dto: Partial<IClaimSearchDto>, userEntity: UserEntity): Promise<[Array<ClaimEntity>, number]> {
    const { account, claimStatus, skip, take } = dto;

    const queryBuilder = this.claimEntityRepository.createQueryBuilder("claim");

    queryBuilder.leftJoinAndSelect("claim.item", "item");
    queryBuilder.leftJoinAndSelect("item.components", "item_components");
    queryBuilder.leftJoinAndSelect("item_components.template", "item_template");
    // queryBuilder.leftJoinAndSelect("item_components.contract", "item_contract");

    queryBuilder.select();

    queryBuilder.andWhere("claim.merchantId = :merchantId", {
      merchantId: userEntity.merchantId,
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
      "claim.createdAt": "ASC",
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

  public async create(dto: IClaimCreateDto, userEntity: UserEntity): Promise<ClaimEntity> {
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
        claimType: ClaimType.TOKEN,
      })
      .save();

    return this.update({ id: claimEntity.id }, dto, userEntity);
  }

  public async update(
    where: FindOptionsWhere<ClaimEntity>,
    dto: IClaimUpdateDto,
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

    if (claimEntity.claimType !== ClaimType.TOKEN) {
      throw new BadRequestException("claimWrongType");
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
        extra: zeroPadValue(toBeHex(Math.ceil(new Date(claimEntity.endTimestamp).getTime() / 1000)), 32),
      },
      claimEntity,
    );

    Object.assign(claimEntity, { nonce: hexlify(nonce), signature, account, endTimestamp });
    return claimEntity.save();
  }

  public async delete(where: FindOptionsWhere<ClaimEntity>, userEntity: UserEntity): Promise<DeleteResult> {
    const claimEntity = await this.findOne(where);

    if (!claimEntity) {
      throw new NotFoundException("claimNotFound");
    }

    if (claimEntity.merchantId !== userEntity.merchantId) {
      throw new ForbiddenException("insufficientPermissions");
    }

    if (claimEntity.claimStatus !== ClaimStatus.NEW) {
      throw new NotFoundException("claimRedeemed");
    }

    return this.claimEntityRepository.delete(where);
  }

  public async getSignature(account: string, params: IParams, claimEntity: ClaimEntity): Promise<string> {
    return this.signerService.getManyToManySignature(
      account,
      params,
      claimEntity.item.components.map(component => ({
        tokenType: Object.values(TokenType).indexOf(component.tokenType),
        token: component.contract.address,
        tokenId: (component.templateId || 0).toString(), // suppression types check with 0
        amount: component.amount,
      })),
      [],
    );
  }

  public async upload(dto: IClaimUploadDto, userEntity: UserEntity): Promise<Array<ClaimEntity>> {
    const { claims } = dto;
    return new Promise(resolve => {
      mapLimit(
        claims,
        10,
        async ({ account, endTimestamp, tokenType, address, templateId, amount }: IClaimRowDto) => {
          const contractEntity = await this.contractService.findOne({
            address,
            merchantId: userEntity.merchantId,
          });

          if (!contractEntity) {
            throw new NotFoundException("contractNotFound");
          }

          return this.create(
            {
              account,
              endTimestamp,
              item: {
                components: [
                  {
                    tokenType,
                    contractId: contractEntity.id,
                    templateId,
                    amount,
                  },
                ],
              },
            },
            userEntity,
          );
        },
        (e, results) => {
          if (e) {
            this.loggerService.error(e, ClaimService.name);
          }
          resolve(results as Array<ClaimEntity>);
        },
      );
    });
  }
}
