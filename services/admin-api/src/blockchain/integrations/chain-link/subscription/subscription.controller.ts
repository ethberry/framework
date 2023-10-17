import { Controller, Get, Param, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { AddressPipe, ApiAddress, NotFoundInterceptor, User } from "@gemunion/nest-js-utils";

import { ChainLinkSubscriptionService } from "./subscription.service";
import { ChainLinkSubscriptionEntity } from "./subscription.entity";
import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { SubscriptionAutocompleteDto } from "./dto";

@ApiBearerAuth()
@Controller("/chain-link/subscriptions")
export class ChainLinkSubscriptionController {
  constructor(private readonly chainLinkSubscriptionService: ChainLinkSubscriptionService) {}

  @Get("/autocomplete")
  public autocomplete(
    // @Query() dto: SubscriptionAutocompleteDto,
    @Query() dto: any,
    @User() userEntity: UserEntity,
  ): Promise<Array<ChainLinkSubscriptionEntity>> {
    return this.chainLinkSubscriptionService.autocomplete(dto, userEntity);
  }

  @ApiAddress("address")
  @Get("/:address")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("address", AddressPipe) address: string): Promise<Array<ChainLinkSubscriptionEntity>> {
    return this.chainLinkSubscriptionService.findAll(
      { merchant: { wallet: address } },
      { relations: { merchant: true }, order: { vrfSubId: "ASC" } },
    );
  }
}
