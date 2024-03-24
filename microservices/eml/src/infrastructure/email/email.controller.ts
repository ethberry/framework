import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { formatUnits } from "ethers";

import { EmailType } from "@framework/types";
import { IEmailResult, MailjetService } from "@gemunion/nest-js-module-mailjet";

import type { IDummyPayload, IPayload, IStakingBalancePayload, IVrfPayload } from "./interfaces";

@Controller()
export class EmailController {
  constructor(private readonly mailjetService: MailjetService) {}

  @EventPattern(EmailType.DUMMY)
  async welcome(@Payload() payload: IDummyPayload): Promise<IEmailResult> {
    return this.mailjetService.sendTemplate({
      template: 4921134,
      to: [payload.user.email],
      data: {
        displayName: payload.user.displayName,
      },
    });
  }

  @EventPattern(EmailType.FEEDBACK)
  async feedback(@Payload() payload: IPayload): Promise<any> {
    return this.mailjetService.sendTemplate({
      template: 4921119,
      to: ["trejgun@gemunion.io"],
      data: {
        displayName: payload.user.displayName,
        text: payload.feedback.text,
      },
    });
  }

  @EventPattern(EmailType.INVITE)
  async invite(@Payload() payload: IPayload): Promise<any> {
    return this.mailjetService.sendTemplate({
      template: 5074828,
      to: [payload.invitee.email],
      data: {
        displayName: payload.user.displayName,
        companyName: payload.user.merchant.title,
        code: payload.otp.uuid,
        link: `${payload.baseUrl}/invitations/accept/${payload.otp.uuid}`,
      },
    });
  }

  // INTEGRATION:CHAIN-LINK
  @EventPattern(EmailType.LINK_TOKEN)
  async linkToken(@Payload() payload: IVrfPayload): Promise<IEmailResult> {
    return this.mailjetService.sendTemplate({
      template: 4921143,
      to: [payload.merchant.email],
      data: {
        vrfSubId: payload.merchant.chainLinkSubscriptions![0].vrfSubId.toString(),
        chainId: payload.chainId.toString(),
      },
    });
  }

  // STAKING
  @EventPattern(EmailType.STAKING_BALANCE)
  async stakingBalance(@Payload() payload: IStakingBalancePayload): Promise<IEmailResult> {
    return this.mailjetService.sendTemplate({
      template: 5292694,
      to: [payload.contract.merchant!.email],
      data: {
        // STAKING
        stakingTitle: payload.contract.title,
        stakingAddress: payload.contract.address,
        // TOKEN
        tokenTitle: payload.token.template!.title,
        tokenAddress: payload.token.template!.contract!.address,
        // BALANCES
        tokenBalance: formatUnits(payload.balance, payload.token.template!.contract!.decimals),
        depositAmount: formatUnits(payload.deposit, payload.token.template!.contract!.decimals),
        // CHAIN_ID
        chainId: payload.contract.chainId.toString(),
      },
    });
  }
}
