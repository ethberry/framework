import { MigrationInterface, QueryRunner } from "typeorm";
import { Wallet } from "ethers";
import { populate } from "dotenv";

import { simpleFormatting } from "@ethberry/draft-js-utils";
import { imageUrl, ns, testChainId } from "@framework/constants";
import { NodeEnv } from "@ethberry/constants";

export class SeedContractStakingAt1654751224100 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production || process.env.NODE_ENV === NodeEnv.test) {
      return;
    }

    populate(
      process.env as any,
      {
        STAKING_ADDR: Wallet.createRandom().address.toLowerCase(),
      },
      process.env as any,
    );

    const currentDateTime = new Date().toISOString();
    const chainId = process.env.CHAIN_ID_ETHBERRY || process.env.CHAIN_ID_ETHBERRY_BESU || testChainId;
    const stakingAddr = process.env.STAKING_ADDR;

    await queryRunner.query(`
      INSERT INTO ${ns}.contract (
        id,
        address,
        chain_id,
        title,
        description,
        image_url,
        name,
        symbol,
        base_token_uri,
        contract_status,
        contract_features,
        contract_module,
        merchant_id,
        created_at,
        updated_at
      ) VALUES (
        12501,
        '${stakingAddr}',
        '${chainId}',
        'STAKING',
        '${simpleFormatting}',
        '${imageUrl}',
        'Staking',
        '',
        '',
        'ACTIVE',
        '{WITHDRAW,ALLOWANCE,REFERRAL}',
        'STAKING',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        12502,
        '${stakingAddr}',
        '${chainId}',
        'STAKING (new)',
        '${simpleFormatting}',
        '${imageUrl}',
        'Staking',
        '',
        '',
        'NEW',
        '{WITHDRAW,ALLOWANCE,REFERRAL}',
        'STAKING',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        12503,
        '${stakingAddr}',
        '${chainId}',
        'STAKING (inactive)',
        '${simpleFormatting}',
        '${imageUrl}',
        'Staking',
        '',
        '',
        'INACTIVE',
        '{WITHDRAW,ALLOWANCE,REFERRAL}',
        'STAKING',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        12504,
        '${stakingAddr}',
        56,
        'STAKING (BEP)',
        '${simpleFormatting}',
        '${imageUrl}',
        'Staking',
        '',
        '',
        'ACTIVE',
        '{WITHDRAW,ALLOWANCE,REFERRAL}',
        'STAKING',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        12505,
        '${stakingAddr}',
        '${chainId}',
        'STAKING (2)',
        '${simpleFormatting}',
        '${imageUrl}',
        'Staking',
        '',
        '',
        'ACTIVE',
        '{WITHDRAW,ALLOWANCE,REFERRAL}',
        'STAKING',
        2,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.contract RESTART IDENTITY CASCADE;`);
  }
}
