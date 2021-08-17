import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@gemunion/framework-constants-misc";
import { imageUrl, simpleFormatting } from "@gemunion/framework-mocks";

export class SeedMerchant1563804021010 implements MigrationInterface {
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
        created_at,
        updated_at
      ) VALUES (
        'trejgun+merchant1@gmail.com',
        'MEOW DOA',
        '${simpleFormatting}',
        '+62 (812) 3919-8760',
        '${imageUrl}',
        'ACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'trejgun+merchant2@gmail.com',
        'CTAPbIu SHOP',
        '${simpleFormatting}',
        '+62 (812) 3919-8760',
        '${imageUrl}',
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
