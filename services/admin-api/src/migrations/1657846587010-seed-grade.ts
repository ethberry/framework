import { MigrationInterface, QueryRunner } from "typeorm";
import { constants } from "ethers";

import { ns } from "@framework/constants";

export class SeedGrade1657846587010 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id,
        external_id,
        asset_type
      ) VALUES (
        90101,
        90101,
        'GRADE'
      ), (
        90102,
        90102,
        'GRADE'
      ), (
        90201,
        90201,
        'GRADE'
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.asset_component (
        token_type,
        contract_id,
        token_id,
        amount,
        asset_id
      ) VALUES (
        'NATIVE',
        1,
        10001, -- ETH
        '${constants.WeiPerEther.toString()}',
        90101
      ), (
        'ERC20',
        2,
        10002, -- space credit
        '${constants.WeiPerEther.toString()}',
        90102
      ), (
        'ERC1155',
        31,
        40101, -- gold
        '1000',
        90201
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.grade (
        grade_strategy,
        growth_rate,
        price_id,
        contract_id,
        created_at,
        updated_at
      ) VALUES (
        'FLAT',
        0,
        90101,
        11,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'LINEAR',
        0,
        90102,
        12,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'EXPONENTIAL',
        1,
        90201,
        21,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.grade RESTART IDENTITY CASCADE;`);
  }
}
