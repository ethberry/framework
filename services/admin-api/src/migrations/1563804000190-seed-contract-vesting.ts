import { MigrationInterface, QueryRunner } from "typeorm";

import { wallet } from "@gemunion/constants";
import { ns } from "@framework/constants";

export class SeedContractVestingAt1563804000190 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const vestingLinearAddress = process.env.VESTING_LINEAR_ADDR || wallet;
    const vestingGradedAddress = process.env.VESTING_GRADED_ADDR || wallet;
    const vestingCliffAddress = process.env.VESTING_CLIFF_ADDR || wallet;
    const chainId = process.env.CHAIN_ID || 1337;
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
        contract_status,
        contract_type,
        contract_features,
        contract_module,
        from_block,
        created_at,
        updated_at
      ) VALUES (
        1901,
        '${vestingLinearAddress}',
        '${chainId}',
        'LINEAR VESTING',
        '${JSON.stringify({})}',
        '',
        'Linear vesting',
        '',
        '',
        'ACTIVE',
        'ERC20',
        '{}',
        'VESTING',
        '${fromBlock}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1902,
        '${vestingGradedAddress}',
        '${chainId}',
        'GRADED VESTING',
        '${JSON.stringify({})}',
        '',
        'Graded vesting',
        '',
        '',
        'ACTIVE',
        'ERC20',
        '{}',
        'VESTING',
        '${fromBlock}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1903,
        '${vestingCliffAddress}',
        '${chainId}',
        'CLIFF VESTING',
        '${JSON.stringify({})}',
        '',
        'Cliff vesting',
        '',
        '',
        'ACTIVE',
        'ERC20',
        '{}',
        'VESTING',
        '${fromBlock}',
        '${currentDateTime}',
        '${currentDateTime}'
      )
    `);

    await queryRunner.query(`SELECT setval('${ns}.contract_id_seq', 1901, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.contract RESTART IDENTITY CASCADE;`);
  }
}
