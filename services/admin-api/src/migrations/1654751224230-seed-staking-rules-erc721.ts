import { MigrationInterface, QueryRunner } from "typeorm";
import { constants } from "ethers";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { ns } from "@framework/constants";

export class SeedStakingRulesErc721At1654751224230 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        80311
      ), (
        80312
      ), (
        80321
      ), (
        80322
      ), (
        80331
      ), (
        80332
      ), (
        80341
      ), (
        80342
      ), (
        80351
      ), (
        80352
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.asset_id_seq', 80352, true);`);

    await queryRunner.query(`
      INSERT INTO ${ns}.asset_component (
        token_type,
        contract_id,
        template_id,
        amount,
        asset_id
      ) VALUES (
        'ERC721',
        1306,
        130601, -- sword
        1,
        80311
      ), (
        'NATIVE',
        1101,
        110101, -- ETH
        '${constants.WeiPerEther.toString()}',
        80312
      ), (
        'ERC721',
        1306,
        130601, -- sword
        1,
        80321
      ), (
        'ERC20',
        1201,
        120101, -- space credit
        '${constants.WeiPerEther.toString()}',
        80322
      ), (
        'ERC721',
        1306,
        130601, -- sword
        1,
        80331
      ), (
        'ERC721',
        1306,
        130601, -- sword
        1,
        80332
      ), (
        'ERC721',
        1306,
        130601, -- sword
        1,
        80341
      ), (
        'ERC998',
        1406,
        140601, -- warrior
        1,
        80342
      ), (
        'ERC721',
        1306,
        130601, -- sword
        1,
        80351
      ), (
        'ERC1155',
        1501,
        150101, -- gold
        1000,
        80352
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.staking_rules (
        title,
        description,
        duration,
        penalty,
        recurrent,
        deposit_id,
        reward_id,
        external_id,
        staking_rule_status,
        created_at,
        updated_at
      ) VALUES (
        'ERC721 > NATIVE',
        '${simpleFormatting}',
        30,
        1,
        false,
        80311,
        80312,
        31,
        'NEW',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'ERC721 > ERC20',
        '${simpleFormatting}',
        30,
        1,
        false,
        80321,
        80322,
        32,
        'NEW',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'ERC721 > ERC721',
        '${simpleFormatting}',
        30,
        1,
        false,
        80331,
        80332,
        33,
        'NEW',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'ERC721 > ERC998',
        '${simpleFormatting}',
        30,
        1,
        false,
        80341,
        80342,
        34,
        'NEW',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'ERC721 > ERC1155',
        '${simpleFormatting}',
        30,
        1,
        false,
        80351,
        80352,
        35,
        'NEW',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.staking_rules`);
  }
}
