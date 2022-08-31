import { MigrationInterface, QueryRunner } from "typeorm";
import { constants } from "ethers";

import { wallet } from "@gemunion/constants";
import { ns } from "@framework/constants";

export class SeedExchangeHistory1657846608020 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.exchange_history (
        id,
        address,
        transaction_hash,
        event_type,
        event_data,
        created_at,
        updated_at
      ) VALUES (
        301001,
        '${wallet}',
        '${constants.HashZero}',
        'Purchase',
        '{}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        301002,
        '${wallet}',
        '${constants.HashZero}',
        'Purchase',
        '{}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        301003,
        '${wallet}',
        '${constants.HashZero}',
        'Purchase',
        '{}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        305001,
        '${wallet}',
        '${constants.HashZero}',
        'Purchase',
        '{}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        305002,
        '${wallet}',
        '${constants.HashZero}',
        'Purchase',
        '{}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        305003,
        '${wallet}',
        '${constants.HashZero}',
        'Purchase',
        '{}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        305004,
        '${wallet}',
        '${constants.HashZero}',
        'Purchase',
        '{}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        305005,
        '${wallet}',
        '${constants.HashZero}',
        'Purchase',
        '{}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        305006,
        '${wallet}',
        '${constants.HashZero}',
        'Purchase',
        '{}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        305007,
        '${wallet}',
        '${constants.HashZero}',
        'Purchase',
        '{}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        305008,
        '${wallet}',
        '${constants.HashZero}',
        'Purchase',
        '{}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        306001,
        '${wallet}',
        '${constants.HashZero}',
        'Purchase',
        '{}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        306002,
        '${wallet}',
        '${constants.HashZero}',
        'Purchase',
        '{}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        306003,
        '${wallet}',
        '${constants.HashZero}',
        'Purchase',
        '{}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        306004,
        '${wallet}',
        '${constants.HashZero}',
        'Purchase',
        '{}',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.exchange_history (
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
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.exchange_history RESTART IDENTITY CASCADE;`);
  }
}
