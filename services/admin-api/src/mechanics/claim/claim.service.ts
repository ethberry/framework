import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { utils, Wallet } from "ethers";

import { ClaimStatus, IClaimSearchDto, TokenType } from "@framework/types";
import { ETHERS_SIGNER } from "@gemunion/nestjs-ethers";

import { IClaimItem } from "./interfaces";
import { ClaimEntity } from "./claim.entity";
import { AssetService } from "../asset/asset.service";
import { TemplateService } from "../../blockchain/hierarchy/template/template.service";
import { TemplateEntity } from "../../blockchain/hierarchy/template/template.entity";
import { SignerService } from "../signer/signer.service";

@Injectable()
export class ClaimService {
  constructor(
    @Inject(ETHERS_SIGNER)
    private readonly signer: Wallet,
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
    @InjectRepository(ClaimEntity)
    private readonly claimEntityRepository: Repository<ClaimEntity>,
    protected readonly assetService: AssetService,
    protected readonly templateService: TemplateService,
    private readonly signerService: SignerService,
  ) {}

  public async search(dto: Partial<IClaimSearchDto>): Promise<[Array<ClaimEntity>, number]> {
    const { skip, take, account } = dto;

    const queryBuilder = this.claimEntityRepository.createQueryBuilder("claim");

    queryBuilder.leftJoinAndSelect("claim.item", "item");
    queryBuilder.leftJoinAndSelect("item.components", "item_components");
    queryBuilder.leftJoinAndSelect("item_components.template", "item_template");
    queryBuilder.leftJoinAndSelect("item_components.contract", "item_contract");

    queryBuilder.select();

    if (account) {
      queryBuilder.andWhere("claim.account ILIKE '%' || :account || '%'", { account });
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

  public async create(dto: IClaimItem): Promise<ClaimEntity> {
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

  public async update(where: FindOptionsWhere<ClaimEntity>, dto: IClaimItem): Promise<ClaimEntity> {
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
    const signature = await this.getSignature(nonce, account, expiresAt, templateEntity, item.components[0].amount);

    Object.assign(claimEntity, { nonce: utils.hexlify(nonce), signature, expiresAt });

    return claimEntity.save();
  }

  public async delete(where: FindOptionsWhere<ClaimEntity>): Promise<DeleteResult> {
    return this.claimEntityRepository.delete(where);
  }

  public async getSignature(
    nonce: Uint8Array,
    account: string,
    expiresAt: number,
    templateEntity: TemplateEntity,
    amount: string,
  ): Promise<string> {
    return this.signerService.getManyToManySignature(
      nonce,
      account,
      templateEntity.id,
      expiresAt,
      [
        {
          tokenType: Object.keys(TokenType).indexOf(templateEntity.contract.contractType),
          token: templateEntity.contract.address,
          tokenId: templateEntity.id.toString(),
          amount,
        },
      ],
      [],
    );
  }
}
