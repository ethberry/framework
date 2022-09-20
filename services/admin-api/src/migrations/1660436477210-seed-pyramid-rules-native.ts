import { MigrationInterface, QueryRunner } from "typeorm";
import { constants } from "ethers";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { ns } from "@framework/constants";

export class SeedPyramidRulesNativeAt1660436477210 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        90111
      ), (
        90112
      ), (
        90121
      ), (
        90122
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.asset_id_seq', 90152, true);`);

    await queryRunner.query(`
      INSERT INTO ${ns}.asset_component (
        token_type,
        contract_id,
        template_id,
        amount,
        asset_id
      ) VALUES (
        'NATIVE',
        101,
        101001, -- ETH
        '${constants.WeiPerEther.toString()}',
        90111
      ), (
        'NATIVE',
        101,
        101001, -- ETH
        '${constants.WeiPerEther.toString()}',
        90112
      ), (
        'NATIVE',
        101,
        101001, -- ETH
        '${constants.WeiPerEther.toString()}',
        90121
      ), (
        'ERC20',
        201,
        201001, -- space credit
        '${constants.WeiPerEther.toString()}',
        90122
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.pyramid_rules (
        title,
        description,
        duration,
        penalty,
        recurrent,
        deposit_id,
        reward_id,
        external_id,
        pyramid_rule_status,
        created_at,
        updated_at
      ) VALUES (
        'NATIVE > NATIVE',
        '${simpleFormatting}',
        30,
        1,
        false,
        90111,
        90112,
        11,
        'ACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'NATIVE > ERC20',
        '${simpleFormatting}',
        30,
        1,
        false,
        90121,
        90122,
        12,
        'NEW',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.pyramid_rules`);
  }
}
