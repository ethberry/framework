import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import {
  Erc1363EventType,
  IContractManagerCommonDeployedEvent,
  type IErc1363TransferReceivedEvent,
  IPaymentSplitterERC20PaymentReleasedEvent,
  IPaymentSplitterPayeeAddedEvent,
  IPaymentSplitterPaymentReceivedEvent,
  IPaymentSplitterPaymentReleasedEvent,
} from "@framework/types";
import { ContractManagerEventType, PaymentSplitterEventType } from "@framework/types";

import { ContractType } from "../../../../utils/contract-type";
import { PaymentSplitterServiceEth } from "./payment-splitter.service.eth";

@Controller()
export class PaymentSplitterControllerEth {
  constructor(private readonly paymentSplitterServiceEth: PaymentSplitterServiceEth) {}

  @EventPattern({ contractType: ContractType.PAYMENT_SPLITTER, eventName: PaymentSplitterEventType.PayeeAdded })
  public addPayee(@Payload() event: ILogEvent<IPaymentSplitterPayeeAddedEvent>, @Ctx() context: Log): Promise<void> {
    return this.paymentSplitterServiceEth.addPayee(event, context);
  }

  @EventPattern({ contractType: ContractType.PAYMENT_SPLITTER, eventName: PaymentSplitterEventType.PaymentReceived })
  public paymentReceived(
    @Payload() event: ILogEvent<IPaymentSplitterPaymentReceivedEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.paymentSplitterServiceEth.paymentReceived(event, context);
  }

  @EventPattern({ contractType: ContractType.PAYMENT_SPLITTER, eventName: PaymentSplitterEventType.PaymentReleased })
  public paymentReleased(
    @Payload() event: ILogEvent<IPaymentSplitterPaymentReleasedEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.paymentSplitterServiceEth.paymentReleased(event, context);
  }

  @EventPattern({
    contractType: ContractType.PAYMENT_SPLITTER,
    eventName: PaymentSplitterEventType.ERC20PaymentReleased,
  })
  public releaseErc20(
    @Payload() event: ILogEvent<IPaymentSplitterERC20PaymentReleasedEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.paymentSplitterServiceEth.releaseErc20(event, context);
  }

  @EventPattern({ contractType: ContractType.PAYMENT_SPLITTER, eventName: Erc1363EventType.TransferReceived })
  public transferReceived(
    @Payload() event: ILogEvent<IErc1363TransferReceivedEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.paymentSplitterServiceEth.transferReceived(event, context);
  }

  @EventPattern({
    contractType: ContractType.CONTRACT_MANAGER,
    eventName: ContractManagerEventType.PaymentSplitterDeployed,
  })
  public deploy(@Payload() event: ILogEvent<IContractManagerCommonDeployedEvent>, @Ctx() context: Log): Promise<void> {
    return this.paymentSplitterServiceEth.deploy(event, context);
  }
}
