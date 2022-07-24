import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { utils, Wallet } from "ethers";

import { ETHERS_SIGNER } from "@gemunion/nestjs-ethers";
import { ClaimStatus, TokenType } from "@framework/types";
import { SignerService } from "@gemunion/nest-js-module-exchange-signer";

import { TemplateService } from "../../blockchain/hierarchy/template/template.service";
import { ClaimEntity } from "./claim.entity";
import { IClaimItemCreateDto } from "./interfaces";
import { AssetService } from "../asset/asset.service";

@Injectable()
export class ClaimService {
  constructor(
    @Inject(ETHERS_SIGNER)
    private readonly signer: Wallet,
    private readonly configService: ConfigService,
    private readonly templateService: TemplateService,
    private readonly signerService: SignerService,
    private readonly assetService: AssetService,
    @InjectRepository(ClaimEntity)
    private readonly claimEntityRepository: Repository<ClaimEntity>,
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

    const claimEntity = await this.findOne(where, {
      join: {
        alias: "claim",
        leftJoinAndSelect: {
          item: "claim.item",
          components: "item.components",
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

    const templateEntity = await this.templateService.findOne(
      { id: item.components[0].templateId },
      { relations: { contract: true } },
    );
    if (!templateEntity) {
      throw new NotFoundException("templateNotFound");
    }

    const nonce = utils.randomBytes(32);
    const expiresAt = 0;
    const signature = await this.getSignature(nonce, account, expiresAt, claimEntity);

    Object.assign(claimEntity, { nonce: utils.hexlify(nonce), signature, expiresAt });

    return claimEntity.save();
  }

  public async getSignature(
    nonce: Uint8Array,
    account: string,
    expiresAt: number,
    claimEntity: ClaimEntity,
  ): Promise<string> {
    return this.signerService.getManyToManySignature(
      nonce,
      account,
      claimEntity.id,
      expiresAt,
      claimEntity.item.components.map(component => ({
        tokenType: Object.keys(TokenType).indexOf(component.tokenType),
        token: component.contract.address,
        tokenId: component.template.tokens[0].tokenId,
        amount: component.amount,
      })),
      [],
    );
  }
}
