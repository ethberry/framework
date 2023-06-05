import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { ZeroAddress, hexlify, concat, encodeBytes32String, toBeHex, zeroPadValue, randomBytes } from "ethers";

import type { IServerSignature } from "@gemunion/types-blockchain";
import type { IParams } from "@gemunion/nest-js-module-exchange-signer";
import { SignerService } from "@gemunion/nest-js-module-exchange-signer";
import { ContractFeatures, SettingsKeys, TokenType } from "@framework/types";

import { SettingsService } from "../../../infrastructure/settings/settings.service";
import { TokenEntity } from "../../hierarchy/token/token.entity";
import { TokenService } from "../../hierarchy/token/token.service";
import { TemplateService } from "../../hierarchy/template/template.service";
import { BreedEntity } from "./breed.entity";
import { ISignBreedDto } from "./interfaces";

@Injectable()
export class BreedService {
  constructor(
    @InjectRepository(BreedEntity)
    private readonly breedEntityRepository: Repository<BreedEntity>,
    private readonly tokenService: TokenService,
    private readonly templateService: TemplateService,
    private readonly signerService: SignerService,
    private readonly settingsService: SettingsService,
  ) {}

  public findAll(
    where: FindOptionsWhere<BreedEntity>,
    options?: FindOneOptions<BreedEntity>,
  ): Promise<Array<BreedEntity>> {
    return this.breedEntityRepository.find({ where, ...options });
  }

  public findOne(
    where: FindOptionsWhere<BreedEntity>,
    options?: FindOneOptions<BreedEntity>,
  ): Promise<BreedEntity | null> {
    return this.breedEntityRepository.findOne({ where, ...options });
  }

  public findOneWithRelations(where: FindOptionsWhere<BreedEntity>): Promise<BreedEntity | null> {
    return this.findOne(where, {
      join: {
        alias: "breed",
        leftJoinAndSelect: {
          token: "breed.token",
          template: "token.template",
          contract: "template.contract",
        },
      },
    });
  }

  public async getToken(tokenId: number): Promise<TokenEntity> {
    const tokenEntity = await this.tokenService.findOneWithRelations({ id: tokenId });

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    const { contractFeatures } = tokenEntity.template.contract;

    if (!contractFeatures.includes(ContractFeatures.GENES)) {
      throw new BadRequestException("featureIsNotSupported");
    }

    return tokenEntity;
  }

  public async sign(dto: ISignBreedDto): Promise<IServerSignature> {
    const { account, referrer = ZeroAddress, momId, dadId } = dto;
    const momTokenEntity = await this.findOneWithRelations({ tokenId: momId });
    const dadTokenEntity = await this.findOneWithRelations({ tokenId: dadId });

    if (!momTokenEntity || !dadTokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    const genesis = {
      templateId: momTokenEntity.token?.template.id,
      matronId: momTokenEntity.id,
      sireId: dadTokenEntity.id,
    };

    const encodedExternalId = BigInt(
      hexlify(
        concat([
          zeroPadValue(toBeHex(genesis.sireId), 3),
          zeroPadValue(toBeHex(genesis.matronId), 4),
          zeroPadValue(toBeHex(genesis.templateId), 4),
        ]),
      ),
    );

    const ttl = await this.settingsService.retrieveByKey<number>(SettingsKeys.SIGNATURE_TTL);

    const nonce = randomBytes(32);
    const expiresAt = ttl && ttl + Date.now() / 1000;
    const signature = await this.getSignature(
      account,
      {
        nonce,
        externalId: encodedExternalId.toString(),
        expiresAt,
        referrer,
        extra: encodeBytes32String("0x"),
      },
      momTokenEntity.token,
      dadTokenEntity.token,
    );

    return { nonce: hexlify(nonce), signature, expiresAt, bytecode: encodedExternalId.toString() };
  }

  public async getSignature(
    account: string,
    params: IParams,
    momTokenEntity: TokenEntity,
    dadTokenEntity: TokenEntity,
  ): Promise<string> {
    return this.signerService.getOneToOneSignature(
      account,
      params,
      {
        tokenType: Object.values(TokenType).indexOf(momTokenEntity.template.contract.contractType),
        token: momTokenEntity.template.contract.address,
        tokenId: momTokenEntity.tokenId.toString(),
        amount: "1",
      },
      {
        tokenType: Object.values(TokenType).indexOf(dadTokenEntity.template.contract.contractType),
        token: dadTokenEntity.template.contract.address,
        tokenId: dadTokenEntity.tokenId.toString(),
        amount: "1",
      },
    );
  }
}
