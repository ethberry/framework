// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.9;

import "../interfaces/IStateHash.sol";

abstract contract StateHash is IStateHash {
  // tokenId => last state hash indicator
  mapping(uint256 => bytes32) internal tokenIdToStateHash;

  function stateHash(uint256 tokenId) external view returns (bytes32) {
    bytes32 stateHash = tokenIdToStateHash[tokenId];
    require(stateHash != 0, "CTD:0 hash");
    return stateHash;
  }

  function _localRootId(uint256 tokenId) internal view virtual returns (uint256);

  function _beforeTokenTransfer(
    address from,
    address,
    uint256 tokenId
  ) internal virtual {
    if (from == address(0)) {
      tokenIdToStateHash[tokenId] = keccak256(abi.encodePacked(address(this), tokenId));
    }
  }

  function balanceOfERC20(uint256 tokenId, address erc20Contract) external view virtual returns (uint256);

  function _afterReceivedERC20(
    address,
    uint256 tokenId,
    address erc20Contract,
    uint256
  ) internal virtual {
    uint256 balance = this.balanceOfERC20(tokenId, erc20Contract);
    uint256 rootId = _localRootId(tokenId);
    tokenIdToStateHash[rootId] = keccak256(
      abi.encodePacked(tokenIdToStateHash[rootId], tokenId, erc20Contract, balance)
    );
  }

  function _afterRemoveERC20(
    uint256 _tokenId,
    address,
    address _erc20Contract,
    uint256
  ) internal virtual {
    uint256 balance = this.balanceOfERC20(_tokenId, _erc20Contract);
    uint256 rootId = _localRootId(_tokenId);
    tokenIdToStateHash[rootId] = keccak256(
      abi.encodePacked(tokenIdToStateHash[rootId], _tokenId, _erc20Contract, balance)
    );
  }

  function _afterReceiveERC721(
    address,
    uint256 _tokenId,
    address _childContract,
    uint256 _childTokenId
  ) internal virtual {
    uint256 rootId = _localRootId(_tokenId);
    if (_childContract == address(this)) {
      tokenIdToStateHash[rootId] = keccak256(
        abi.encodePacked(tokenIdToStateHash[rootId], _tokenId, _childContract, tokenIdToStateHash[_childTokenId])
      );
    } else {
      tokenIdToStateHash[rootId] = keccak256(
        abi.encodePacked(tokenIdToStateHash[rootId], _tokenId, _childContract, _childTokenId)
      );
    }
  }

  function _afterRemoveERC721(
    uint256 _tokenId,
    address _childContract,
    uint256 _childTokenId
  ) internal virtual {
    uint256 rootId = _localRootId(_tokenId);
    if (_childContract == address(this)) {
      bytes32 rootStateHash = tokenIdToStateHash[rootId];
      bytes32 childStateHash = tokenIdToStateHash[_childTokenId];
      tokenIdToStateHash[rootId] = keccak256(abi.encodePacked(rootStateHash, _tokenId, _childContract, childStateHash));
      tokenIdToStateHash[_childTokenId] = keccak256(
        abi.encodePacked(rootStateHash, _childTokenId, _childContract, childStateHash)
      );
    } else {
      tokenIdToStateHash[rootId] = keccak256(
        abi.encodePacked(tokenIdToStateHash[rootId], _tokenId, _childContract, _childTokenId)
      );
    }
  }

  function balanceOfERC1155(
    uint256 _tokenId,
    address _erc1155Contract,
    uint256 childTokenId
  ) external view virtual returns (uint256);

  function _afterReceiveERC1155(
    address,
    address,
    uint256 _tokenId,
    address _erc1155Contract,
    uint256[] memory _childTokenIds,
    uint256[] memory,
    bytes memory
  ) internal virtual {
    uint256 rootId = _localRootId(_tokenId);
    bytes32 _newStateHash = tokenIdToStateHash[rootId];
    for (uint256 i = 0; i < _childTokenIds.length; ++i) {
      uint256 balance = this.balanceOfERC1155(_tokenId, _erc1155Contract, _childTokenIds[i]);
      _newStateHash = keccak256(
        abi.encodePacked(_newStateHash, _tokenId, _erc1155Contract, _childTokenIds[i], balance)
      );
    }
    tokenIdToStateHash[rootId] = _newStateHash;
  }

  function _afterRemoveERC1155(
    address,
    uint256 _tokenId,
    address,
    address _erc1155Contract,
    uint256[] memory _childTokenIds,
    uint256[] memory,
    bytes memory
  ) internal virtual {
    uint256 rootId = _localRootId(_tokenId);
    bytes32 _newStateHash = tokenIdToStateHash[rootId];
    for (uint256 i = 0; i < _childTokenIds.length; ++i) {
      uint256 balance = this.balanceOfERC1155(_tokenId, _erc1155Contract, _childTokenIds[i]);
      _newStateHash = keccak256(
        abi.encodePacked(_newStateHash, _tokenId, _erc1155Contract, _childTokenIds[i], balance)
      );
    }
    tokenIdToStateHash[rootId] = _newStateHash;
  }
}
