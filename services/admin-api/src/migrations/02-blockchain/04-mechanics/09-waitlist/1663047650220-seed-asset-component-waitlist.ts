import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

import { ns } from "@framework/constants";

export class SeedAssetComponentsWaitListAt1663047650220 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === "production") {
      return;
    }

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
        1010101, -- BESU
        '${WeiPerEther.toString()}',
        102090001
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        102090002
      ), (
        'ERC721',
        10301,
        1030101, -- Ruby
        '1',
        102090003
      ), (
        'ERC998',
        10401,
        1040101, -- Physic rune
        '1',
        102090004
      ), (
        'ERC1155',
        10501,
        1050101, -- Gold
        '1000',
        102090005
      ), (
        'NATIVE',
        10101,
        1010101, -- BESU
        '${WeiPerEther.toString()}',
        102090006
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        102090006
      ), (
        'ERC721',
        10301,
        1030101, -- Ruby
        '1',
        102090006
      ), (
        'ERC998',
        10401,
        1040101, -- Physic rune
        '1',
        102090006
      ), (
        'ERC1155',
        10501,
        1050101, -- Gold
        '1000',
        102090006
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        102090007
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        102090008
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        102090009
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        102090010
      ), (
        'ERC20',
        10108,
        1010801, -- Warp Credits
        '${WeiPerEther.toString()}',
        102090011
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.asset_component`);
  }
}
