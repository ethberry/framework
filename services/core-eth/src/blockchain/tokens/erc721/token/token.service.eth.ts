import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { constants, providers, Wallet } from "ethers";
import { Log } from "@ethersproject/abstract-provider";
import { ETHERS_RPC, ETHERS_SIGNER, ILogEvent } from "@gemunion/nestjs-ethers";

import {
  ContractEventType,
  IERC721RandomRequestEvent,
  IERC721TokenMintRandomEvent,
  IERC721TokenTransferEvent,
  TokenAttributes,
  TokenStatus,
} from "@framework/types";

import { ABI } from "./log/interfaces";
import { getMetadata, callRandom } from "../../../../common/utils";
import { ContractHistoryService } from "../../../contract-history/contract-history.service";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { TemplateService } from "../../../hierarchy/template/template.service";
import { TokenService } from "../../../hierarchy/token/token.service";
import { BalanceService } from "../../../hierarchy/balance/balance.service";
import { TokenServiceEth } from "../../../hierarchy/token/token.service.eth";
import { AssetService } from "../../../mechanics/asset/asset.service";
import { BreedServiceEth } from "../../../mechanics/breed/breed.service.eth";

@Injectable()
export class Erc721TokenServiceEth extends TokenServiceEth {
  constructor(
    @Inject(Logger)
    protected readonly loggerService: LoggerService,
    @Inject(ETHERS_RPC)
    protected readonly jsonRpcProvider: providers.JsonRpcProvider,
    @Inject(ETHERS_SIGNER)
    protected readonly ethersSignerProvider: Wallet,
    protected readonly configService: ConfigService,
    protected readonly contractService: ContractService,
    protected readonly tokenService: TokenService,
    protected readonly templateService: TemplateService,
    protected readonly balanceService: BalanceService,
    protected readonly assetService: AssetService,
    protected readonly breedServiceEth: BreedServiceEth,
    protected readonly contractHistoryService: ContractHistoryService,
  ) {
    super(loggerService, jsonRpcProvider, contractService, tokenService, contractHistoryService);
  }

  public async transfer(event: ILogEvent<IERC721TokenTransferEvent>, context: Log): Promise<void> {
    const {
      args: { from, to, tokenId },
    } = event;
    const { address, transactionHash } = context;

    // Mint token create
    if (from === constants.AddressZero) {
      const attributes = await getMetadata(tokenId, address, ABI, this.jsonRpcProvider);
      const templateId = ~~attributes[TokenAttributes.TEMPLATE_ID];
      const templateEntity = await this.templateService.findOne({ id: templateId }, { relations: { contract: true } });
      if (!templateEntity) {
        throw new NotFoundException("templateNotFound");
      }

      const tokenEntity = await this.tokenService.create({
        tokenId,
        attributes: JSON.stringify(attributes),
        royalty: templateEntity.contract.royalty,
        templateId: templateEntity.id,
      });
      await this.balanceService.increment(tokenEntity.id, to.toLowerCase(), "1");
      await this.assetService.updateAssetHistory(transactionHash, tokenEntity.id);

      // if RANDOM token - update tokenId in exchange asset history
      if (attributes[TokenAttributes.RARITY] || attributes[TokenAttributes.GENES]) {
        const historyEntity = await this.contractHistoryService.findOne({
          transactionHash,
          eventType: ContractEventType.MintRandom,
        });
        if (!historyEntity) {
          throw new NotFoundException("historyNotFound");
        }
        const eventData = historyEntity.eventData as IERC721TokenMintRandomEvent;
        await this.assetService.updateAssetHistoryRandom(eventData.requestId, tokenEntity.id);
      }

      // MODULE:BREEDING
      if (attributes[TokenAttributes.GENES]) {
        await this.breedServiceEth.newborn(
          tokenEntity.id,
          attributes[TokenAttributes.GENES],
          context.transactionHash.toLowerCase(),
        );
      }
    }

    const erc721TokenEntity = await this.tokenService.getToken(tokenId, address.toLowerCase());

    if (!erc721TokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.updateHistory(event, context, void 0, erc721TokenEntity.id);

    if (from === constants.AddressZero) {
      erc721TokenEntity.template.amount += 1;
      erc721TokenEntity.tokenStatus = TokenStatus.MINTED;
    } else if (to === constants.AddressZero) {
      erc721TokenEntity.tokenStatus = TokenStatus.BURNED;
    } else {
      // change token's owner
      erc721TokenEntity.balance[0].account = to.toLowerCase();
    }

    await erc721TokenEntity.save();
    // need to save updates in nested entities too
    await erc721TokenEntity.template.save();
    await erc721TokenEntity.balance[0].save();
  }

  public async mintRandom(event: ILogEvent<IERC721TokenMintRandomEvent>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }

  public async randomRequest(event: ILogEvent<IERC721RandomRequestEvent>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
    // DEV ONLY
    const nodeEnv = this.configService.get<string>("NODE_ENV", "development");
    if (nodeEnv === "development") {
      const {
        args: { requestId },
      } = event;
      const { address } = context;
      const vrfAddr = this.configService.get<string>("VRF_ADDR", "");
      await callRandom(vrfAddr, address, requestId, this.ethersSignerProvider);
    }
  }
}
