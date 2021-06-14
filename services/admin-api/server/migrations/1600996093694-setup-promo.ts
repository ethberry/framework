import {MigrationInterface, QueryRunner} from "typeorm";

import {ns} from "@trejgun/solo-constants-misc";
import {imageUrl} from "@trejgun/solo-mocks";

export class SetupPromo1600996093694 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.promo (
        title,
        product_id,
        image_url,
        created_at,
        updated_at
      ) VALUES (
        'Promo 1',
        1,
        '${imageUrl}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Promo 2',
        2,
        '${imageUrl}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Promo 3',
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
