import { MigrationInterface, QueryRunner } from "typeorm";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { imageUrl, ns } from "@framework/constants";

export class SeedMerchant1563803000120 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.merchant (
        email,
        title,
        description,
        phone_number,
        image_url,
        merchant_status,
        api_key,
        created_at,
        updated_at
      ) VALUES (
        'trejgun+merchant1@gmail.com',
        'MEOW DOA',
        '${simpleFormatting}',
        '+62 (812) 3919-8760',
        '${imageUrl}',
        'ACTIVE',
        '11111111-2222-3333-4444-555555555555',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'trejgun+merchant2@gmail.com',
        'CTAPbIu SHOP',
        '${simpleFormatting}',
        '+62 (812) 3919-8760',
        '${imageUrl}',
        'INACTIVE',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.merchant RESTART IDENTITY CASCADE;`);
  }
}
