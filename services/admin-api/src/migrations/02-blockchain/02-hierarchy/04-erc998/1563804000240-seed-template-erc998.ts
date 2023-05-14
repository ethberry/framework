import { MigrationInterface, QueryRunner } from "typeorm";

import { imageUrl, ns } from "@framework/constants";
import { simpleFormatting } from "@gemunion/draft-js-utils";

export class SeedTemplateErc998At1563804000240 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        140101
      ), (
        140102
      ), (
        140103
      ), (
        140501
      ), (
        140502
      ), (
        140503
      ), (
        140601
      ), (
        140602
      ), (
        140603
      ), (
        140701
      ), (
        140901
      ), (
        141101
      ), (
        141201
      ), (
        141301
      ), (
        240101
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.template (
        id,
        title,
        description,
        image_url,
        price_id,
        cap,
        amount,
        template_status,
        contract_id,
        created_at,
        updated_at
      ) VALUES (
        140101,
        'Sack',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fsack.png?alt=media&token=9caeb5a2-5934-4642-96c8-f9eea88470f5',
        140101,
        0,
        1,
        'ACTIVE',
        1401,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        140102,
        'Bag',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fbag.png?alt=media&token=e443c50c-7981-4a2b-8a48-63e9d00819a1',
        140102,
        0,
        1,
        'ACTIVE',
        1401,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        140103,
        'Wallet',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fwallet.png?alt=media&token=a32df807-f912-4c4e-823f-91e3c5c71850',
        140103,
        0,
        1,
        'ACTIVE',
        1401,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        140501,
        'Scroll',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fscroll.png?alt=media&token=0aa2fc59-f8cb-4958-99d7-375f0deba161',
        140501,
        0,
        1,
        'ACTIVE',
        1405,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        140502,
        'Grimoire',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fgrimoire.png?alt=media&token=4eba93cd-c1ca-4aa1-b002-b501bd2fb5c6',
        140502,
        0,
        1,
        'ACTIVE',
        1405,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        140503,
        'Voodoo doll',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fvoodoo_doll.png?alt=media&token=ef8808e5-6377-47f8-bf24-8a559fe7d16a',
        140503,
        0,
        1,
        'ACTIVE',
        1405,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        140601,
        'Warrior',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fwarrior.png?alt=media&token=144f2bf6-f470-4243-894a-a02a087c916f',
        140601,
        0,
        1,
        'ACTIVE',
        1406,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        140602,
        'Rouge',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Frouge.png?alt=media&token=20c7180d-775b-4ae3-82d4-9e1e9b4981b4',
        140602,
        0,
        1,
        'ACTIVE',
        1406,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        140603,
        'Mage',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fmage.png?alt=media&token=44bb311d-4513-4b9f-a6ca-5a05c053e6f9',
        140603,
        0,
        1,
        'ACTIVE',
        1406,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        140701,
        'Infinity',
        '${simpleFormatting}',
        '${imageUrl}',
        140701,
        0,
        1,
        'ACTIVE',
        1407,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        140901,
        'C-Shirt',
        '${simpleFormatting}',
        '${imageUrl}',
        140901,
        0,
        1,
        'ACTIVE',
        1409,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        141101,
        'ERC20 Owner',
        '${simpleFormatting}',
        '${imageUrl}',
        141101,
        0,
        1,
        'ACTIVE',
        1411,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        141201,
        'ERC1155 Owner',
        '${simpleFormatting}',
        '${imageUrl}',
        141201,
        0,
        1,
        'ACTIVE',
        1412,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        141301,
        'ERC1155 + ERC20 Owner',
        '${simpleFormatting}',
        '${imageUrl}',
        141201,
        0,
        1,
        'ACTIVE',
        1413,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        240101,
        'BEP',
        '${simpleFormatting}',
        '${imageUrl}',
        240101,
        0,
        1,
        'ACTIVE',
        2401,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.template RESTART IDENTITY CASCADE;`);
  }
}
