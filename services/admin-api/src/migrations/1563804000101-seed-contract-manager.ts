import { MigrationInterface, QueryRunner } from "typeorm";

import { wallet } from "@gemunion/constants";
import { ns } from "@framework/constants";

export class SeedContractManagerAt1563804000101 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const chainId = process.env.CHAIN_ID || 13378;
    const fromBlock = process.env.STARTING_BLOCK || 0;
    const contractManagerAddress = process.env.CONTRACT_MANAGER_ADDR || wallet;

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
        created_at,
        updated_at
      ) VALUES (
        1,
        '${contractManagerAddress}',
        '${chainId}',
        'CONTRACT MANAGER',
        '${JSON.stringify({})}',
        '',
        'ContractManager',
        '',
        '',
        'ACTIVE',
        '{}',
        'SYSTEM',
        '${fromBlock}',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.contract_id_seq', 1, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.contract RESTART IDENTITY CASCADE;`);
  }
}
