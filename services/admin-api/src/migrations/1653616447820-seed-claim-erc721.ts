import { MigrationInterface, QueryRunner } from "typeorm";
import { wallet } from "@gemunion/constants";

import { ns } from "@framework/constants";

export class SeedClaimErc721At1563804040420 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        23101
      ), (
        23102
      ), (
        23103
      ), (
        23104
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.asset_id_seq', 50104, true);`);

    await queryRunner.query(`
      INSERT INTO ${ns}.asset_component (
        token_type,
        contract_id,
        template_id,
        amount,
        asset_id
      ) VALUES (
        'ERC721',
        16,
        13101, -- sword
        '1',
        23101
      ), (
        'ERC721',
        16,
        13102, -- mace
        '1',
        23102
      ), (
        'ERC721',
        16,
        13103, -- axe
        '1',
        23103
      ), (
        'ERC1155',
        31,
        15101, -- gold
        '1000',
        23104
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.claim (
        account,
        item_id,
        claim_status,
        signature,
        nonce,
        created_at,
        updated_at
      ) VALUES (
        '${wallet}',
        23101,
        'NEW',
        '0x8e1cac3e218c3c6a12d399b3434fd1da5dc8e4dfd5bc07219c6ec8a03bcacfee321d30b8b815e86d3e1dabb6e7447e87264cb405281e5b4362222aecdf45c2371c',
        '0xb91cc05c34bdb5bc9317945a42976dc510471c7ee718206fda51daadfff24985',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        23102,
        'NEW',
        '0x77f024f8579388ae73244ea7396c09cd33e4a5d36e4a7e2735ffbdf56a50f997580f9299c7f2208a4aaed8321dea9ba8260b09d75da3e966d8e25efb06dbe98d1c',
        '0x252f7476d08fb6d5727f0639dc08c5c65abc8a62deaefc92f5afaedd8e0bda67',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        23103,
        'UNPACKED',
        '0x837f66dcb96a7ae3664b0e34a23b5db75ed3f8278ab9e4374ce92a8c53ac938439ca6ffff8dbcc676bf520150d6306559fb4b4f0ef3fe80bb873e9df58aff0ac1b',
        '0xa07e288f20c97f9a853782001c9851f451b0729c494759a091c140c1019a6158',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        23104,
        'REDEEMED',
        '0x4848640f61c4bb0b0edab8bab540184a1b16a210e3e65e921c8053a9dde71c7c0022e73e63bb60c3b53907fecf6d11eb83ea58d39e351654ccedf3fd3498ae6e1b',
        '0x17fdcea410c1f8ee61a2bbc06f80a5bdf84611c935f0ed859d6acb475619d5f0',
        '${currentDateTime}',
        '${currentDateTime}'
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.air_drop RESTART IDENTITY CASCADE;`);
  }
}
