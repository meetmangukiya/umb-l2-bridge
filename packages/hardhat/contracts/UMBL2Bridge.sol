pragma solidity >=0.8.0 <0.9.0;

// SPDX-License-Identifier: MIT
import "@umb-network/toolbox/dist/contracts/IRegistry.sol";
import "@umb-network/toolbox/dist/contracts/IChain.sol";


contract UMBL2Bridge {
  struct L2Value {
    uint256 value;
    uint256 timestamp;
  }

  mapping(bytes32 => L2Value) _currentValues;
  IRegistry contractRegistry = IRegistry(0x059FDd69e771645fe91d8E1040320DbB845cEaFd);

  event DataRequest(
    address indexed sender,
    bytes32 indexed key
  );

  event DataUpdated(
    bytes32 indexed key,
    uint256 value,
    uint256 timestamp
  );

  function getCurrentValue(bytes32 _key) public view returns (uint256 value, uint256 timestamp) {
    L2Value storage currentValue = _currentValues[_key];
    return (currentValue.value, currentValue.timestamp);
  }

  function getChainContract() public view returns (IChain) {
    return IChain(contractRegistry.getAddressByString("Chain"));
  }

  function getOnchainValueOrL2Value(bytes32 _key) public view returns (uint256 value, uint256 timestamp) {
    (uint256 val, uint256 ts) = getChainContract().getCurrentValue(_key);
    if (val == 0) {
      (uint256 _value, uint256 _timestamp) = getCurrentValue(_key);
      return (_value, _timestamp);
    }
    else {
      return (val, ts);
    }
  }

  function updateCurrentValue(
    uint256 _blockId,
    bytes32[] memory _proof,
    bytes memory _key,
    bytes memory _value,
    uint256 timestamp
  ) public {
    bool isValid = getChainContract().verifyProofForBlock(_blockId, _proof, _key, _value);

    bytes32 bytes32key;
    bytes32 bytes32value;

    assembly {
      bytes32key := mload(add(_key, 32))
      bytes32value := mload(add(_value, 32))
    }

    uint256 _decodedValue = uint256(bytes32value);
    require(isValid, "not a valid value");
    _currentValues[bytes32key] = L2Value(_decodedValue, timestamp);
    emit DataUpdated(bytes32key, _decodedValue, timestamp);
  }

  function reqeustL2Data(bytes32 _key) public {
    emit DataRequest(msg.sender, _key);
  }
}
