import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";
import { wallets } from "@gemunion/constants";

export class SeedWaitListItemAt1663047650310 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === "production") {
      return;
    }

    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.wait_list_item (
        account,
        list_id,
        wait_list_item_status,
        created_at,
        updated_at
      ) VALUES (
        '${wallets[0]}',
        1,
        'NEW',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        2,
        'NEW',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        3,
        'NEW',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        4,
        'NEW',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        5,
        'NEW',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        6,
        'NEW',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        7,
        'REDEEMED',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        8,
        'NEW',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        9,
        'NEW',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        10,
        'NEW',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        2,
        'NEW',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        3,
        'NEW',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[2]}',
        2,
        'NEW',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[2]}',
        4,
        'NEW',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.wait_list_item`);
  }
}
