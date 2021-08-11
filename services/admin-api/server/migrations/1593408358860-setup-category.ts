import {MigrationInterface, QueryRunner} from "typeorm";
import {ns} from "@gemunionstudio/framework-constants-misc";
import {simpleFormatting} from "@gemunionstudio/framework-mocks";

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
        '${simpleFormatting}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'First',
        '${simpleFormatting}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Second',
        '${simpleFormatting}',
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
