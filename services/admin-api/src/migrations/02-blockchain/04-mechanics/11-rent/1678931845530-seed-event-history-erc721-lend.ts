import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther, ZeroHash } from "ethers";
import { subDays } from "date-fns";

import { wallet, wallets } from "@gemunion/constants";
import { ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedEventHistoryErc721LendAt1678931845530 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    const exchangeAddress = process.env.EXCHANGE_ADDR || wallet;
    const erc20TokenSimpleAddress = process.env.ERC20_SIMPLE_ADDR || wallet;
    const erc721ContractSimpleAddress = process.env.ERC721_RANDOM_ADDR || wallet;

    const now = new Date();
    const currentDateTime = now.toISOString();

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
        1303010,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Lend',
        '${JSON.stringify({
          from: wallets[0],
          to: wallets[1],
          expires: 1700000000,
          externalId: 1,
          item: [[2, erc721ContractSimpleAddress, "1030101", "1"]],
          price: [
            {
              tokenType: 1,
              token: erc20TokenSimpleAddress,
              tokenId: "1020101",
              amount: WeiPerEther.toString(),
            },
          ],
        })}',
        null,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        1303011,
        '${erc721ContractSimpleAddress}',
        '${ZeroHash}',
        'UpdateUser',
        '${JSON.stringify({
          tokenId: "103010101",
          user: wallets[1],
          expires: 1700000000,
        })}',
        1303010,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        1303012,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[1],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        1303010,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        1303020,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Lend',
        '${JSON.stringify({
          from: wallets[1],
          to: wallets[0],
          expires: 1700000000,
          externalId: 2,
          item: [[2, erc721ContractSimpleAddress, "1030101", "2"]],
          price: [
            {
              tokenType: 1,
              token: erc20TokenSimpleAddress,
              tokenId: "1020101",
              amount: WeiPerEther.toString(),
            },
          ],
        })}',
        null,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        1303021,
        '${erc721ContractSimpleAddress}',
        '${ZeroHash}',
        'UpdateUser',
        '${JSON.stringify({
          tokenId: "103010102",
          user: wallets[0],
          expires: 1700000000,
        })}',
        1303020,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        1303022,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        1303020,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.event_history RESTART IDENTITY CASCADE;`);
  }
}
