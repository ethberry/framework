import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { encodeBytes32String, ethers, hexlify, randomBytes, ZeroAddress } from "ethers";

import type { IServerSignature, ISignatureParams } from "@gemunion/types-blockchain";
import { comparator } from "@gemunion/utils";
import { SignerService } from "@framework/nest-js-module-exchange-signer";
import type { ITemplateSignDto } from "@framework/types";
import { ModuleType, SettingsKeys, TokenType } from "@framework/types";

import { SettingsService } from "../../../infrastructure/settings/settings.service";
import { TemplateService } from "../../hierarchy/template/template.service";
import { ContractService } from "../../hierarchy/contract/contract.service";
import { TemplateEntity } from "../../hierarchy/template/template.entity";
import { ContractEntity } from "../../hierarchy/contract/contract.entity";

import { Seaport } from "@opensea/seaport-js";
import { TokenService } from "../../hierarchy/token/token.service";
import type { ITokenSellDto } from "./interfaces";
import { UserEntity } from "../../../infrastructure/user/user.entity";
import {
  calculatePricesFees,
  conduitKey,
  getItemType,
  getOpenSeaSigner,
  getPriceType,
} from "../../../common/utils/opensea";

@Injectable()
export class MarketplaceService {
  constructor(
    private readonly templateService: TemplateService,
    private readonly tokenService: TokenService,
    private readonly signerService: SignerService,
    private readonly settingsService: SettingsService,
    private readonly contractService: ContractService,
  ) {}

  public async sell(dto: ITokenSellDto, userEntity: UserEntity): Promise<any> {
    // TODO get chainId and account from userEntity
    const { chainId, account, /* referrer = ZeroAddress, */ tokenId, /* amount, */ price } = dto;

    // ITEM FOR SALE
    const tokenEntity = await this.tokenService.findOneWithRelations({ id: tokenId }, userEntity);

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    // SALE PRICE
    const priceContractEntity = await this.contractService.findOne(
      { id: price.components[0].contractId },
      { relations: { merchant: true } },
    );

    if (!priceContractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    // SEAPORT
    // TODO make seaport provider?
    const signer = getOpenSeaSigner(chainId);
    const seaport = new Seaport(signer);
    const offerer = account; // address of the NFT owner

    const itemType = getItemType(tokenEntity.template.contract.contractType!);
    const priceType = getPriceType(priceContractEntity.contractType!);

    const expirationTime = Math.round(Date.parse(dto.endTimestamp) / 1000); // seconds
    const startAmount = ethers.formatUnits(price.components[0].amount, priceContractEntity.decimals);
    // CALCULATE PRICES AND FEES
    const prices = calculatePricesFees(startAmount, tokenEntity.template.contract.royalty);

    const seaportOrder = {
      zone: "0x0000000000000000000000000000000000000000",
      zoneHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
      conduitKey,
      startTime: Math.floor(new Date().getTime() / 1000).toString(),
      endTime: expirationTime.toString(),
      offer: [
        {
          itemType,
          token: tokenEntity.template.contract.address,
          identifier: tokenEntity.tokenId,
          amount: 1,
        },
      ],
      consideration: [
        {
          itemType: priceType,
          token: priceContractEntity.address,
          amount: prices!.listing_profit,
          recipient: offerer,
        },
        // TODO it must be actual contract's royalty receiver !!!
        {
          itemType: priceType,
          token: priceContractEntity.address,
          amount: prices!.royalty_fee,
          // recipient: tokenEntity.template.contract.merchant.wallet,
          recipient: "0xf6bd844ed9ebd5fa533d0ae26fd864af6fd61df2",
        },
        {
          itemType: priceType,
          token: priceContractEntity.address,
          amount: prices!.opensea_fee,
          recipient: "0x0000a26b00c1F0DF003000390027140000fAa719", // opensea fee
        },
      ],
    };

    // TODO save to db ?
    // console.log("seaportOrder", seaportOrder);
    const { actions } = await seaport.createOrder(seaportOrder, offerer);
    const response: Array<{ to: string; data: string }> = [];

    if (actions?.length) {
      for (const action of actions) {
        if (action.type === "approval") {
          const approveTx = await action.transactionMethods.buildTransaction();
          response.push(approveTx);
        }
        if (action.type === "create") {
          const order = await action.createOrder();
          const validated = seaport.validate([order]);
          if (validated) {
            const validateTx = await validated.buildTransaction();
            response.push(validateTx);
          }
        }
      }
    }

    return response;
  }

  public async sign(dto: ITemplateSignDto, userEntity: UserEntity): Promise<IServerSignature> {
    const { referrer = ZeroAddress, templateId, amount } = dto;

    const templateEntity = await this.templateService.findOneWithRelations({ id: templateId });

    if (!templateEntity) {
      throw new NotFoundException("templateNotFound");
    }

    // DO REFERRAL LOGIC
    // await this.referralService.referralPurchase(account, referrer, templateEntity.contract.merchantId);

    const cap = BigInt(templateEntity.cap);
    if (cap > 0 && cap <= BigInt(templateEntity.amount)) {
      throw new BadRequestException("limitExceeded");
    }

    const ttl = await this.settingsService.retrieveByKey<number>(SettingsKeys.SIGNATURE_TTL);

    const nonce = randomBytes(32);
    const expiresAt = ttl && ttl + Date.now() / 1000;

    const signature = await this.getSignature(
      await this.contractService.findOneOrFail({ contractModule: ModuleType.EXCHANGE, chainId: userEntity.chainId }),
      userEntity.wallet,
      amount,
      {
        externalId: templateEntity.id,
        expiresAt,
        nonce,
        extra: encodeBytes32String("0x"),
        receiver: templateEntity.contract.merchant.wallet,
        referrer: referrer === null ? ZeroAddress : referrer,
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
        amount: amount || "1",
      },
      templateEntity.price.components.sort(comparator("id")).map(component => ({
        tokenType: Object.values(TokenType).indexOf(component.tokenType),
        token: component.contract.address,
        tokenId: component.template.tokens[0].tokenId,
        amount: (BigInt(component.amount) * BigInt(amount)).toString(),
      })),
    );
  }
}
