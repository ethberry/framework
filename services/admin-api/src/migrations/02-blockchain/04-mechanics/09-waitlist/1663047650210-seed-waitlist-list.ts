import { MigrationInterface, QueryRunner } from "typeorm";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { ns } from "@framework/constants";

export class SeedWaitListListAt1663047650210 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        102090001
      ), (
        102090002
      ), (
        102090003
      ), (
        102090004
      ), (
        102090005
      ), (
        102090006
      ), (
        102090007
      ), (
        102090008
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.wait_list_list (
        title,
        description,
        merchant_id,
        item_id,
        root,
        created_at,
        updated_at
      ) VALUES (
        'WaitList NATIVE',
        '${simpleFormatting}',
        1,
        102090001,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'WaitList ERC20',
        '${simpleFormatting}',
        1,
        102090002,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'WaitList ERC721',
        '${simpleFormatting}',
        1,
        102090003,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'WaitList ERC998',
        '${simpleFormatting}',
        1,
        102090004,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'WaitList ERC1155',
        '${simpleFormatting}',
        1,
        102090005,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'WaitList MIXED',
        '${simpleFormatting}',
        1,
        102090006,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'WaitList ###',
        '${simpleFormatting}',
        1,
        102090007,
        '0x0',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'WaitList @@@',
        '${simpleFormatting}',
        2,
        102090008,
        false,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.wait_list_list`);
  }
}
