import { BadRequestException, Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { ZeroAddress, randomBytes, encodeBytes32String, hexlify } from "ethers";

import type { IParams } from "@gemunion/nest-js-module-exchange-signer";
import { SignerService } from "@gemunion/nest-js-module-exchange-signer";
import { ClaimStatus, TokenType } from "@framework/types";

import { IClaimItemCreateDto, IClaimItemUpdateDto } from "./interfaces";
import { ClaimEntity } from "./claim.entity";
import { AssetService } from "../../exchange/asset/asset.service";

@Injectable()
export class ClaimService {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    @InjectRepository(ClaimEntity)
    private readonly claimEntityRepository: Repository<ClaimEntity>,
    protected readonly assetService: AssetService,
    private readonly signerService: SignerService,
  ) {}

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
          item_template: "item_components.template",
          item_contract: "item_components.contract",
        },
      },
    });
  }

  public async create(dto: IClaimItemCreateDto): Promise<ClaimEntity> {
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
        endTimestamp,
      })
      .save();

    return this.update({ id: claimEntity.id }, dto);
  }

  public async update(where: FindOptionsWhere<ClaimEntity>, dto: IClaimItemUpdateDto): Promise<ClaimEntity> {
    const { account, item, endTimestamp } = dto;

    let claimEntity = await this.findOneWithRelations(where);

    if (!claimEntity) {
      throw new NotFoundException("claimNotFound");
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
        tokenId: component.templateId.toString(),
        amount: component.amount,
      })),
      [],
    );
  }
}
