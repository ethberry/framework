import { MigrationInterface, QueryRunner } from "typeorm";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { ns, imagePath } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedContractErc1155DumbWayToDieAt1563804000151 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.contract (
        id,
        address,
        chain_id,
        title,
        description,
        image_url,
        name,
        symbol,
        royalty,
        base_token_uri,
        contract_status,
        contract_type,
        contract_features,
        from_block,
        merchant_id,
        created_at,
        updated_at
      ) VALUES (
        10515,
        '0x0cd925f268678d03057d184ded76d98552d7d837',
        1,
        'Dumb Ways To Die (external)',
        '${simpleFormatting}',
        '${imagePath}/dumb_way_to_die.png',
        'DWTD',
        'DWTD',
        0,
        'https://dwtd.playsidestudios-devel.com/loot/founders/images/{tokenId}.png',
        'ACTIVE',
        'ERC1155',
        '{EXTERNAL}',
        14498221,
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.contract RESTART IDENTITY CASCADE;`);
  }
}
