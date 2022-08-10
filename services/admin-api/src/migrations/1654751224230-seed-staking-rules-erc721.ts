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
        36,
        13601, -- sword
        1,
        80311
      ), (
        'ERC20',
        21,
        11001, -- ETH
        '${constants.WeiPerEther.toString()}',
        80312
      ), (
        'ERC721',
        36,
        13601, -- sword
        1,
        80321
      ), (
        'NATIVE',
        11,
        12001, -- space credit
        '${constants.WeiPerEther.toString()}',
        80322
      ), (
        'ERC721',
        36,
        13601, -- sword
        1,
        80331
      ), (
        'ERC721',
        36,
        13601, -- sword
        1,
        80332
      ), (
        'ERC721',
        36,
        13601, -- sword
        1,
        80341
      ), (
        'ERC998',
        46,
        14101, -- warrior
        1,
        80342
      ), (
        'ERC721',
        36,
        13601, -- sword
        1,
        80351
      ), (
        'ERC1155',
        51,
        15101, -- gold
        1,
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
        staking_status,
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
