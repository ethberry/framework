import { MigrationInterface, QueryRunner } from "typeorm";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedWaitListListAt1663047650210 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

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
      ), (
        102090009
      ), (
        102090010
      ), (
        102090011
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.wait_list_list (
        id,
        title,
        description,
        contract_id,
        item_id,
        root,
        is_private,
        created_at,
        updated_at
      ) VALUES (
        1,
        'WaitList NATIVE',
        '${simpleFormatting}',
        1020901,
        102090001,
        null,
        false,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        2,
        'WaitList ERC20',
        '${simpleFormatting}',
        1020901,
        102090002,
        null,
        false,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        3,
        'WaitList ERC721',
        '${simpleFormatting}',
        1020901,
        102090003,
        null,
        false,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        4,
        'WaitList ERC998',
        '${simpleFormatting}',
        1020901,
        102090004,
        null,
        false,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        5,
        'WaitList ERC1155',
        '${simpleFormatting}',
        1020901,
        102090005,
        null,
        false,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        6,
        'WaitList MIXED',
        '${simpleFormatting}',
        1020901,
        102090006,
        null,
        false,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        7,
        'WaitList (redeemed)',
        '${simpleFormatting}',
        1020901,
        102090007,
        null,
        false,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        8,
        'WaitList (private)',
        '${simpleFormatting}',
        1020901,
        102090008,
        null,
        true,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        9,
        'WaitList (root)',
        '${simpleFormatting}',
        1020901,
        102090009,
       '0xb026b326e62eb342a39b9d932ef7e2f7e40f917cee1994e2412ea6f65902a13a',
        false,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10,
        'WaitList (inactive)',
        '${simpleFormatting}',
        1020902,
        102090010,
        null,
        false,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        11,
        'WaitList (can join)',
        '${simpleFormatting}',
        1020903,
        102090011,
        null,
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
