import { MigrationInterface, QueryRunner } from "typeorm";

import { ns, testChainId } from "@framework/constants";
import { wallet } from "@gemunion/constants";
import { simpleFormatting } from "@gemunion/draft-js-utils";

export class SeedContractVestingAt1563804000190 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === "production") {
      return;
    }

    const currentDateTime = new Date().toISOString();
    const vestingAddress = process.env.VESTING_ADDR || wallet;
    const chainId = process.env.CHAIN_ID || testChainId;
    const fromBlock = process.env.STARTING_BLOCK || 0;

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
        parameters,
        contract_status,
        contract_features,
        contract_module,
        from_block,
        merchant_id,
        created_at,
        updated_at
      ) VALUES (
        1901,
        '${vestingAddress}',
        '${chainId}',
        'LINEAR VESTING',
        '${simpleFormatting}',
        '',
        'Linear vesting',
        '',
        '',
        '${JSON.stringify({
          account: wallet,
          startTimestamp: currentDateTime,
          cliffInMonth: 12,
          monthlyRelease: 417,
        })}',
        'ACTIVE',
        '{LINEAR}',
        'VESTING',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1902,
        '${vestingAddress}',
        '${chainId}',
        'GRADED VESTING',
        '${simpleFormatting}',
        '',
        'Graded vesting',
        '',
        '',
        '${JSON.stringify({
          account: wallet,
          startTimestamp: currentDateTime,
          cliffInMonth: 12,
          monthlyRelease: 417,
        })}',
        'ACTIVE',
        '{GRADED}',
        'VESTING',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1903,
        '${vestingAddress}',
        '${chainId}',
        'CLIFF VESTING',
        '${simpleFormatting}',
        '',
        'Cliff vesting',
        '',
        '',
        '${JSON.stringify({
          account: wallet,
          startTimestamp: currentDateTime,
          cliffInMonth: 12,
          monthlyRelease: 417,
        })}',
        'ACTIVE',
        '{CLIFF}',
        'VESTING',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.contract RESTART IDENTITY CASCADE;`);
  }
}
