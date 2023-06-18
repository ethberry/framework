import { MigrationInterface, QueryRunner } from "typeorm";
import { ZeroHash, WeiPerEther } from "ethers";

import { wallet, wallets } from "@gemunion/constants";
import { ns } from "@framework/constants";

export class SeedEventHistoryErc20ClaimAt1563804040330 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const exchangeAddress = process.env.EXCHANGE_ADDR || wallet;
    const erc20TokenSimpleAddress = process.env.ERC20_SIMPLE_ADDR || wallet;
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
        10202010,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Claim',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "1020201",
          items: [[1, erc20TokenSimpleAddress, "1020101", WeiPerEther.toString()]],
        })}',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10202011,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        10202010,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10202020,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Claim',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "1020202",
          items: [[1, erc20TokenSimpleAddress, "1020101", WeiPerEther.toString()]],
        })}',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10202021,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        10202020,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10202030,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Claim',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "1020203",
          items: [[1, erc20TokenSimpleAddress, "1020101", WeiPerEther.toString()]],
        })}',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10202031,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        10202030,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10202040,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Claim',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "1020204",
          items: [[1, erc20TokenSimpleAddress, "1020101", WeiPerEther.toString()]],
        })}',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10202041,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        10202040,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10202050,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Claim',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "1020205",
          items: [
            [1, erc20TokenSimpleAddress, "1020101", WeiPerEther.toString()],
            [1, erc20TokenSimpleAddress, "1020101", WeiPerEther.toString()],
          ],
        })}',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10202051,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        10202050,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10202052,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        10202050,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10202060,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Claim',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "1020206",
          items: [
            [1, erc20TokenSimpleAddress, "1020101", WeiPerEther.toString()],
            [1, erc20TokenSimpleAddress, "1020101", WeiPerEther.toString()],
          ],
        })}',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10202061,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        10202060,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10202062,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        10202060,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10202070,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Claim',
        '${JSON.stringify({
          from: wallets[1],
          externalId: "1020207",
          items: [[1, erc20TokenSimpleAddress, "1020101", WeiPerEther.toString()]],
        })}',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10202071,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[1],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        10202070,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10202080,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Claim',
        '${JSON.stringify({
          from: wallets[1],
          externalId: "1020208",
          items: [
            [1, erc20TokenSimpleAddress, "1020101", WeiPerEther.toString()],
            [1, erc20TokenSimpleAddress, "1020101", WeiPerEther.toString()],
          ],
        })}',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10202081,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[1],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        10202080,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10202082,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[1],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        10202080,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10202090,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Claim',
        '${JSON.stringify({
          from: wallets[2],
          externalId: "1020209",
          items: [[1, erc20TokenSimpleAddress, "1020101", WeiPerEther.toString()]],
        })}',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10202091,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[2],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        10202090,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10202100,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Claim',
        '${JSON.stringify({
          from: wallets[2],
          externalId: "1020210",
          items: [
            [1, erc20TokenSimpleAddress, "1020101", WeiPerEther.toString()],
            [1, erc20TokenSimpleAddress, "1020101", WeiPerEther.toString()],
          ],
        })}',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10202101,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[2],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        10202100,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10202102,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[2],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        10202100,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.event_history RESTART IDENTITY CASCADE;`);
  }
}
