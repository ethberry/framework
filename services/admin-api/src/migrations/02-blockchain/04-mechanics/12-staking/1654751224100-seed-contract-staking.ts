import { MigrationInterface, QueryRunner } from "typeorm";

import { wallet } from "@gemunion/constants";
import { simpleFormatting } from "@gemunion/draft-js-utils";
import { imageUrl, ns, testChainId } from "@framework/constants";

export class SeedContractStakingAt1654751224100 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const chainId = process.env.CHAIN_ID || testChainId;
    const fromBlock = process.env.STARTING_BLOCK || 0;
    const stakingAddr = process.env.STAKING_ADDR || wallet;

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
        from_block,
        merchant_id,
        created_at,
        updated_at
      ) VALUES (
        3,
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
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.contract RESTART IDENTITY CASCADE;`);
  }
}
