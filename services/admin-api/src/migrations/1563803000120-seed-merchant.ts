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
        image_url,
        webhook_url,
        merchant_status,
        created_at,
        updated_at
      ) VALUES (
        'trejgun+merchant1@gmail.com',
        'GEMUNION',
        '${simpleFormatting}',
        '${imageUrl}',
        'http://localhost:3012/webhook',
        'ACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'trejgun+merchant2@gmail.com',
        'MEOW DOA',
        '${simpleFormatting}',
        '${imageUrl}',
        'http://localhost:3012/webhook',
        'ACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'trejgun+merchant3@gmail.com',
        'TREJ SHOP',
        '${simpleFormatting}',
        '${imageUrl}',
        'http://localhost:3012/webhook',
        'INACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.merchant RESTART IDENTITY CASCADE;`);
  }
}
