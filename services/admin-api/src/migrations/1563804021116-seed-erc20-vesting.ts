import { MigrationInterface, QueryRunner } from "typeorm";

import { wallet } from "@gemunion/constants";
import { ns } from "@framework/constants";

export class SeedErc20Vesting1563804021116 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.erc20_vesting (
        address,
        beneficiary,
        duration,
        start_timestamp,
        contract_template,
        chain_id,
        created_at,
        updated_at
      ) VALUES (
        '${wallet}',
        '${wallet}',
        1234567890,
        '${currentDateTime}',
        'LINEAR',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.erc20_vesting RESTART IDENTITY CASCADE;`);
  }
}
