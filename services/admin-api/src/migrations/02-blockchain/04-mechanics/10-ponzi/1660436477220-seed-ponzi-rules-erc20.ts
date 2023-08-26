import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedPonziRulesErc20At1660436477220 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        90211
      ), (
        90212
      ), (
        90221
      ), (
        90222
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
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        90211
      ), (
        'NATIVE',
        10101,
        1010101, -- ETH
        '${WeiPerEther.toString()}',
        90212
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        90221
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        90222
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.ponzi_rules (
        id,
        title,
        description,
        duration_amount,
        penalty,
        deposit_id,
        reward_id,
        external_id,
        contract_id,
        ponzi_rule_status,
        created_at,
        updated_at
      ) VALUES (
        21,
        'ERC20 > NATIVE',
        '${simpleFormatting}',
        604800,
        1,
        90211,
        90212,
        21,
        4,
        'NEW',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        22,
        'ERC20 > ERC20',
        '${simpleFormatting}',
        604800,
        1,
        90221,
        90222,
        22,
        4,
        'ACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.ponzi_rules`);
  }
}
