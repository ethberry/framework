// import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
//
// import { EthersContractService } from "@gemunion/nestjs-ethers";
// import { ICreateListenerPayload } from "./interfaces";
//
// @Injectable()
// export class BlockchainService {
//   constructor(
//     @Inject(Logger)
//     private readonly loggerService: LoggerService,
//     private readonly ethersContractService: EthersContractService,
//   ) {}
//
//   public addListener(dto: ICreateListenerPayload): void {
//     this.ethersContractService.updateListener(dto.address, dto.fromBlock);
//   }
// }
