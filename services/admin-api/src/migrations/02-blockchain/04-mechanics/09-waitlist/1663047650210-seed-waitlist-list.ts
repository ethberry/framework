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
      ), (
        102090009
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.wait_list_list (
        title,
        description,
        contract_id,
        item_id,
        root,
        created_at,
        updated_at
      ) VALUES (
        'WaitList NATIVE',
        '${simpleFormatting}',
        1020901,
        102090001,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'WaitList ERC20',
        '${simpleFormatting}',
        1020901,
        102090002,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'WaitList ERC721',
        '${simpleFormatting}',
        1020901,
        102090003,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'WaitList ERC998',
        '${simpleFormatting}',
        1020901,
        102090004,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'WaitList ERC1155',
        '${simpleFormatting}',
        1020901,
        102090005,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'WaitList MIXED',
        '${simpleFormatting}',
        1020901,
        102090006,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'WaitList ###',
        '${simpleFormatting}',
        1020901,
        102090007,
        '0xb026b326e62eb342a39b9d932ef7e2f7e40f917cee1994e2412ea6f65902a13a',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'WaitList @@@',
        '${simpleFormatting}',
        1020901,
        102090008,
        '0xb026b326e62eb342a39b9d932ef7e2f7e40f917cee1994e2412ea6f65902a13a',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'WaitList $$$',
        '${simpleFormatting}',
        1020902,
        102090009,
        '0xb026b326e62eb342a39b9d932ef7e2f7e40f917cee1994e2412ea6f65902a13a',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.wait_list_list`);
  }
}
