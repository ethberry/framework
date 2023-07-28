import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { ConfigService } from "@nestjs/config";
import { WeiPerEther, Contract, Wallet } from "ethers";
import { ClientProxy } from "@nestjs/microservices";
import { IsNull, Not } from "typeorm";
import { ETHERS_SIGNER } from "@gemunion/nest-js-module-ethers-gcp";
import { testChainId } from "@framework/constants";

import { EmailType, RmqProviderType } from "@framework/types";

import VrfSol from "@framework/core-contracts/artifacts/@gemunion/contracts-chain-link-v2/contracts/mocks/VRFCoordinator.sol/VRFCoordinatorMock.json";

import { ContractService } from "../../hierarchy/contract/contract.service";
import { MerchantService } from "../../../infrastructure/merchant/merchant.service";

@Injectable()
export class ChainLinkServiceCron {
  constructor(
    @Inject(ETHERS_SIGNER)
    private readonly signer: Wallet,
    @Inject(RmqProviderType.EML_SERVICE)
    private readonly emailClientProxy: ClientProxy,
    @Inject(Logger)
    protected readonly loggerService: LoggerService,
    private readonly contractService: ContractService,
    private readonly configService: ConfigService,
    private readonly merchantService: MerchantService,
  ) {}

  // TODO set up checking schedule and check parameters (minimum balance)
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  public async checkBalance(): Promise<void> {
    const minimum = WeiPerEther * 5n; // TODO set(get) minBalance from VRF contract parameters or settings?
    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));

    const vrfAddr = this.configService.get<string>("VRF_ADDR", "");
    const vrfContract = new Contract(vrfAddr, VrfSol.abi, this.signer);

    // get all subscription ids
    const merchantsWithSubs = await this.merchantService.findAll(
      { subscriptions: { vrfSubId: Not(IsNull()), chainId } },
      { select: { email: true, subscriptions: true }, relations: { subscriptions: true } },
    );

    if (merchantsWithSubs.length > 0) {
      await Promise.allSettled(
        merchantsWithSubs.map(async merchantEntity => {
          try {
            // must be only one VRF subscription per one chainId
            const { balance } = await vrfContract.getSubscription(merchantEntity.subscriptions[0].vrfSubId);

            if (minimum >= BigInt(balance)) {
              return this.emailClientProxy
                .emit<void>(EmailType.LINK_TOKEN, {
                  merchant: merchantEntity,
                })
                .toPromise();
            }
          } catch (e) {
            this.loggerService.error(e, ChainLinkServiceCron.name);
          }
        }),
      );
    }
  }
}
