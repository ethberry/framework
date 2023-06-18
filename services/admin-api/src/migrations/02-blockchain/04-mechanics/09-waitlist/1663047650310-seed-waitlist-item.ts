import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";
import { wallets } from "@gemunion/constants";

export class SeedWaitListItemAt1663047650310 implements MigrationInterface {
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
        '${wallets[0]}',
        3,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        4,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        5,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        6,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        7,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        8,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        2,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        3,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[2]}',
        2,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[2]}',
        4,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.waitlist_item`);
  }
}
