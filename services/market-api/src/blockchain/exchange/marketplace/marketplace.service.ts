import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { hexlify, randomBytes, toBeHex, ZeroAddress, ZeroHash, zeroPadValue } from "ethers";

import type { IServerSignature, ISignatureParams } from "@ethberry/types-blockchain";
import { SignerService } from "@framework/nest-js-module-exchange-signer";
import { ContractFeatures, ITemplateSignDto, ModuleType, SettingsKeys } from "@framework/types";
import { convertDatabaseAssetToChainAsset, convertTemplateToChainAsset } from "@framework/exchange";

import { SettingsService } from "../../../infrastructure/settings/settings.service";
import { UserEntity } from "../../../infrastructure/user/user.entity";
import { TemplateService } from "../../hierarchy/template/template.service";
import { ContractService } from "../../hierarchy/contract/contract.service";
import { TemplateEntity } from "../../hierarchy/template/template.entity";
import { ContractEntity } from "../../hierarchy/contract/contract.entity";

@Injectable()
export class MarketplaceService {
  constructor(
    private readonly templateService: TemplateService,
    private readonly signerService: SignerService,
    private readonly settingsService: SettingsService,
    private readonly contractService: ContractService,
  ) {}

  public async sign(dto: ITemplateSignDto, userEntity: UserEntity): Promise<IServerSignature> {
    const { referrer = ZeroAddress, templateId, amount } = dto;

    const templateEntity = await this.templateService.findOneWithRelations({ id: templateId });

    if (!templateEntity) {
      throw new NotFoundException("templateNotFound");
    }

    const cap = BigInt(templateEntity.cap);
    if (cap > 0 && cap <= BigInt(templateEntity.amount)) {
      throw new BadRequestException("limitExceeded");
    }

    const ttl = await this.settingsService.retrieveByKey<number>(SettingsKeys.SIGNATURE_TTL);

    const nonce = randomBytes(32);
    const expiresAt = ttl && ttl + Date.now() / 1000;

    // TODO genes should come from template
    const extra = templateEntity.contract?.contractFeatures.includes(ContractFeatures.GENES)
      ? zeroPadValue(toBeHex(107914390657248203931494128369229995047683281774584692748922102830935711579232n), 32)
      : ZeroHash;

    const signature = await this.getSignature(
      await this.contractService.findOneOrFail({ contractModule: ModuleType.EXCHANGE, chainId: userEntity.chainId }),
      userEntity.wallet,
      amount,
      {
        externalId: templateEntity.id,
        expiresAt,
        nonce,
        extra,
        receiver: templateEntity.contract.merchant.wallet,
        referrer,
      },
      templateEntity,
    );

    return { nonce: hexlify(nonce), signature, expiresAt };
  }

  public async getSignature(
    verifyingContract: ContractEntity,
    account: string,
    amount: string,
    params: ISignatureParams,
    templateEntity: TemplateEntity,
  ): Promise<string> {
    const item = convertTemplateToChainAsset(templateEntity, amount);
    const price = convertDatabaseAssetToChainAsset(templateEntity.price.components, amount);

    return this.signerService.getOneToManySignature(verifyingContract, account, params, item, price);
  }
}
