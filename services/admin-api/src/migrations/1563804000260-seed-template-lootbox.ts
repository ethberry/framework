import { MigrationInterface, QueryRunner } from "typeorm";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { imageUrl, ns } from "@framework/constants";

export class SeedTemplateLootboxAt1563804000230 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        16101
      ), (
        16102
      ), (
        16103
      ), (
        16104
      ), (
        16105
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.template (
        id,
        title,
        description,
        image_url,
        price_id,
        cap,
        amount,
        template_status,
        contract_id,
        created_at,
        updated_at
      ) VALUES (
        16101,
        'Sword Lootbox',
        '${simpleFormatting}',
        '${imageUrl}',
        16101,
        0,
        4,
        'ACTIVE',
        41,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        16102,
        'Warrior Lootbox',
        '${simpleFormatting}',
        '${imageUrl}',
        16102,
        0,
        1,
        'ACTIVE',
        41,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        16103,
        'Gold Lootbox',
        '${simpleFormatting}',
        '${imageUrl}',
        16103,
        0,
        1,
        'ACTIVE',
        41,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        16104,
        'Mixed Lootbox',
        '${simpleFormatting}',
        '${imageUrl}',
        16104,
        0,
        1,
        'ACTIVE',
        41,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        16105,
        'Inactive Lootbox',
        '${simpleFormatting}',
        '${imageUrl}',
        16105,
        0,
        1,
        'INACTIVE',
        41,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.template_id_seq', 16102, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.template RESTART IDENTITY CASCADE;`);
  }
}
