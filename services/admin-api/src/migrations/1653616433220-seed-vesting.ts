import { MigrationInterface, QueryRunner } from "typeorm";

import { wallet } from "@gemunion/constants";
import { ns } from "@framework/constants";

export class SeedVesting1653616433210 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.vesting (
        account,
        duration,
        start_timestamp,
        contract_template,
        contract_id,
        created_at,
        updated_at
      ) VALUES (
        '${wallet}',
        31536000000,
        '${currentDateTime}',
        'LINEAR',
        1901,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        31536000,
        '${currentDateTime}',
        'GRADED',
        1902,          
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        31536000,
        '${currentDateTime}',
        'CLIFF',
        1903,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.vesting RESTART IDENTITY CASCADE;`);
  }
}
