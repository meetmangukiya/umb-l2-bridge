const dotenv = require("dotenv");
const bridgeContractAddress = require("./contracts/UMBL2Bridge.address");
dotenv.config();

module.exports = {
  contractRegistryAddress: process.env.CONTRACT_REGISTRY_ADDRESS,
  apiKey: process.env.UMBRELLA_API_KEY,
  chainId: process.env.CHAIN_ID,
  rpcUrl: process.env.RPC_URL,
  bridgeContractAddress,
};
