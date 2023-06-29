import { MigrationInterface, QueryRunner } from "typeorm";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { ns } from "@framework/constants";

export class SeedContractErc1155DumbWayToDieAt1563804000151 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === "production") {
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fdumb_way_to_die.png?alt=media&token=c2a14ec3-434e-4d03-894b-db851bef9c93',
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
