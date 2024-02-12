import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository, InjectDataSource } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository, DataSource } from "typeorm";
import { ZeroAddress } from "ethers";

import { testChainId, ns } from "@framework/constants";
import { ReferralRewardEntity } from "./referral.reward.entity";
import { ReferralProgramService } from "./program/referral.program.service";
import { ReferralTreeService } from "./tree/referral.tree.service";
import { ContractService } from "../../hierarchy/contract/contract.service";

export interface IRefChainQuery {
  level: number;
  wallet: string;
  share: number;
  reflen: number;
  temp: boolean;
}

export interface IRefEventCalc {
  merchantId: number;
  refShare: number;
}

@Injectable()
export class ReferralService {
  constructor(
    @InjectRepository(ReferralRewardEntity)
    private readonly referralEventEntityRepository: Repository<ReferralRewardEntity>,
    private readonly referralProgramService: ReferralProgramService,
    private readonly referralTreeService: ReferralTreeService,
    private readonly contractService: ContractService,
    private readonly configService: ConfigService,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  public findOne(
    where: FindOptionsWhere<ReferralRewardEntity>,
    options?: FindOneOptions<ReferralRewardEntity>,
  ): Promise<ReferralRewardEntity | null> {
    return this.referralEventEntityRepository.findOne({ where, ...options });
  }

  public findAll(
    where: FindOptionsWhere<ReferralRewardEntity>,
    options?: FindManyOptions<ReferralRewardEntity>,
  ): Promise<Array<ReferralRewardEntity>> {
    return this.referralEventEntityRepository.find({ where, ...options });
  }

  public async create(dto: DeepPartial<ReferralRewardEntity>): Promise<ReferralRewardEntity> {
    return this.referralEventEntityRepository.create(dto).save();
  }

  public async referral(wallet: string, contract: string): Promise<void> {
    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));
    const contractEntity = await this.contractService.findOne({ address: contract.toLowerCase(), chainId });

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }
    const { merchantId } = contractEntity;

    const refProgram = await this.referralProgramService.findOne({ merchantId }, { relations: { merchant: true } });

    // DO NOT REGISTER SELF-REFERRERS
    if (refProgram && refProgram.merchant.wallet.toLowerCase() !== wallet.toLowerCase()) {
      // LOOK FOR LEVEL 1 referrer (it means referrer had purchases from merchant)
      const refTreeOne = await this.referralTreeService.findOne({
        merchantId,
        wallet: wallet.toLowerCase(),
        // TODO only one check is enough? (ref=Zero or level=1)
        referral: ZeroAddress,
        level: 1,
      });
      // GET ANY CONFIRMED REF RECORDS FOR buyer's WALLET
      const accRefs = await this.referralTreeService.findOne({ merchantId, wallet: wallet.toLowerCase(), temp: false });
      if (!refTreeOne && !accRefs) {
        // REGISTER WALLET AS MERCHANT's REFERRAL LEVEL 1 (temporary)
        await this.referralTreeService.create({ wallet, merchantId, referral: ZeroAddress, level: 1, temp: true });
      }
    }
  }

  // TODO test it for edge cases
  public async referralEventLevel(
    merchantId: number,
    account: string,
    referrer: string,
  ): Promise<IRefEventCalc | void> {
    // FIND MERCHANT'S REF PROGRAM
    const refProgramLevelZero = await this.referralProgramService.findOne({ merchantId, level: 0 });
    // IF THERE IS MERCHANT REF PROGRAM
    if (refProgramLevelZero) {
      // GET CURRENT REFERRER WALLET-to-MERCHANT CHAIN
      const refChain = await this.getRefChain(referrer.toLowerCase(), merchantId);
      // IF REFERRER WAS REGISTERED
      if (refChain && refChain.length > 0) {
        const currentRefLevel = refChain[0].level;
        // CONFIRM TEMP LEVEL 1 REF
        if (currentRefLevel === 1 && refChain[0].temp) {
          await this.referralTreeService.updateIfExist(
            { merchantId, wallet: referrer.toLowerCase(), level: 1, temp: true },
            { temp: false },
          );
        }
        // REMOVE TEMP REF LEVEL 1 IF EXIST
        await this.referralTreeService.deleteIfExist({
          merchantId,
          wallet: account.toLowerCase(),
          referral: ZeroAddress,
          level: 1,
          temp: true,
        });

        // GET ANY CONFIRMED REF RECORDS FOR buyer's ACCOUNT
        const accRefs = await this.referralTreeService.findOne({
          merchantId,
          wallet: account.toLowerCase(),
          temp: false,
        });

        // IF ACCOUNT WAS NOT REGISTERED IN REF TREE - CREATE
        if (!accRefs) {
          // CREATE PAIR account+referrer with next ref level
          await this.referralTreeService.createIfNotExist({
            merchantId,
            wallet: account.toLowerCase(),
            referral: referrer.toLowerCase(),
            level: currentRefLevel + 1,
            temp: false,
          });
        }
        // REMOVE TEMP REF LEVEL 1 IF EXIST
        await this.referralTreeService.deleteIfExist({
          merchantId,
          wallet: account.toLowerCase(),
          referral: ZeroAddress,
          level: 1,
          temp: true,
        });
        return { merchantId, refShare: refChain[0].share };
      } else {
        // IF REFERRER WAS NOT REGISTERED - confirm account's temporary level 1 ref if exist
        await this.referralTreeService.updateIfExist(
          {
            wallet: account.toLowerCase(),
            merchantId,
            referral: ZeroAddress,
            level: 1,
            temp: true,
          },
          { temp: false },
        );
        // RETURN ACCOUNT's REF LEVEL 0
        return { merchantId, refShare: 0 };
      }
    }
  }

  public async getRefChain(referrer: string, merchantId: number): Promise<Array<IRefChainQuery>> {
    const queryRunner = this.dataSource.createQueryRunner();

    const result: Array<IRefChainQuery> = await queryRunner.query(`
        WITH RECURSIVE ref_tree AS (
            SELECT wallet, referral, level, merchant_id, temp, 1 as refLen
            FROM ${ns}.referral_tree
            WHERE wallet = '${referrer}'
              AND merchant_id = ${merchantId}
            UNION
            SELECT t.wallet, t.referral, t.level, t.merchant_id, t.temp, rt.refLen + 1
            FROM ${ns}.referral_tree t
                     INNER JOIN ref_tree rt ON t.merchant_id = rt.merchant_id AND t.wallet = rt.referral AND rt.level > 0
        )
        SELECT ref_tree.level, ref_tree.wallet, rp.share, ref_tree.refLen, ref_tree.temp
        FROM ref_tree
                 left join ${ns}.referral_program rp on ref_tree.merchant_id = rp.merchant_id and ref_tree.refLen = rp.level
        order by ref_tree.refLen;
    `);

    if (result && result.length > 0) {
      return result;
    } else {
      return [];
    }
  }
}
