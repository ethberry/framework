import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther, ZeroHash } from "ethers";

import { wallets } from "@gemunion/constants";
import { ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

import vestingJSON from "@framework/core-contracts/artifacts/contracts/Mechanics/Vesting/Vesting.sol/Vesting.json";

export class SeedClaimVestingAt1687835680100 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    const currentDateTime = new Date().toISOString();
    const zeroDateTime = new Date(0).toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        102130001
      ),(
        102130002
      ),(
        102130003
      ),(
        102130004
      ),(
        102130005
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
        102130001
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        102130002
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        102130003
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        102130004
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        102130005
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.claim (
        id,
        account,
        item_id,
        parameters,
        claim_status,
        claim_type,
        signature,
        nonce,
        end_timestamp,
        merchant_id,
        created_at,
        updated_at
      ) VALUES (
        1021301,
        '${wallets[0]}',
        102130001,
        '${JSON.stringify({
          beneficiary: wallets[0],
          bytecode: vestingJSON.bytecode,
          startTimestamp: currentDateTime,
          cliffInMonth: 12,
          monthlyRelease: 1000,
        })}',
        'NEW',
        'VESTING',
        '0x',
        '${ZeroHash}',
        '${zeroDateTime}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1021302,
        '${wallets[0]}',
        102130002,
        '${JSON.stringify({
          beneficiary: wallets[0],
          bytecode: vestingJSON.bytecode,
          startTimestamp: currentDateTime,
          cliffInMonth: 12,
          monthlyRelease: 1000,
        })}',
        'NEW',
        'VESTING',
        '0x',
        '${ZeroHash}',
        '${zeroDateTime}',
        2,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1021303,
        '${wallets[0]}',
        102130003,
        '${JSON.stringify({
          beneficiary: wallets[0],
          bytecode: vestingJSON.bytecode,
          startTimestamp: currentDateTime,
          cliffInMonth: 12,
          monthlyRelease: 1000,
        })}',
        'REDEEMED',
        'VESTING',
        '0x',
        '${ZeroHash}',
        '${zeroDateTime}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1021304,
        '${wallets[1]}',
        102130004,
        '${JSON.stringify({
          beneficiary: wallets[1],
          bytecode: vestingJSON.bytecode,
          startTimestamp: currentDateTime,
          cliffInMonth: 12,
          monthlyRelease: 1000,
        })}',
        'NEW',
        'VESTING',
        '0x',
        '${ZeroHash}',
        '${zeroDateTime}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1021305,
        '${wallets[2]}',
        102130005,
        '${JSON.stringify({
          beneficiary: wallets[2],
          bytecode: vestingJSON.bytecode,
          startTimestamp: currentDateTime,
          cliffInMonth: 12,
          monthlyRelease: 1000,
        })}',
        'NEW',
        'VESTING',
        '0x',
        '${ZeroHash}',
        '${zeroDateTime}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.claim RESTART IDENTITY CASCADE;`);
  }
}
