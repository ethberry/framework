import { MigrationInterface, QueryRunner } from "typeorm";

import { ns, testChainId } from "@framework/constants";
import { wallet } from "@gemunion/constants";
import { simpleFormatting } from "@gemunion/draft-js-utils";

export class SeedContractVestingAt1563804000190 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const vestingLinearAddress = process.env.VESTING_LINEAR_ADDR || wallet;
    const vestingGradedAddress = process.env.VESTING_GRADED_ADDR || wallet;
    const vestingCliffAddress = process.env.VESTING_CLIFF_ADDR || wallet;
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
        '${vestingLinearAddress}',
        '${chainId}',
        'LINEAR VESTING',
        '${simpleFormatting}',
        '',
        'Linear vesting',
        '',
        '',
        '${JSON.stringify({ account: wallet, duration: 31536000000, startTimestamp: currentDateTime })}',
        'ACTIVE',
        '{LINEAR}',
        'VESTING',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1902,
        '${vestingGradedAddress}',
        '${chainId}',
        'GRADED VESTING',
        '${simpleFormatting}',
        '',
        'Graded vesting',
        '',
        '',
        '${JSON.stringify({ account: wallet, duration: 31536000000, startTimestamp: currentDateTime })}',
        'ACTIVE',
        '{GRADED}',
        'VESTING',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1903,
        '${vestingCliffAddress}',
        '${chainId}',
        'CLIFF VESTING',
        '${simpleFormatting}',
        '',
        'Cliff vesting',
        '',
        '',
        '${JSON.stringify({ account: wallet, duration: 31536000000, startTimestamp: currentDateTime })}',
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
