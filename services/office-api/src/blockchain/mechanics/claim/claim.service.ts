import { BadRequestException, Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { constants, utils } from "ethers";
import csv2json from "csvtojson";

import { ClaimStatus, IClaimSearchDto, TokenType } from "@framework/types";
import { IParams, SignerService } from "@gemunion/nest-js-module-exchange-signer";

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

  public async search(dto: Partial<IClaimSearchDto>): Promise<[Array<ClaimEntity>, number]> {
    const { account, claimStatus, merchantId, skip, take } = dto;

    const queryBuilder = this.claimEntityRepository.createQueryBuilder("claim");

    queryBuilder.leftJoinAndSelect("claim.item", "item");
    queryBuilder.leftJoinAndSelect("item.components", "item_components");
    queryBuilder.leftJoinAndSelect("item_components.template", "item_template");
    // queryBuilder.leftJoinAndSelect("item_components.contract", "item_contract");

    queryBuilder.select();

    queryBuilder.andWhere("claim.merchantId = :merchantId", {
      merchantId,
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
          item_template: "item_components.template",
          item_contract: "item_components.contract",
        },
      },
    });
  }

  public async create(dto: IClaimItemCreateDto): Promise<ClaimEntity> {
    const { account, endTimestamp, merchantId } = dto;

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
        merchantId,
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

    const nonce = utils.randomBytes(32);
    const expiresAt = Math.ceil(new Date(endTimestamp).getTime() / 1000);
    const signature = await this.getSignature(
      account,
      {
        nonce,
        externalId: claimEntity.id,
        expiresAt,
        referrer: constants.AddressZero,
        // @TODO fix to use expiresAt as extra, temporary set to empty
        extra: utils.formatBytes32String("0x"),
      },

      claimEntity,
    );

    Object.assign(claimEntity, { nonce: utils.hexlify(nonce), signature, account, endTimestamp });
    return claimEntity.save();
  }

  public async delete(where: FindOptionsWhere<ClaimEntity>): Promise<DeleteResult> {
    const claimEntity = await this.findOne(where);

    if (!claimEntity) {
      throw new NotFoundException("claimNotFound");
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

  public async upload(file: Express.Multer.File): Promise<Array<ClaimEntity>> {
    const parsed = await csv2json({
      noheader: true,
      headers: ["account", "endTimestamp", "tokenType", "contractId", "templateId", "amount"],
    }).fromString(file.buffer.toString());
    return Promise.allSettled(
      parsed.map(
        ({
          account,
          endTimestamp,
          tokenType,
          contractId,
          templateId,
          amount,
        }: {
          account: string;
          endTimestamp: string;
          tokenType: TokenType;
          contractId: number;
          templateId: number;
          amount: string;
        }) => {
          return this.create({
            account,
            endTimestamp,
            item: {
              components: [
                {
                  tokenType,
                  contractId,
                  templateId,
                  amount,
                },
              ],
            },
            // TODO FIXME
            merchantId: 1,
          });
        },
      ),
    ).then(values =>
      values
        .filter(c => c.status === "fulfilled")
        .map(c => <PromiseFulfilledResult<ClaimEntity>>c)
        .map(c => c.value),
    );
  }
}
