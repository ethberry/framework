import { Controller, Get, Param, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { AddressPipe, ApiAddress, NotFoundInterceptor, User } from "@gemunion/nest-js-utils";

import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { ChainLinkSubscriptionService } from "./subscription.service";
import { ChainLinkSubscriptionEntity } from "./subscription.entity";

@ApiBearerAuth()
@Controller("/chain-link/subscriptions")
export class ChainLinkSubscriptionController {
  constructor(private readonly chainLinkSubscriptionService: ChainLinkSubscriptionService) {}

  @Get("/autocomplete")
  public autocomplete(@User() userEntity: UserEntity): Promise<Array<ChainLinkSubscriptionEntity>> {
    return this.chainLinkSubscriptionService.autocomplete(userEntity);
  }

  @ApiAddress("address")
  @Get("/:address")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("address", AddressPipe) address: string): Promise<Array<ChainLinkSubscriptionEntity>> {
    return this.chainLinkSubscriptionService.findAll(
      { merchant: { wallet: address.toLowerCase() } },
      { relations: { merchant: true }, order: { vrfSubId: "ASC" } },
    );
  }
}
