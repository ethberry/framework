import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  LoggerService,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { concat, hexlify, toBeHex, zeroPadValue } from "ethers";
import { mapLimit } from "async";
import type { IClaimSearchDto, IVestingClaimCreateDto } from "@framework/types";
import { ClaimStatus, ClaimType } from "@framework/types";

import { ContractManagerSignService } from "../../../contract-manager/contract-manager.sign.service";
import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { ClaimEntity } from "../../claim/claim.entity";
import type { IVestingClaimRow, IVestingClaimUpdateDto, IVestingClaimUploadDto } from "./interfaces";
import { AssetService } from "../../../exchange/asset/asset.service";
import { ContractService } from "../../../hierarchy/contract/contract.service";

@Injectable()
export class VestingClaimService {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    @InjectRepository(ClaimEntity)
    private readonly claimEntityRepository: Repository<ClaimEntity>,
    private readonly assetService: AssetService,
    private readonly contractManagerSignService: ContractManagerSignService,
    private readonly contractService: ContractService,
  ) {}

  public async search(dto: Partial<IClaimSearchDto>, userEntity: UserEntity): Promise<[Array<ClaimEntity>, number]> {
    const { account, claimStatus, skip, take } = dto;

    const queryBuilder = this.claimEntityRepository.createQueryBuilder("claim");

    queryBuilder.select();

    queryBuilder.andWhere("claim.merchantId = :merchantId", {
      merchantId: userEntity.merchantId,
    });

    queryBuilder.andWhere("claim.claimType = :claimType", {
      claimType: ClaimType.VESTING,
    });

    if (account) {
      queryBuilder.andWhere("claim.account ILIKE '%' || :account || '%'", { account });
    }

    if (claimStatus) {
      if (claimStatus.length === 1) {
        queryBuilder.andWhere("claim.claimStatus = :claimStatus", { claimStatus: claimStatus[0] });
      } else {
        queryBuilder.andWhere("claim.claimStatus IN(:...claimStatus)", { claimStatus });
      }
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "claim.createdAt": "ASC",
    });

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<ClaimEntity>,
    options?: FindOneOptions<ClaimEntity>,
  ): Promise<ClaimEntity | null> {
    return this.claimEntityRepository.findOne({ where, ...options });
  }

  public findOneWithRelations(where: FindOptionsWhere<ClaimEntity>): Promise<ClaimEntity | null> {
    return this.findOne(where, {
      join: {
        alias: "claim",
        leftJoinAndSelect: {
          item: "claim.item",
          item_components: "item.components",
          item_contract: "item_components.contract",
          item_template: "item_components.template",
        },
      },
    });
  }

  public async create(dto: IVestingClaimCreateDto, userEntity: UserEntity): Promise<ClaimEntity> {
    const { parameters } = dto;

    const assetEntity = await this.assetService.create();

    const claimEntity = await this.claimEntityRepository
      .create({
        account: parameters.beneficiary.toLowerCase(),
        item: assetEntity,
        signature: "0x",
        nonce: "",
        merchantId: userEntity.merchantId,
        endTimestamp: new Date(0).toISOString(),
        claimType: ClaimType.VESTING,
        parameters,
      })
      .save();

    return this.update({ id: claimEntity.id }, dto, userEntity);
  }

  public async update(
    where: FindOptionsWhere<ClaimEntity>,
    dto: IVestingClaimUpdateDto,
    userEntity: UserEntity,
  ): Promise<ClaimEntity> {
    const { parameters, item } = dto;
    let claimEntity = await this.findOneWithRelations(where);

    if (!claimEntity) {
      throw new NotFoundException("claimNotFound");
    }

    if (claimEntity.merchantId !== userEntity.merchantId) {
      throw new ForbiddenException("insufficientPermissions");
    }

    // Update only NEW Claims
    if (claimEntity.claimStatus !== ClaimStatus.NEW) {
      throw new BadRequestException("claimRedeemed");
    }

    // Update only NEW Claims
    if (claimEntity.claimType !== ClaimType.VESTING) {
      throw new BadRequestException("claimWrongType");
    }

    await this.assetService.update(claimEntity.item, item, userEntity);

    claimEntity = await this.findOneWithRelations(where);

    if (!claimEntity) {
      throw new NotFoundException("claimNotFound");
    }

    const encodedExternalId = concat([
      zeroPadValue(toBeHex(userEntity.id), 3),
      zeroPadValue(toBeHex(claimEntity.id), 4),
    ]);

    const { signature, bytecode, nonce } = await this.contractManagerSignService.vesting(
      {
        beneficiary: parameters.beneficiary,
        startTimestamp: parameters.startTimestamp,
        cliffInMonth: parameters.cliffInMonth,
        monthlyRelease: parameters.monthlyRelease,
        externalId: encodedExternalId,
      },
      userEntity,
      claimEntity.item,
    );

    Object.assign(claimEntity, { nonce: hexlify(nonce), signature, account: parameters.beneficiary.toLowerCase() });
    // TODO simplify it?
    Object.assign(parameters, { bytecode });
    Object.assign(claimEntity, { parameters });
    return claimEntity.save();
  }

  public async upload(dto: IVestingClaimUploadDto, userEntity: UserEntity): Promise<Array<ClaimEntity>> {
    const { claims } = dto;
    return new Promise(resolve => {
      mapLimit(
        claims,
        10,
        async ({
          beneficiary,
          startTimestamp,
          cliffInMonth,
          monthlyRelease,
          tokenType,
          address,
          templateId,
          amount,
        }: IVestingClaimRow) => {
          const contractEntity = await this.contractService.findOne({
            address,
            merchantId: userEntity.merchantId,
          });

          if (!contractEntity) {
            throw new NotFoundException("contractNotFound");
          }

          return this.create(
            {
              parameters: { beneficiary, startTimestamp, cliffInMonth, monthlyRelease },
              item: {
                components: [
                  {
                    tokenType,
                    contractId: contractEntity.id,
                    templateId,
                    amount,
                  },
                ],
              },
            },
            userEntity,
          );
        },
        (e, results) => {
          if (e) {
            this.loggerService.error(e, VestingClaimService.name);
          }
          resolve(results as Array<ClaimEntity>);
        },
      );
    });
  }

  public async delete(where: FindOptionsWhere<ClaimEntity>, userEntity: UserEntity): Promise<ClaimEntity> {
    const claimEntity = await this.findOne(where);

    if (!claimEntity) {
      throw new NotFoundException("claimNotFound");
    }

    if (claimEntity.merchantId !== userEntity.merchantId) {
      throw new ForbiddenException("insufficientPermissions");
    }

    if (claimEntity.claimStatus !== ClaimStatus.NEW) {
      throw new NotFoundException("claimRedeemed");
    }

    return claimEntity.remove();
  }
}
