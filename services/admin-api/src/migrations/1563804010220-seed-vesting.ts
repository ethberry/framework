import { MigrationInterface, QueryRunner } from "typeorm";

import { wallet } from "@gemunion/constants";
import { ns } from "@framework/constants";

export class SeedVesting1563804010220 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.vesting (
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
    await queryRunner.query(`TRUNCATE TABLE ${ns}.vesting RESTART IDENTITY CASCADE;`);
  }
}
