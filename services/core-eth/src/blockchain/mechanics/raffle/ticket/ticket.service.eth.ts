import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JsonRpcProvider, Log, ZeroAddress } from "ethers";

import { ETHERS_RPC, ILogEvent } from "@gemunion/nestjs-ethers";
import { IERC721TokenTransferEvent, TokenStatus } from "@framework/types";
import { testChainId } from "@framework/constants";

import { RaffleTicketService } from "./ticket.service";
import { RaffleRoundService } from "../round/round.service";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { TemplateService } from "../../../hierarchy/template/template.service";
import { TokenService } from "../../../hierarchy/token/token.service";
import { BalanceService } from "../../../hierarchy/balance/balance.service";
import { EventHistoryService } from "../../../event-history/event-history.service";
import { TokenEntity } from "../../../hierarchy/token/token.entity";
import { getMetadata } from "../../../../common/utils";
import { ABI } from "../../../tokens/erc721/token/log/interfaces";
import { AssetService } from "../../../exchange/asset/asset.service";

@Injectable()
export class RaffleTicketServiceEth {
  public raffleAddr: string;

  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    @Inject(ETHERS_RPC)
    protected readonly jsonRpcProvider: JsonRpcProvider,
    private readonly raffleTicketService: RaffleTicketService,
    private readonly raffleRoundService: RaffleRoundService,
    private readonly eventHistoryService: EventHistoryService,
    protected readonly assetService: AssetService,
    private readonly contractService: ContractService,
    private readonly templateService: TemplateService,
    private readonly tokenService: TokenService,
    protected readonly balanceService: BalanceService,
    private readonly configService: ConfigService,
  ) {
    this.raffleAddr = configService.get<string>("ERC721_RAFFLE_ADDR", "0x");
  }

  public async transfer(event: ILogEvent<IERC721TokenTransferEvent>, context: Log): Promise<void> {
    const {
      args: { from, to, tokenId },
    } = event;
    const { address, transactionHash } = context;

    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));

    const erc721TokenEntity =
      from === ZeroAddress
        ? await this.createTicketToken(address, tokenId, to, transactionHash)
        : await this.tokenService.getToken(tokenId, address.toLowerCase(), chainId, true);

    if (!erc721TokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.eventHistoryService.updateHistory(event, context, erc721TokenEntity.id);

    if (to === ZeroAddress) {
      erc721TokenEntity.tokenStatus = TokenStatus.BURNED;
      await erc721TokenEntity.save();
    } else if (to !== ZeroAddress && from !== ZeroAddress) {
      // change token's owner
      erc721TokenEntity.balance[0].account = to.toLowerCase();
      // need to save updates in nested entities too
      await erc721TokenEntity.balance[0].save();
      await erc721TokenEntity.save();
    }
  }

  public async createTicketToken(
    contract: string,
    tokenId: string,
    account: string,
    transactionHash: string,
  ): Promise<TokenEntity> {
    // default RAFFLE Ticket Template 1110101
    const templateEntity = await this.templateService.findOne(
      {
        contract: { address: contract.toLowerCase() },
      },
      { relations: { contract: true } },
    );

    if (!templateEntity) {
      throw new NotFoundException("ticketTemplateNotFound");
    }

    const metadata = await getMetadata(tokenId, contract, ABI, this.jsonRpcProvider, this.loggerService);

    const tokenEntity = await this.tokenService.create({
      tokenId,
      metadata,
      royalty: templateEntity.contract.royalty,
      templateId: templateEntity.id,
      tokenStatus: TokenStatus.MINTED,
    });

    await this.balanceService.increment(tokenEntity.id, account.toLowerCase(), "1");
    await this.assetService.updateAssetHistory(transactionHash, tokenEntity.id);

    return tokenEntity;
  }
}
