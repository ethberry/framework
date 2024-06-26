import { BadRequestException, Injectable } from "@nestjs/common";
import { encodeBytes32String, hexlify, randomBytes, ZeroAddress } from "ethers";

import type { IServerSignature } from "@gemunion/types-blockchain";
import type { IParams } from "@framework/nest-js-module-exchange-signer";
import { SignerService } from "@framework/nest-js-module-exchange-signer";
import type { ITemplateSignDto } from "@framework/types";
import { ModuleType, SettingsKeys, TokenType } from "@framework/types";

import { SettingsService } from "../../../infrastructure/settings/settings.service";
import { TemplateService } from "../../hierarchy/template/template.service";
import { TemplateEntity } from "../../hierarchy/template/template.entity";
import { ContractEntity } from "../../hierarchy/contract/contract.entity";
import { ContractService } from "../../hierarchy/contract/contract.service";
import { MerchantEntity } from "../../../infrastructure/merchant/merchant.entity";

@Injectable()
export class MarketplaceService {
  constructor(
    private readonly contractService: ContractService,
    private readonly templateService: TemplateService,
    private readonly signerService: SignerService,
    private readonly settingsService: SettingsService,
  ) {}

  public async sign(dto: ITemplateSignDto, merchantEntity: MerchantEntity): Promise<IServerSignature> {
    const { account, referrer = ZeroAddress, templateId, chainId } = dto;
    const templateEntity = await this.templateService.findOneAndCheckMerchant({ id: templateId }, merchantEntity);

    const cap = BigInt(templateEntity.cap);
    if (cap > 0 && cap <= BigInt(templateEntity.amount)) {
      throw new BadRequestException("limitExceeded");
    }

    const ttl = await this.settingsService.retrieveByKey<number>(SettingsKeys.SIGNATURE_TTL);

    const nonce = randomBytes(32);
    const expiresAt = ttl && ttl + Date.now() / 1000;
    const signature = await this.getSignature(
      await this.contractService.findOneOrFail({ contractModule: ModuleType.EXCHANGE, chainId }),
      account,
      {
        externalId: templateEntity.id,
        expiresAt,
        nonce,
        extra: encodeBytes32String("0x"),
        receiver: ZeroAddress,
        referrer,
      },
      templateEntity,
    );

    return { nonce: hexlify(nonce), signature, expiresAt };
  }

  public async getSignature(
    verifyingContract: ContractEntity,
    account: string,
    params: IParams,
    templateEntity: TemplateEntity,
  ): Promise<string> {
    return this.signerService.getOneToManySignature(
      verifyingContract,
      account,
      params,
      {
        tokenType: Object.values(TokenType).indexOf(templateEntity.contract.contractType!),
        token: templateEntity.contract.address,
        tokenId:
          templateEntity.contract.contractType === TokenType.ERC1155
            ? templateEntity.tokens[0].tokenId
            : templateEntity.id.toString(),
        amount: "1",
      },
      templateEntity.price.components.map(component => ({
        tokenType: Object.values(TokenType).indexOf(component.tokenType),
        token: component.contract.address,
        // pass templateId instead of tokenId = 0
        tokenId:
          component.template.tokens[0].tokenId === "0"
            ? component.template.tokens[0].templateId.toString()
            : component.template.tokens[0].tokenId,
        amount: component.amount,
      })),
    );
  }
}
