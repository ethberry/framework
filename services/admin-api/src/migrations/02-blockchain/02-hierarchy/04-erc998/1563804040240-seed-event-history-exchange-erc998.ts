import { MigrationInterface, QueryRunner } from "typeorm";
import { constants } from "ethers";

import { wallet } from "@gemunion/constants";
import { ns } from "@framework/constants";

export class SeedEventHistoryExchangeErc998At1563804040240 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.event_history (
        id,
        address,
        transaction_hash,
        event_type,
        event_data,
        created_at,
        updated_at
      ) VALUES (
        406001,
        '${wallet}',
        '${constants.HashZero}',
        'Purchase',
        '{}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        406002,
        '${wallet}',
        '${constants.HashZero}',
        'Purchase',
        '{}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        406003,
        '${wallet}',
        '${constants.HashZero}',
        'Purchase',
        '{}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        406004,
        '${wallet}',
        '${constants.HashZero}',
        'Purchase',
        '{}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        406005,
        '${wallet}',
        '${constants.HashZero}',
        'Breed',
        '{}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        409001,
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
    await queryRunner.query(`TRUNCATE TABLE ${ns}.event_history RESTART IDENTITY CASCADE;`);
  }
}
