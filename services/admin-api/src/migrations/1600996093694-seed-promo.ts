import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@gemunion/framework-constants";
import { imageUrl, simpleFormatting } from "@gemunion/framework-mocks";

export class SeedPromo1600996093694 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.promo (
        title,
        description,
        product_id,
        image_url,
        created_at,
        updated_at
      ) VALUES (
        'Promo 1',
        '${simpleFormatting}',
        1,
        '${imageUrl}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Promo 2',
        '${simpleFormatting}',
        2,
        '${imageUrl}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Promo 3',
        '${simpleFormatting}',
        3,
        '${imageUrl}',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.promo RESTART IDENTITY CASCADE;`);
  }
}
