import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { constants, utils } from "ethers";

import { ClaimStatus, TokenType } from "@framework/types";
import { IParams, SignerService } from "@gemunion/nest-js-module-exchange-signer";

import { IClaimItemCreateDto } from "./interfaces";
import { ClaimEntity } from "./claim.entity";
import { AssetService } from "../asset/asset.service";

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

  public async create(dto: IClaimItemCreateDto): Promise<ClaimEntity> {
    const { account } = dto;

    // TODO disallow NATIVE and ERC20

    const assetEntity = await this.assetService.create({
      components: [],
    });

    const claimEntity = await this.claimEntityRepository
      .create({
        account,
        item: assetEntity,
        signature: "0x",
        nonce: "",
      })
      .save();

    return this.update({ id: claimEntity.id }, dto);
  }

  public async update(where: FindOptionsWhere<ClaimEntity>, dto: IClaimItemCreateDto): Promise<ClaimEntity> {
    const { account, item } = dto;

    let claimEntity = await this.findOne(where, {
      join: {
        alias: "claim",
        leftJoinAndSelect: {
          item: "claim.item",
          item_components: "item.components",
        },
      },
    });

    if (!claimEntity) {
      throw new NotFoundException("claimNotFound");
    }

    // Update only NEW Claims
    if (claimEntity.claimStatus !== ClaimStatus.NEW) {
      throw new NotFoundException("claimRedeemed");
    }

    await this.assetService.update(claimEntity.item, item);

    claimEntity = await this.findOne(where, {
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

    if (!claimEntity) {
      throw new NotFoundException("claimNotFound");
    }

    const nonce = utils.randomBytes(32);
    const expiresAt = 0;
    const signature = await this.getSignature(
      account,
      {
        nonce,
        externalId: claimEntity.id,
        expiresAt,
        referrer: constants.AddressZero,
      },

      claimEntity,
    );

    Object.assign(claimEntity, { nonce: utils.hexlify(nonce), signature, expiresAt });

    return claimEntity.save();
  }

  public async getSignature(account: string, params: IParams, claimEntity: ClaimEntity): Promise<string> {
    return this.signerService.getManyToManySignature(
      account,
      params,
      claimEntity.item.components.map(component => ({
        tokenType: Object.keys(TokenType).indexOf(component.tokenType),
        token: component.contract.address,
        tokenId: component.templateId.toString(),
        amount: component.amount,
      })),
      [],
    );
  }
}
