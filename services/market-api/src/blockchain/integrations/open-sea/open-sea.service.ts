import { Injectable, NotFoundException } from "@nestjs/common";
import { ethers } from "ethers";
import { Seaport } from "@opensea/seaport-js";

import { ContractService } from "../../hierarchy/contract/contract.service";

import { TokenService } from "../../hierarchy/token/token.service";
import { UserEntity } from "../../../infrastructure/user/user.entity";
import {
  calculatePricesFees,
  conduitKey,
  getItemType,
  getOpenSeaSigner,
  getPriceType,
} from "../../../common/utils/opensea";
import type { ITokenSellDto } from "./interfaces";

@Injectable()
export class OpenSeaService {
  constructor(
    private readonly tokenService: TokenService,
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
}
