import {MigrationInterface, QueryRunner} from "typeorm";
import {ns} from "@trejgun/solo-constants-misc";

export class AddIpColumnToAuthTable1613222527018 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`alter table ${ns}.auth add ip varchar default '0.0.0.0' not null;`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`alter table ${ns}.auth drop column ip;`);
  }
}
