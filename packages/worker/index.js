const ethers = require("ethers");
const {
  ContractRegistry,
  ChainContract,
  APIClient,
  LeafKeyCoder,
} = require("@umb-network/toolbox");

const UMBL2BridgeABI = require("./contracts/UMBL2Bridge.abi");
const config = require("./config");

const processDataRequest = async ({
  requesterAddress,
  requestedKey,
  apiClient,
  umbl2bridgeContract,
}) => {
  const decodedKey = LeafKeyCoder.decode(requestedKey);
  console.log(
    new Date(),
    `processing data request for "${decodedKey}" from ${requesterAddress}`
  );
  const proofs = await apiClient.getProofs([decodedKey]);
  const leaves = proofs.leaves[0];
  await umbl2bridgeContract.updateCurrentValue(
    leaves.blockId,
    leaves.proof,
    requestedKey,
    leaves.value,
    Math.ceil(proofs.block.dataTimestamp.getTime() / 1000)
  );
  console.log(new Date(), `l2 data of key "${decodedKey}" published on-chain`);
};

const startProcessingDataRequests = async (
  provider,
  apiClient,
  umbl2bridgeContract
) => {
  const umbL2BridgeContract = new ethers.Contract(
    config.bridgeContractAddress,
    UMBL2BridgeABI,
    provider
  );

  umbL2BridgeContract.on("DataRequest", (requesterAddress, requestedKey) => {
    processDataRequest({
      requesterAddress,
      requestedKey,
      apiClient,
      umbl2bridgeContract,
    }).catch((err) => console.log(new Date(), err));
  });
};

const main = async () => {
  const provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);
  const signer = new ethers.Wallet(
    "561759344452879a29971b08f887fdae4be577e7a58580c43c1f39bc395e12af",
    provider
  );
  console.log(new Date(), "signer address:", signer.address);

  const chainContractAddress = await new ContractRegistry(
    provider,
    config.contractRegistryAddress
  ).getAddress("Chain");
  const chainContract = new ChainContract(provider, chainContractAddress);

  const apiClient = new APIClient({
    apiKey: config.apiKey,
    baseURL: `https://api.sbx.umb.network/`,
    chainId: config.chainId,
    chainContract,
  });

  const umbl2bridgeContract = new ethers.Contract(
    config.bridgeContractAddress,
    UMBL2BridgeABI,
    signer
  );
  startProcessingDataRequests(provider, apiClient, umbl2bridgeContract);
};

main().catch((err) => console.trace(err));
