import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedTokenNativeAt1563804000310 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    const currentDateTime = new Date().toISOString();
    const defaultJSON = JSON.stringify({});

    await queryRunner.query(`
      INSERT INTO ${ns}.token (
        id,
        metadata,
        royalty,
        token_id,
        token_status,
        template_id,
        created_at,
        updated_at
      ) VALUES (
        101010101, -- BESU
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        1010101,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        101020101, -- BESU (inactive)
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        1010201,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        101080101, -- BESU (fake)
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        1010801,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        201010101, -- BNB
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        2010101,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        301010101, -- ETH
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        3010101,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        401010101, -- MATIC
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        4010101,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.token RESTART IDENTITY CASCADE;`);
  }
}
