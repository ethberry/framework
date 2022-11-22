import { MigrationInterface, QueryRunner } from "typeorm";

import { wallet } from "@gemunion/constants";
import { ns } from "@framework/constants";

export class SeedContractPyramidAt1660436477100 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const chainId = process.env.CHAIN_ID || 13378;
    const fromBlock = process.env.STARTING_BLOCK || 0;
    const pyramidAddr = process.env.PYRAMID_ADDR || wallet;

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
        4,
        '${pyramidAddr}',
        '${chainId}',
        'PYRAMID',
        '${JSON.stringify({})}',
        '',
        'Pyramid',
        '',
        '',
        'ACTIVE',
        '{LINEAR_REFERRAL}',
        'PYRAMID',
        '${fromBlock}',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.contract RESTART IDENTITY CASCADE;`);
  }
}
