import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import type { IStakingBalanceWithdrawEvent } from "@framework/types";

import { EventHistoryService } from "../../../event-history/event-history.service";
import { TokenType, RmqProviderType, SignalEventType } from "@framework/types";
import { StakingPenaltyService } from "../penalty/penalty.service";
import { AssetService } from "../../../exchange/asset/asset.service";
import { TemplateService } from "../../../hierarchy/template/template.service";
import { TemplateEntity } from "../../../hierarchy/template/template.entity";
import { TokenService } from "../../../hierarchy/token/token.service";
import { TokenEntity } from "../../../hierarchy/token/token.entity";

@Injectable()
export class StakingContractServiceEth {
  constructor(
    @Inject(RmqProviderType.SIGNAL_SERVICE)
    protected readonly signalClientProxy: ClientProxy,
    private readonly stakingPenaltyService: StakingPenaltyService,
    private readonly assetService: AssetService,
    private readonly templateService: TemplateService,
    private readonly tokenService: TokenService,
    private readonly eventHistoryService: EventHistoryService,
  ) {}

  public async balanceWithdraw(event: ILogEvent<IStakingBalanceWithdrawEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { owner, item },
    } = event;
    const { tokenType, token, tokenId, amount } = item;
    const { address, transactionHash } = context;

    const isNft =
      Object.values(TokenType)[Number(tokenType)] === TokenType.ERC721 ||
      Object.values(TokenType)[Number(tokenType)] === TokenType.ERC998;

    let penaltyTemplate: TemplateEntity | null;
    let penaltyToken: TokenEntity | null = null;

    // FIND PENALTY TEMPLATE OR TOKEN (for ERC721 and ERC998)
    if (isNft) {
      penaltyToken = await this.tokenService.getToken(tokenId, token.toLowerCase());
      if (!penaltyToken) {
        throw new NotFoundException("penaltyTokenNotFound");
      }
      penaltyTemplate = penaltyToken.template;
    } else {
      penaltyTemplate = await this.templateService.findOne({ id: Number(tokenId) }, { relations: { contract: true } });
    }

    if (!penaltyTemplate) {
      throw new NotFoundException("penaltyTemplateNotFound");
    }

    // FIND EXISTING PENALTY
    const penaltyEntity = await this.stakingPenaltyService.findOne(
      { staking: { address: address.toLowerCase() } },
      { relations: { penalty: { components: { template: true, contract: true } }, staking: { merchant: true } } },
    );

    if (penaltyEntity) {
      await this.eventHistoryService.updateHistory(event, context, void 0, penaltyEntity.stakingId);
      // remove withdrawn balance from existing penalty asset
      const oldAssetEntity = penaltyEntity.penalty;
      await this.assetService.updateAsset(oldAssetEntity, {
        tokenType: penaltyTemplate.contract.contractType!,
        contractId: penaltyTemplate.contractId,
        templateId: penaltyTemplate.id,
        tokenId: isNft ? penaltyToken!.id : null,
        amount: `-${amount}`, // decrement
      });
    } else {
      await this.eventHistoryService.updateHistory(event, context);
    }

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        // TODO remove check
        account: owner ? owner.toLowerCase() : penaltyEntity?.staking.merchant.wallet,
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }
}
