import { MigrationInterface, QueryRunner } from "typeorm";
import { constants } from "ethers";

import { wallet } from "@gemunion/constants";
import { ns } from "@framework/constants";

export class SeedExchangeHistory1657846608020 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.exchange_history (
        address,
        transaction_hash,
        event_type,
        event_data,
        created_at,
        updated_at
      ) VALUES (
        '${wallet}',
        '${constants.HashZero}',
        'Purchase',
        '{}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        '${constants.HashZero}',
        'Purchase',
        '{}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        '${constants.HashZero}',
        'Purchase',
        '{}',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.exchange_history RESTART IDENTITY CASCADE;`);
  }
}
