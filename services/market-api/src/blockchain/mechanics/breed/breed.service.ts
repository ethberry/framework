import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { constants, utils } from "ethers";

import type { IServerSignature } from "@gemunion/types-collection";
import { ContractFeatures, TokenType } from "@framework/types";
import { IParams, SignerService } from "@gemunion/nest-js-module-exchange-signer";

import { ISignBreedDto } from "./interfaces";
import { UserEntity } from "../../../user/user.entity";
import { TokenEntity } from "../../hierarchy/token/token.entity";
import { TokenService } from "../../hierarchy/token/token.service";
import { TemplateService } from "../../hierarchy/template/template.service";

@Injectable()
export class BreedService {
  constructor(
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

  public async sign(dto: ISignBreedDto, userEntity: UserEntity): Promise<IServerSignature> {
    const { momId, dadId } = dto;

    const momTokenEntity = await this.getToken(momId);
    const dadTokenEntity = await this.getToken(dadId);

    // TODO mix genes;

    const templateEntity = await this.templateService.findOne({ id: 307001 });
    if (!templateEntity) {
      throw new NotFoundException("templateNotFound");
    }

    const nonce = utils.randomBytes(32);
    const expiresAt = 0;
    const signature = await this.getSignature(
      userEntity.wallet,
      {
        nonce,
        externalId: templateEntity.id,
        expiresAt,
        referrer: constants.AddressZero,
      },
      momTokenEntity,
      dadTokenEntity,
    );

    return { nonce: utils.hexlify(nonce), signature, expiresAt };
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
}
