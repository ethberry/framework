import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type {
  IPaymentSplitterERC20PaymentReleasedEvent,
  IPaymentSplitterPayeeAddedEvent,
  IPaymentSplitterPaymentReceivedEvent,
  IPaymentSplitterPaymentReleasedEvent,
} from "@framework/types";
import { PaymentSplitterEventType } from "@framework/types";

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
  public addEth(@Payload() event: ILogEvent<IPaymentSplitterPaymentReceivedEvent>, @Ctx() context: Log): Promise<void> {
    return this.paymentSplitterServiceEth.addEth(event, context);
  }

  @EventPattern({ contractType: ContractType.PAYMENT_SPLITTER, eventName: PaymentSplitterEventType.PaymentReleased })
  public releaseEth(
    @Payload() event: ILogEvent<IPaymentSplitterPaymentReleasedEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.paymentSplitterServiceEth.releaseEth(event, context);
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
}
