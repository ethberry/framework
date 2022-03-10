import { MigrationInterface, QueryRunner } from "typeorm";

import { rawStateString } from "@gemunion/draft-js-utils";
import { imageUrl, ns } from "@gemunion/framework-constants";

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
        '${rawStateString}',
        1,
        '${imageUrl}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Promo 2',
        '${rawStateString}',
        2,
        '${imageUrl}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Promo 3',
        '${rawStateString}',
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
