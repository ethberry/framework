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
import { DeleteResult, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { hexlify, randomBytes } from "ethers";
import { mapLimit } from "async";
import type { IClaimSearchDto } from "@framework/types";
import { ClaimStatus, ClaimType } from "@framework/types";

import { ContractManagerSignService } from "../../../contract-manager/contract-manager.sign.service";
import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { ClaimEntity } from "../../claim/claim.entity";
import type { IVestingClaimCreateDto, IVestingClaimUpdateDto, IVestingClaimUploadDto } from "./interfaces";
import { AssetService } from "../../../exchange/asset/asset.service";

@Injectable()
export class VestingClaimService {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    @InjectRepository(ClaimEntity)
    private readonly claimEntityRepository: Repository<ClaimEntity>,
    private readonly assetService: AssetService,
    private readonly contractManagerSignService: ContractManagerSignService,
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

  public async create(dto: IVestingClaimCreateDto, userEntity: UserEntity): Promise<ClaimEntity> {
    const { account, endTimestamp, parameters } = dto;
    const claimEntity = await this.claimEntityRepository
      .create({
        account,
        signature: "0x",
        nonce: "",
        merchantId: userEntity.merchantId,
        endTimestamp,
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
    const { account, endTimestamp, parameters } = dto;

    const claimEntity = await this.findOne(where);

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

    const nonce = randomBytes(32);

    const { signature } = await this.contractManagerSignService.vesting(parameters, userEntity);

    Object.assign(claimEntity, { nonce: hexlify(nonce), signature, account, endTimestamp });
    return claimEntity.save();
  }

  public async upload(dto: IVestingClaimUploadDto, userEntity: UserEntity): Promise<Array<ClaimEntity>> {
    const { claims } = dto;
    return new Promise(resolve => {
      mapLimit(
        claims,
        10,
        async (row: IVestingClaimCreateDto) => {
          return this.create(row, userEntity);
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

  public async delete(where: FindOptionsWhere<ClaimEntity>, userEntity: UserEntity): Promise<DeleteResult> {
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

    return this.claimEntityRepository.delete(where);
  }
}
