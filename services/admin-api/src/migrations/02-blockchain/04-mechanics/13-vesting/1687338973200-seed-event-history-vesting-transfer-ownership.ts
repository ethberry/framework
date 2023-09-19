import { MigrationInterface, QueryRunner } from "typeorm";
import { ZeroHash } from "ethers";

import { wallet, wallets } from "@gemunion/constants";
import { ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedEventHistoryVestingTransferOwnershipAt1687338973200 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    const vestingAddress = process.env.VESTING_ADDR || wallet;
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.event_history (
        id,
        address,
        transaction_hash,
        event_type,
        event_data,
        created_at,
        updated_at
      ) VALUES (
        11200001,
        '${vestingAddress}',
        '${ZeroHash}',
        'OwnershipTransferred',
        '${JSON.stringify({
          previousOwner: wallets[0],
          newOwner: wallets[1],
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        11200002,
        '${vestingAddress}',
        '${ZeroHash}',
        'OwnershipTransferred',
        '${JSON.stringify({
          previousOwner: wallets[0],
          newOwner: wallets[2],
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        11200003,
        '${vestingAddress}',
        '${ZeroHash}',
        'OwnershipTransferred',
        '${JSON.stringify({
          previousOwner: wallets[1],
          newOwner: wallets[0],
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        11200004,
        '${vestingAddress}',
        '${ZeroHash}',
        'OwnershipTransferred',
        '${JSON.stringify({
          previousOwner: wallets[1],
          prevnewOwneriousOwner: wallets[2],
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        11200005,
        '${vestingAddress}',
        '${ZeroHash}',
        'OwnershipTransferred',
        '${JSON.stringify({
          previousOwner: wallets[2],
          newOwner: wallets[0],
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        11200006,
        '${vestingAddress}',
        '${ZeroHash}',
        'OwnershipTransferred',
        '${JSON.stringify({
          previousOwner: wallets[2],
          newOwner: wallets[1],
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.event_history RESTART IDENTITY CASCADE;`);
  }
}
