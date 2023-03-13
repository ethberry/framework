import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";
import { wallets } from "@gemunion/constants";

export class SeedWaitlistItemAt1663047650310 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.waitlist_item (
        account,
        list_id,
        created_at,
        updated_at
      ) VALUES (
        '${wallets[0]}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        2,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        2,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[2]}',
        2,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.waitlist_item`);
  }
}
