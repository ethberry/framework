import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { AbiCoder, hexlify, keccak256, randomBytes, ZeroAddress, ZeroHash } from "ethers";

import type { IServerSignature, ISignatureParams } from "@ethberry/types-blockchain";
import { SignerService } from "@framework/nest-js-module-exchange-signer";
import type { IMysteryBoxSignDto } from "@framework/types";
import { ModuleType, RatePlanType, SettingsKeys, TokenType } from "@framework/types";
import { convertDatabaseAssetToChainAsset } from "@framework/exchange";

import { SettingsService } from "../../../../../infrastructure/settings/settings.service";
import { MerchantEntity } from "../../../../../infrastructure/merchant/merchant.entity";
import { ContractService } from "../../../../hierarchy/contract/contract.service";
import { ContractEntity } from "../../../../hierarchy/contract/contract.entity";
import { MysteryBoxService } from "../box/box.service";
import { MysteryBoxEntity } from "../box/box.entity";

@Injectable()
export class MysterySignService {
  constructor(
    private readonly mysteryBoxService: MysteryBoxService,
    private readonly contractService: ContractService,
    private readonly signerService: SignerService,
    private readonly settingsService: SettingsService,
  ) {}

  public async sign(dto: IMysteryBoxSignDto, merchantEntity: MerchantEntity): Promise<IServerSignature> {
    const { account, referrer = ZeroAddress, mysteryBoxId, chainId } = dto;

    if (merchantEntity.ratePlan === RatePlanType.BRONZE) {
      throw new ForbiddenException("insufficientPermissions");
    }

    const mysteryBoxEntity = await this.mysteryBoxService.findOneWithRelationsOrFail(
      { id: mysteryBoxId },
      merchantEntity,
    );

    const cap = BigInt(mysteryBoxEntity.template.cap);
    if (cap > 0 && cap <= BigInt(mysteryBoxEntity.template.amount)) {
      throw new BadRequestException("limitExceeded");
    }

    const ttl = await this.settingsService.retrieveByKey<number>(SettingsKeys.SIGNATURE_TTL);

    const nonce = randomBytes(32);
    const expiresAt = ttl && ttl + Date.now() / 1000;

    const signature = await this.getSignature(
      await this.contractService.findOneOrFail({ contractModule: ModuleType.EXCHANGE, chainId }),
      account,
      {
        externalId: mysteryBoxEntity.id,
        expiresAt,
        nonce,
        extra: ZeroHash,
        receiver: mysteryBoxEntity.template.contract.merchant.wallet,
        referrer,
      },
      mysteryBoxEntity,
    );

    return { nonce: hexlify(nonce), signature, expiresAt };
  }

  public async getSignature(
    verifyingContract: ContractEntity,
    account: string,
    params: ISignatureParams,
    mysteryBoxEntity: MysteryBoxEntity,
  ): Promise<string> {
    const content = convertDatabaseAssetToChainAsset(mysteryBoxEntity.content.components);
    const price = convertDatabaseAssetToChainAsset(mysteryBoxEntity.template.price.components);

    return this.signerService.getOneToManyToManySignature(
      verifyingContract,
      account,
      params,
      {
        tokenType: Object.values(TokenType).indexOf(TokenType.ERC721),
        token: mysteryBoxEntity.template.contract.address,
        tokenId: mysteryBoxEntity.templateId.toString(),
        amount: "1",
      },
      price,
      content,
      keccak256(AbiCoder.defaultAbiCoder().encode([], [])),
    );
  }
}
