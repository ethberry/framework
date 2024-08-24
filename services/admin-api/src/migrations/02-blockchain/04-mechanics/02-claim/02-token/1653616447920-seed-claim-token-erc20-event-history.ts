import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther, ZeroHash } from "ethers";

import { wallets, NodeEnv } from "@gemunion/constants";
import { ns } from "@framework/constants";

export class SeedClaimTokenErc20EventHistoryAt1653616447920 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production || process.env.NODE_ENV === NodeEnv.test) {
      return;
    }

    const exchangeAddress = process.env.EXCHANGE_ADDR;
    const erc20TokenSimpleAddress = process.env.ERC20_SIMPLE_ADDR;
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.event_history (
        id,
        address,
        transaction_hash,
        event_type,
        event_data,
        parent_id,
        created_at,
        updated_at
      ) VALUES (
        102020110,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Claim',
        '${JSON.stringify({
          account: wallets[0],
          externalId: 1,
          items: [
            {
              tokenType: 1,
              token: erc20TokenSimpleAddress,
              tokenId: "1020101",
              amount: WeiPerEther.toString(),
            },
          ],
        })}',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        102020111,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: wallets[1],
          value: WeiPerEther.toString(),
        })}',
        102020110,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        102020210,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Claim',
        '${JSON.stringify({
          account: wallets[0],
          externalId: 1,
          items: [
            {
              tokenType: 1,
              token: erc20TokenSimpleAddress,
              tokenId: "1020401",
              amount: WeiPerEther.toString(),
            },
          ],
        })}',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        102020211,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: wallets[1],
          value: WeiPerEther.toString(),
        })}',
        102020210,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        102020310,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Claim',
        '${JSON.stringify({
          account: wallets[0],
          externalId: 2,
          items: [
            {
              tokenType: 1,
              token: erc20TokenSimpleAddress,
              tokenId: "1028001",
              amount: WeiPerEther.toString(),
            },
          ],
        })}',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        102020311,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: wallets[1],
          value: WeiPerEther.toString(),
        })}',
        102020310,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        102020410,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Claim',
        '${JSON.stringify({
          account: wallets[0],
          externalId: 5,
          items: [
            {
              tokenType: 1,
              token: erc20TokenSimpleAddress,
              tokenId: "2020101",
              amount: WeiPerEther.toString(),
            },
          ],
        })}',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        102020411,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: wallets[1],
          value: WeiPerEther.toString(),
        })}',
        102020410,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.event_history RESTART IDENTITY CASCADE;`);
  }
}
