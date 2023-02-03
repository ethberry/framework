import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { BigNumber, constants, utils } from "ethers";

import type { IServerSignature } from "@gemunion/types-blockchain";
import { ContractFeatures, TokenType } from "@framework/types";
import { IParams, SignerService } from "@framework/nest-js-module-exchange-signer";

import { ISignBreedDto } from "./interfaces";
import { UserEntity } from "../../../ecommerce/user/user.entity";
import { TokenEntity } from "../../hierarchy/token/token.entity";
import { TokenService } from "../../hierarchy/token/token.service";
import { TemplateService } from "../../hierarchy/template/template.service";
import { BreedEntity } from "./breed.entity";

@Injectable()
export class BreedService {
  constructor(
    @InjectRepository(BreedEntity)
    private readonly breedEntityRepository: Repository<BreedEntity>,
    private readonly tokenService: TokenService,
    private readonly templateService: TemplateService,
    private readonly signerService: SignerService,
  ) {}

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

  public async sign(dto: ISignBreedDto, userEntity: UserEntity): Promise<IServerSignature> {
    const { momId, dadId } = dto;
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

    const encodedExternalId = BigNumber.from(
      utils.hexlify(
        utils.concat([
          utils.zeroPad(utils.hexlify(genesis.sireId), 3),
          utils.zeroPad(utils.hexlify(genesis.matronId), 4),
          utils.zeroPad(utils.hexlify(genesis.templateId), 4),
        ]),
      ),
    );

    const nonce = utils.randomBytes(32);
    const expiresAt = 0;
    const signature = await this.getSignature(
      userEntity.wallet,
      {
        nonce,
        externalId: encodedExternalId.toString(),
        expiresAt,
        referrer: constants.AddressZero,
      },
      momTokenEntity.token,
      dadTokenEntity.token,
    );

    return { nonce: utils.hexlify(nonce), signature, expiresAt, bytecode: encodedExternalId.toString() };
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
        tokenType: Object.keys(TokenType).indexOf(momTokenEntity.template.contract.contractType),
        token: momTokenEntity.template.contract.address,
        tokenId: momTokenEntity.tokenId.toString(),
        amount: "1",
      },
      {
        tokenType: Object.keys(TokenType).indexOf(dadTokenEntity.template.contract.contractType),
        token: dadTokenEntity.template.contract.address,
        tokenId: dadTokenEntity.tokenId.toString(),
        amount: "1",
      },
    );
  }

  public findOne(
    where: FindOptionsWhere<BreedEntity>,
    options?: FindOneOptions<BreedEntity>,
  ): Promise<BreedEntity | null> {
    return this.breedEntityRepository.findOne({ where, ...options });
  }

  public findAll(
    where: FindOptionsWhere<BreedEntity>,
    options?: FindOneOptions<BreedEntity>,
  ): Promise<Array<BreedEntity>> {
    return this.breedEntityRepository.find({ where, ...options });
  }
}
