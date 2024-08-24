import { MigrationInterface, QueryRunner } from "typeorm";
import { Wallet } from "ethers";
import { populate } from "dotenv";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { ns, testChainId } from "@framework/constants";
import { NodeEnv } from "@gemunion/constants";

export class SeedContractWaitlistAt1663047650100 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production || process.env.NODE_ENV === NodeEnv.test) {
      return;
    }

    populate(
      process.env as any,
      {
        WAIT_LIST_ADDR: Wallet.createRandom().address.toLowerCase(),
      },
      process.env as any,
    );

    const currentDateTime = new Date().toISOString();
    const chainId = process.env.CHAIN_ID_GEMUNION || process.env.CHAIN_ID_GEMUNION_BESU || testChainId;
    const fromBlock = process.env.STARTING_BLOCK || 0;
    const waitListAddr = process.env.WAIT_LIST_ADDR;

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
        '{PAUSABLE}',
        'WAIT_LIST',
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
        '{PAUSABLE}',
        'WAIT_LIST',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1020903,
        '${waitListAddr}',
        '${chainId}',
        'WaitList (MeowDao)',
        '${simpleFormatting}',
        '',
        'WaitList',
        '',
        '',
        'ACTIVE',
        '{PAUSABLE}',
        'WAIT_LIST',
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
