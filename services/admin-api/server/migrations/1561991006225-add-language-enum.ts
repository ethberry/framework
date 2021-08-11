import {MigrationInterface, QueryRunner} from "typeorm";
import {ns} from "@gemunionstudio/framework-constants-misc";

export class AddLanguageEnum1561991006225 implements MigrationInterface {
  public schemaName = ns;

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.language_enum AS ENUM (
        'UA',
        'RU',
        'EN'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TYPE ${ns}.language_enum;`);
  }
}
