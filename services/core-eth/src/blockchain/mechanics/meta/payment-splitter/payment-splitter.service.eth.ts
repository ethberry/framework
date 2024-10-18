import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Log, ZeroAddress } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import {
  IContractManagerCommonDeployedEvent,
  type IErc1363TransferReceivedEvent,
  IPaymentSplitterERC20PaymentReleasedEvent,
  IPaymentSplitterPayeeAddedEvent,
  IPaymentSplitterPaymentReceivedEvent,
  IPaymentSplitterPaymentReleasedEvent,
  RmqProviderType,
  SignalEventType,
} from "@framework/types";

import { ContractService } from "../../../hierarchy/contract/contract.service";
import { BalanceService } from "../../../hierarchy/balance/balance.service";
import { TokenService } from "../../../hierarchy/token/token.service";
import { EventHistoryService } from "../../../event-history/event-history.service";
import { PayeesService } from "./payee/payees.service";
import { PaymentSplitterServiceLog } from "./payment-splitter.service.log";

@Injectable()
export class PaymentSplitterServiceEth {
  constructor(
    @Inject(RmqProviderType.SIGNAL_SERVICE)
    protected readonly signalClientProxy: ClientProxy,
    private readonly payeesService: PayeesService,
    private readonly contractService: ContractService,
    private readonly tokenService: TokenService,
    private readonly balanceService: BalanceService,
    private readonly eventHistoryService: EventHistoryService,
    private readonly paymentSplitterServiceLog: PaymentSplitterServiceLog,
  ) {}

  public async addPayee(event: ILogEvent<IPaymentSplitterPayeeAddedEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { account, shares },
    } = event;
    const { address, transactionHash } = context;

    await this.eventHistoryService.updateHistory(event, context);

    const contractEntity = await this.contractService.findOne(
      { address: address.toLowerCase() },
      { relations: { merchant: true } },
    );

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    await this.payeesService.create({
      account: account.toLowerCase(),
      shares: Number(shares),
      contractId: contractEntity.id,
    });

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: contractEntity.merchant.wallet.toLowerCase(),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }

  public async paymentReceived(event: ILogEvent<IPaymentSplitterPaymentReceivedEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { amount },
    } = event;
    const { address, transactionHash } = context;

    await this.eventHistoryService.updateHistory(event, context);

    const tokenEntity = await this.tokenService.getToken("0", ZeroAddress);

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.balanceService.increment(tokenEntity.id, address.toLowerCase(), amount);

    const contractEntity = await this.contractService.findOne(
      { address: address.toLowerCase() },
      { relations: { merchant: true } },
    );

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: contractEntity.merchant.wallet.toLowerCase(),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }

  public async paymentReleased(event: ILogEvent<IPaymentSplitterPaymentReleasedEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { amount },
    } = event;
    const { address, transactionHash } = context;

    await this.eventHistoryService.updateHistory(event, context);

    const tokenEntity = await this.tokenService.getToken("0", ZeroAddress);

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.balanceService.decrement(tokenEntity.id, address.toLowerCase(), amount);

    const contractEntity = await this.contractService.findOne(
      { address: address.toLowerCase() },
      { relations: { merchant: true } },
    );

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: contractEntity.merchant.wallet.toLowerCase(),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }

  public async transferReceived(event: ILogEvent<IErc1363TransferReceivedEvent>, context: Log): Promise<void> {
    const { name } = event;
    const { address, transactionHash } = context;

    await this.eventHistoryService.updateHistory(event, context);
    // Balance will be updated by Erc20 module

    const contractEntity = await this.contractService.findOne(
      { address: address.toLowerCase() },
      { relations: { merchant: true } },
    );

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: contractEntity.merchant.wallet.toLowerCase(),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }

  public async releaseErc20(event: ILogEvent<IPaymentSplitterERC20PaymentReleasedEvent>, context: Log): Promise<void> {
    const { name } = event;
    const { address, transactionHash } = context;

    await this.eventHistoryService.updateHistory(event, context);
    // Balance will be updated by Erc20 module

    const contractEntity = await this.contractService.findOne(
      { address: address.toLowerCase() },
      { relations: { merchant: true } },
    );

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: contractEntity.merchant.wallet.toLowerCase(),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }

  public async deploy(event: ILogEvent<IContractManagerCommonDeployedEvent>, context: Log): Promise<void> {
    const {
      args: { account },
    } = event;

    this.paymentSplitterServiceLog.updateRegistry([account]);

    await this.paymentSplitterServiceLog.readLastBlock([account], parseInt(context.blockNumber.toString(), 16));
  }
}
