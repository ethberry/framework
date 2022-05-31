import { Injectable } from "@nestjs/common";

import { EthersContractService } from "@gemunion/nestjs-ethers";

import { ICreateListenerPayload } from "./interfaces";

@Injectable()
export class Erc20LogService {
  constructor(private readonly ethersContractService: EthersContractService) {}

  public addListener(dto: ICreateListenerPayload): void {
    this.ethersContractService.updateListener([dto.address], dto.fromBlock);
  }
}
