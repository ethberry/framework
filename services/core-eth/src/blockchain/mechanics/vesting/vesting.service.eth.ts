import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";
import { Log, ZeroAddress } from "ethers";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import type {
  IOwnershipTransferredEvent,
  IVestingERC20ReleasedEvent,
  IVestingEtherReceivedEvent,
  IVestingEtherReleasedEvent,
} from "@framework/types";
import { testChainId } from "@framework/constants";

import { ContractService } from "../../hierarchy/contract/contract.service";
import { EventHistoryService } from "../../event-history/event-history.service";
import { TokenService } from "../../hierarchy/token/token.service";
import { BalanceService } from "../../hierarchy/balance/balance.service";
import { NotificatorService } from "../../../game/notificator/notificator.service";
import { RmqProviderType, SignalEventType } from "@framework/types";

@Injectable()
export class VestingServiceEth {
  constructor(
    @Inject(RmqProviderType.SIGNAL_SERVICE)
    protected readonly signalClientProxy: ClientProxy,
    private readonly eventHistoryService: EventHistoryService,
    private readonly contractService: ContractService,
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
    private readonly balanceService: BalanceService,
    private readonly notificatorService: NotificatorService,
  ) {}

  public async erc20Released(event: ILogEvent<IVestingERC20ReleasedEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { token, amount },
    } = event;
    const { transactionHash, address } = context;

    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));
    const vestingEntity = await this.contractService.findOne(
      { address: address.toLowerCase(), chainId },
      { relations: { merchant: true } },
    );

    if (!vestingEntity) {
      throw new NotFoundException("vestingNotFound");
    }

    await this.eventHistoryService.updateHistory(event, context, void 0, vestingEntity.id);

    const contractEntity = await this.contractService.findOne({ address: token.toLowerCase(), chainId });

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    await this.notificatorService.vestingRelease({
      vesting: vestingEntity,
      token: contractEntity,
      amount,
    });

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: vestingEntity.merchant.wallet.toLowerCase(),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }

  public async ethReleased(event: ILogEvent<IVestingEtherReleasedEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { amount },
    } = event;
    const { transactionHash, address } = context;

    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));
    const vestingEntity = await this.contractService.findOne(
      { address: address.toLowerCase(), chainId },
      { relations: { merchant: true } },
    );

    if (!vestingEntity) {
      throw new NotFoundException("vestingNotFound");
    }

    await this.eventHistoryService.updateHistory(event, context, void 0, vestingEntity.id);

    // get NATIVE token
    const tokenEntity = await this.tokenService.getToken("0", ZeroAddress.toLowerCase(), chainId);

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.balanceService.decrement(tokenEntity.id, context.address.toLowerCase(), amount);

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: vestingEntity.merchant.wallet.toLowerCase(),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }

  public async ethReceived(event: ILogEvent<IVestingEtherReceivedEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { amount },
    } = event;
    const { transactionHash, address } = context;

    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));
    const vestingEntity = await this.contractService.findOne(
      { address: address.toLowerCase(), chainId },
      { relations: { merchant: true } },
    );

    if (!vestingEntity) {
      throw new NotFoundException("vestingNotFound");
    }

    await this.eventHistoryService.updateHistory(event, context, void 0, vestingEntity.id);

    // get NATIVE token
    const tokenEntity = await this.tokenService.getToken("0", ZeroAddress, chainId);

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.balanceService.increment(tokenEntity.id, context.address.toLowerCase(), amount);

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: vestingEntity.merchant.wallet.toLowerCase(),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }

  public async ownershipChanged(event: ILogEvent<IOwnershipTransferredEvent>, context: Log): Promise<void> {
    // history and notifications processed by AccessControlServiceEth
    // await this.eventHistoryService.updateHistory(event, context);
    const {
      args: { newOwner, previousOwner },
    } = event;
    const { address } = context;

    const vestingEntity = await this.contractService.findOne({ address: address.toLowerCase() });
    if (!vestingEntity) {
      throw new NotFoundException("vestingNotFound");
    }

    const vestingParams = vestingEntity.parameters;
    if (vestingParams.account && vestingParams.account === previousOwner.toLowerCase()) {
      Object.assign(vestingParams, { account: newOwner.toLowerCase() });
      Object.assign(vestingEntity, { parameters: vestingParams });
      await vestingEntity.save();
    }
  }
}
