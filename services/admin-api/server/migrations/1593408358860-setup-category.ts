import {MigrationInterface, QueryRunner} from "typeorm";
import {ns} from "@trejgun/solo-constants-misc";

export class SetupProducts1593408358860 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.category (
        title,
        description,
        parent_id,
        created_at,
        updated_at
      ) VALUES (
        'Root',
        'main category',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.category RESTART IDENTITY CASCADE;`);
  }
}
