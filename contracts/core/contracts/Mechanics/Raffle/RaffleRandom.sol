// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "@gemunion/contracts-mocks/contracts/Wallet.sol";
import "@gemunion/contracts-misc/contracts/constants.sol";

import "../../Exchange/ExchangeUtils.sol";
import "../../utils/constants.sol";
import "../../utils/errors.sol";

import "./interfaces/IERC721RaffleTicket.sol";
import "./interfaces/IRaffle.sol";

abstract contract RaffleRandom is AccessControl, Pausable, Wallet {
  using Address for address;
  using SafeERC20 for IERC20;
  using Counters for Counters.Counter;

  uint256 internal immutable _timeLag; // TODO change in production: release after 2592000 seconds = 30 days (dev: 2592)
  uint256 internal immutable comm; // commission 30%

  event RoundStarted(uint256 round, uint256 startTimestamp);
  event RoundEnded(uint256 round, uint256 endTimestamp);
  event RoundFinalized(uint256 round, uint256 prizeNumber);
  event Released(uint256 round, uint256 amount);
  event Prize(address account, uint256 ticketId, uint256 amount);

  // RAFFLE
  struct Round {
    uint256 roundId;
    uint256 startTimestamp;
    uint256 endTimestamp;
    uint256 balance; // left after get prize
    uint256 total; // max money before
    Counters.Counter ticketCounter; // all round tickets counter
    uint256 prizeNumber; // prize number
    uint256 requestId;
    uint256 maxTicket;
    // TODO Asset[]?
    Asset acceptedAsset;
    Asset ticketAsset;
  }

  Round[] internal _rounds;

  constructor(Raffle memory config) {
    address account = _msgSender();
    _grantRole(DEFAULT_ADMIN_ROLE, account);
    _grantRole(PAUSER_ROLE, account);
    _grantRole(MINTER_ROLE, account);

    // SET Raffle Config
    _timeLag = config.timeLagBeforeRelease;
    comm = config.commission;

    Round memory rootRound;
    rootRound.startTimestamp = block.timestamp;
    rootRound.endTimestamp = block.timestamp;
    _rounds.push(rootRound);
  }

  // TICKET
  function printTicket(
    address account
  ) external onlyRole(MINTER_ROLE) whenNotPaused returns (uint256 tokenId, uint256 roundId) {
    roundId = _rounds.length - 1;
    Round storage currentRound = _rounds[roundId];

    if (currentRound.endTimestamp != 0) {
      revert WrongRound();
    }

    // allow all
    if (currentRound.maxTicket > 0 && currentRound.ticketCounter.current() >= currentRound.maxTicket) {
      revert LimitExceed();
    }

    // workaround for struct
    Counters.increment(currentRound.ticketCounter);

    currentRound.balance += currentRound.acceptedAsset.amount;
    currentRound.total += currentRound.acceptedAsset.amount;

    tokenId = IERC721RaffleTicket(currentRound.ticketAsset.token).mintTicket(account, roundId);
  }

  function startRound(Asset memory ticket, Asset memory price, uint256 maxTicket) public onlyRole(DEFAULT_ADMIN_ROLE) {
    Round memory prevRound = _rounds[_rounds.length - 1];
    if (prevRound.endTimestamp == 0) revert NotComplete();

    Round memory nextRound;
    _rounds.push(nextRound);

    uint256 roundNumber = _rounds.length - 1;

    Round storage currentRound = _rounds[roundNumber];
    currentRound.roundId = roundNumber;
    currentRound.startTimestamp = block.timestamp;
    currentRound.maxTicket = maxTicket;
    currentRound.ticketAsset = ticket;
    currentRound.acceptedAsset = price;

    emit RoundStarted(roundNumber, block.timestamp);
  }

  // TODO could be too much data to return
  //  function getAllRounds() public view returns (Round[] memory) {
  //    return _rounds;
  //  }

  // GETTERS
  function getRoundsCount() public view returns (uint256) {
    return _rounds.length;
  }

  function getRound(uint256 roundId) public view returns (Round memory) {
    if (_rounds.length < roundId) revert NotExist();
    return _rounds[roundId];
  }

  function getCurrentRoundInfo() public view returns (RoundInfo memory) {
    Round storage round = _rounds[_rounds.length - 1];
    return
      RoundInfo(
        round.roundId,
        round.startTimestamp,
        round.endTimestamp,
        round.maxTicket,
        round.acceptedAsset,
        round.ticketAsset
      );
  }

  // RANDOM
  function getRandomNumber() internal virtual returns (uint256 requestId);

  function endRound() external onlyRole(DEFAULT_ADMIN_ROLE) {
    uint256 roundNumber = _rounds.length - 1;
    Round storage currentRound = _rounds[roundNumber];

    // TODO should never happen?
    if (currentRound.roundId != roundNumber) {
      revert WrongRound();
    }

    if (currentRound.endTimestamp != 0) {
      revert NotActive();
    }

    currentRound.endTimestamp = block.timestamp;
    currentRound.requestId = getRandomNumber();

    uint256 commission = (currentRound.total * comm) / 100;
    currentRound.total -= commission;

    emit RoundEnded(roundNumber, block.timestamp);
  }

  function releaseFunds(uint256 roundNumber) external onlyRole(DEFAULT_ADMIN_ROLE) {
    Round storage currentRound = _rounds[roundNumber];
    if (block.timestamp <= currentRound.endTimestamp + _timeLag) revert NotComplete();
    if (currentRound.balance == 0) revert ZeroBalance();

    uint256 roundBalance = currentRound.balance;
    currentRound.balance = 0;

    currentRound.acceptedAsset.amount = roundBalance;
    ExchangeUtils.spend(
      ExchangeUtils._toArray(currentRound.acceptedAsset),
      _msgSender(),
      DisabledTokenTypes(false, false, false, false, false)
    );

    emit Released(roundNumber, roundBalance);
  }

  // ROUND

  function fulfillRandomWords(uint256, uint256[] memory randomWords) internal virtual {
    Round storage currentRound = _rounds[_rounds.length - 1];

    // calculate wining numbers
    uint256 len = currentRound.ticketCounter.current();
    uint256 prizeNumber = randomWords[0] % len;

    // in case number is Zero - winner tokenId is 1
    currentRound.prizeNumber = prizeNumber == 0 ? prizeNumber + 1 : prizeNumber;

    emit RoundFinalized(currentRound.roundId, prizeNumber);
  }

  function getPrize(uint256 tokenId) external {
    uint256 roundNumber = _rounds.length - 1;
    Round storage currentRound = _rounds[roundNumber];
    uint256 prizeNumber = currentRound.prizeNumber;

    IERC721RaffleTicket ticketFactory = IERC721RaffleTicket(currentRound.ticketAsset.token);
    ticketFactory.burn(tokenId);

    if (tokenId == prizeNumber) {
      emit Prize(_msgSender(), tokenId, 0);
    }
  }

  // PAUSABLE

  function pause() public onlyRole(PAUSER_ROLE) {
    _pause();
  }

  function unpause() public onlyRole(PAUSER_ROLE) {
    _unpause();
  }

  // COMMON
  receive() external payable override {
    revert();
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(AccessControl, Wallet) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
