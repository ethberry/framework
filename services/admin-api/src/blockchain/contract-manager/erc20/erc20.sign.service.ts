import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { hexlify, randomBytes, Wallet } from "ethers";

import { ETHERS_SIGNER } from "@ethberry/nest-js-module-ethers-gcp";
import type { IServerSignature } from "@ethberry/types-blockchain";
import type { IErc20TokenDeployDto } from "@framework/types";
import { Erc20ContractTemplates, ModuleType, TokenType } from "@framework/types";

import { UserEntity } from "../../../infrastructure/user/user.entity";
import { RatePlanService } from "../../../infrastructure/rate-plan/rate-plan.service";
import { ContractService } from "../../hierarchy/contract/contract.service";
import { getContractABI } from "../utils";

@Injectable()
export class ContractManagerErc20SignService {
  constructor(
    @Inject(ETHERS_SIGNER)
    private readonly signer: Wallet,
    private readonly contractService: ContractService,
    private readonly planService: RatePlanService,
  ) {}

  public async deploy(dto: IErc20TokenDeployDto, userEntity: UserEntity): Promise<IServerSignature> {
    const nonce = randomBytes(32);
    const { bytecode } = await this.getBytecodeByErc20ContractTemplates(dto, userEntity.chainId);

    await this.planService.validateDeployment(userEntity, ModuleType.HIERARCHY, TokenType.ERC20);

    const signature = await this.signer.signTypedData(
      // Domain
      {
        name: ModuleType.CONTRACT_MANAGER,
        version: "1.0.0",
        chainId: userEntity.chainId,
        verifyingContract: await this.contractService
          .findOneOrFail({ contractModule: ModuleType.CONTRACT_MANAGER, chainId: userEntity.chainId })
          .then(({ address }) => address),
      },
      // Types
      {
        EIP712: [
          { name: "params", type: "Params" },
          { name: "args", type: "Erc20Args" },
        ],
        Params: [
          { name: "nonce", type: "bytes32" },
          { name: "bytecode", type: "bytes" },
          { name: "externalId", type: "uint256" },
        ],
        Erc20Args: [
          { name: "name", type: "string" },
          { name: "symbol", type: "string" },
          { name: "cap", type: "uint256" },
          { name: "contractTemplate", type: "string" },
        ],
      },
      // Values
      {
        params: {
          nonce,
          bytecode,
          externalId: userEntity.id,
        },
        args: {
          contractTemplate: Object.values(Erc20ContractTemplates).indexOf(dto.contractTemplate).toString(),
          name: dto.name,
          symbol: dto.symbol,
          cap: dto.cap,
        },
      },
    );

    return { nonce: hexlify(nonce), signature, expiresAt: 0, bytecode };
  }

  public getBytecodeByErc20ContractTemplates(dto: IErc20TokenDeployDto, chainId: number) {
    const { contractTemplate } = dto;

    switch (contractTemplate) {
      case Erc20ContractTemplates.BLACKLIST:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/ERC20/ERC20Blacklist.sol/ERC20Blacklist.json",
          chainId,
        );
      case Erc20ContractTemplates.WHITELIST:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/ERC20/ERC20Whitelist.sol/ERC20Whitelist.json",
          chainId,
        );
      case Erc20ContractTemplates.SIMPLE:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/ERC20/ERC20Simple.sol/ERC20Simple.json",
          chainId,
        );
      case Erc20ContractTemplates.VOTES:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/ERC20/ERC20Wotes.sol/ERC20Wotes.json",
          chainId,
        );
      default:
        throw new NotFoundException("templateNotFound");
    }
  }
}
