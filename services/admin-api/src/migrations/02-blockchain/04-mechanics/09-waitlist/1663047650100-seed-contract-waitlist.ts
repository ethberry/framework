import { MigrationInterface, QueryRunner } from "typeorm";

import { ns, testChainId } from "@framework/constants";
import { wallet } from "@gemunion/constants";
import { simpleFormatting } from "@gemunion/draft-js-utils";

export class SeedContractWaitlistAt1663047650100 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const chainId = process.env.CHAIN_ID || testChainId;
    const fromBlock = process.env.STARTING_BLOCK || 0;
    const waitListAddr = process.env.WAITLIST_ADDR || wallet;

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
        1020901,
        '${waitListAddr}',
        '${chainId}',
        'WaitList',
        '${simpleFormatting}',
        '',
        'WaitList',
        '',
        '',
        'ACTIVE',
        '{}',
        'WAITLIST',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1020902,
        '${waitListAddr}',
        '${chainId}',
        'WaitList (inactive)',
        '${simpleFormatting}',
        '',
        'WaitList',
        '',
        '',
        'INACTIVE',
        '{}',
        'WAITLIST',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1020903,
        '${waitListAddr}',
        '${chainId}',
        'WaitList',
        '${simpleFormatting}',
        '',
        'WaitList',
        '',
        '',
        'ACTIVE',
        '{}',
        'WAITLIST',
        '${fromBlock}',
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
