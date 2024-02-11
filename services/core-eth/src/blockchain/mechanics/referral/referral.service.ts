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
  wallet: string;
  share: number;
  reflen: number;
}

export interface IRefEventCalc {
  refProgramId: number;
  refLevel: number;
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
      // LOOK FOR LEVEL 1 (it means referrer had purchases from merchant)
      const refTreeOne = await this.referralTreeService.findOne({
        merchantId,
        wallet: wallet.toLowerCase(),
        // TODO only one check is enough? (ref=Zero or level=1)
        referral: ZeroAddress,
        level: 1,
      });
      // GET ANY CONFIRMED REF RECORDS FOR WALLET
      const accRefs = await this.referralTreeService.findOne({ merchantId, wallet: wallet.toLowerCase(), temp: false });
      if (!refTreeOne && !accRefs) {
        // REGISTER WALLET AS MERCHANT's REFERRAL LEVEL 1 (temporary)
        await this.referralTreeService.create({ wallet, merchantId, referral: ZeroAddress, level: 1, temp: true });
      }
    }
  }

  // TODO test it
  public async referralEventLevel(
    merchantId: number,
    account: string,
    referrer: string,
  ): Promise<IRefEventCalc | void> {
    // todo findOne enough?
    const refProgramLevels = await this.referralProgramService.findAll({ merchantId }, { order: { level: "ASC" } });
    // IF THERE IS MERCHANT REF PROGRAM
    if (refProgramLevels && refProgramLevels.length > 0) {
      // GET ALL ref tree for referrer
      const refTree = await this.referralTreeService.findAll(
        {
          merchantId,
          wallet: referrer.toLowerCase(),
          // temp: false,
        },
        { order: { level: "ASC" } },
      );

      // IF REFERRER REGISTERED
      if (refTree && refTree.length > 0) {
        const refMax = refTree[refTree.length - 1].level;
        // CONFIRM temp LEVEL 1 REF
        if (refMax === 1 && refTree[refTree.length - 1].temp) {
          Object.assign(refTree[refTree.length - 1], { temp: false });
          await refTree[refTree.length - 1].save();
        }
        // REMOVE TEMP REF LEVEL 1 IF EXIST
        await this.referralTreeService.deleteIfExist({
          merchantId,
          wallet: account.toLowerCase(),
          referral: ZeroAddress,
          level: 1,
          temp: true,
        });

        // GET CURRENT REFERRER ACCOUNT-to-MERCHANT CHAIN
        const refChain = await this.getRefChain(referrer.toLowerCase());
        // GET CURRENT ACCOUNT-to-MERCHANT CHAIN
        const accChain = await this.getRefChain(account.toLowerCase());

        if (accChain.length > 0 && accChain.length < refChain.length) {
          const refLevel = refChain.length > accChain.length ? accChain[0].reflen : refChain[0].reflen;
          const refShare = refChain.length > accChain.length ? accChain[0].share : refChain[0].share;
          return { refProgramId: refProgramLevels[0].id, refLevel, refShare };
          // RETURN ACCOUNT's REF LEVEL
          // return refMax;
        } else {
          const refData = {
            merchantId,
            wallet: account.toLowerCase(),
            referral: referrer.toLowerCase(),
            level: refMax + 1,
            // TODO false default
            temp: false,
          };

          const sameRef = await this.referralTreeService.findOne(refData);
          // CHECK IF SAME REF CHAIN ALREADY SAVED
          if (!sameRef) {
            // CREATE PAIR account+referrer with next ref level
            await this.referralTreeService.create(refData);
          }
          // REMOVE TEMP REF LEVEL 1 IF EXIST
          await this.referralTreeService.deleteIfExist({
            merchantId,
            wallet: account.toLowerCase(),
            referral: ZeroAddress,
            level: 1,
            temp: true,
          });

          const refLevel =
            refChain.length > accChain.length && accChain.length > 0 ? accChain[0].reflen : refChain[0].reflen;
          const refShare =
            refChain.length > accChain.length && accChain.length > 0 ? accChain[0].share : refChain[0].share;
          return { refProgramId: refProgramLevels[0].id, refLevel, refShare };
          // RETURN ACCOUNT's REF LEVEL
          // return refMax;
        }
      } else {
        // IF REFERRER WAS NOT REGISTERED - confirm account's temporary level 1 ref if exist
        const accRef = await this.referralTreeService.findOne({
          wallet: account.toLowerCase(),
          merchantId,
          referral: ZeroAddress,
          level: 1,
          temp: true,
        });
        if (accRef) {
          Object.assign(accRef, { temp: false });
          await accRef.save();
          // RETURN ACCOUNT's REF LEVEL
          return { refProgramId: refProgramLevels[0].id, refLevel: 1, refShare: 0 };
        }
      }
    }
  }

  public async getRefChain(referrer: string): Promise<Array<IRefChainQuery>> {
    const queryRunner = this.dataSource.createQueryRunner();

    const result = await queryRunner.query(`
        WITH RECURSIVE ref_tree AS (
            SELECT wallet, referral, level, merchant_id, 1 as refLen
            FROM ${ns}.referral_tree
            WHERE wallet like '${referrer.toLowerCase()}%'
            UNION
            SELECT t.wallet, t.referral, t.level, t.merchant_id, rt.refLen + 1
            FROM ${ns}.referral_tree t
                     INNER JOIN ref_tree rt ON t.wallet = rt.referral AND rt.level > 0 )
        SELECT ref_tree.wallet, rp.share, ref_tree.refLen --,ref_tree.referral
        FROM ref_tree
                 left join gemunion.referral_program rp on ref_tree.merchant_id = rp.merchant_id and ref_tree.refLen = rp.level
        order by ref_tree.refLen;
    `);

    // TODO Entity
    if (result && result.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return result;
    } else {
      return [];
    }
  }
}
