import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { ns } from "@framework/constants";

export class SeedPyramidRulesNativeAt1660436477210 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === "production") {
      return;
    }

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

    await queryRunner.query(`
      INSERT INTO ${ns}.asset_component (
        token_type,
        contract_id,
        template_id,
        amount,
        asset_id
      ) VALUES (
        'NATIVE',
        10101,
        1010101, -- ETH
        '${WeiPerEther.toString()}',
        90111
      ), (
        'NATIVE',
        10101,
        1010101, -- ETH
        '${WeiPerEther.toString()}',
        90112
      ), (
        'NATIVE',
        10101,
        1010101, -- ETH
        '${WeiPerEther.toString()}',
        90121
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        90122
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.pyramid_rules (
        id,
        title,
        description,
        duration_amount,
        penalty,
        deposit_id,
        reward_id,
        external_id,
        contract_id,
        pyramid_rule_status,
        created_at,
        updated_at
      ) VALUES (
        11,
        'NATIVE > NATIVE',
        '${simpleFormatting}',
        604800,
        1,
        90111,
        90112,
        11,
        4,
        'ACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        12,
        'NATIVE > ERC20',
        '${simpleFormatting}',
        604800,
        1,
        90121,
        90122,
        12,
        4,
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
