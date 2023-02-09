import { Injectable } from "@nestjs/common";

import { EthersContractService } from "@gemunion/nestjs-ethers";
import { TokenType } from "@framework/types";

import { ICreateListenerPayload } from "../../../common/interfaces";
import { ContractService } from "../../../blockchain/hierarchy/contract/contract.service";

@Injectable()
export class ChainLinkLogService {
  constructor(
    private readonly ethersContractService: EthersContractService,
    private readonly contractService: ContractService,
  ) {}

  public addListener(dto: ICreateListenerPayload): void {
    this.ethersContractService.updateListener(dto.address, dto.fromBlock);
  }

  public async updateBlock(): Promise<number> {
    const lastBlock = this.ethersContractService.getLastBlockOption();
    return this.contractService.updateLastBlockByTokenType(TokenType.ERC721, lastBlock);
  }
}
