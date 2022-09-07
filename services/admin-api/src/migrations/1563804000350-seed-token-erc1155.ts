import { MigrationInterface, QueryRunner } from "typeorm";
import { subDays } from "date-fns";

import { ns } from "@framework/constants";

export class SeedTokenErc1155At1563804000350 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const now = new Date();
    const defaultJSON = JSON.stringify({});

    await queryRunner.query(`
      INSERT INTO ${ns}.token (
        id,
        attributes,
        royalty,
        token_id,
        token_status,
        template_id,
        created_at,
        updated_at
      ) VALUES (
        501001,
        '${defaultJSON}',
        100,
        '1',
        'MINTED',
        501001,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        501002,
        '${defaultJSON}',
        100,
        '2',
        'MINTED',
        501002,
        '${subDays(now, 2).toISOString()}',
        '${currentDateTime}'
      ), (
        501003,
        '${defaultJSON}',
        100,
        '3',
        'MINTED',
        501003,
        '${subDays(now, 3).toISOString()}',
        '${currentDateTime}'
      ), (
        501004,
        '${defaultJSON}',
        100,
        '4',
        'MINTED',
        501004,
        '${subDays(now, 4).toISOString()}',
        '${currentDateTime}'
      ), (
        501005,
        '${defaultJSON}',
        100,
        '5',
        'MINTED',
        501005,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        504001,
        '${defaultJSON}',
        100,
        '1',
        'MINTED',
        504001,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        504002,
        '${defaultJSON}',
        100,
        '2',
        'MINTED',
        504002,
        '${subDays(now, 2).toISOString()}',
        '${currentDateTime}'
      ), (
        504003,
        '${defaultJSON}',
        100,
        '3',
        'MINTED',
        504003,
        '${subDays(now, 3).toISOString()}',
        '${currentDateTime}'
      ), (
        511001,
        '${defaultJSON}',
        100,
        '3',
        'MINTED',
        511001,
        '${subDays(now, 30).toISOString()}',
        '${currentDateTime}'
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.token_id_seq', 511001, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.token RESTART IDENTITY CASCADE;`);
  }
}
