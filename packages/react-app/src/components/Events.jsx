import { List } from "antd";
import { useEventListener } from "eth-hooks/events/useEventListener";
import { Address } from "../components";
import { ethers } from "ethers";

/*
  ~ What it does? ~

  Displays a lists of events

  ~ How can I use? ~

  <Events
    contracts={readContracts}
    contractName="YourContract"
    eventName="SetPurpose"
    localProvider={localProvider}
    mainnetProvider={mainnetProvider}
    startBlock={1}
  />
*/

export default function Events({ contracts, contractName, eventName, localProvider, mainnetProvider, startBlock }) {
  // 📟 Listen for broadcast events
  const events = useEventListener(contracts, contractName, eventName, localProvider, startBlock);
  const dataRequestEvents = useEventListener(contracts, "UMBL2Bridge", "DataRequest", localProvider, startBlock);
  const dataUpdatedEvents = useEventListener(contracts, "UMBL2Bridge", "DataUpdated", localProvider, startBlock);
  console.log(dataRequestEvents);

  return (
    <div style={{ width: 800, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
      <h2>Events:</h2>
      <List
        bordered
        dataSource={[...dataRequestEvents, ...dataUpdatedEvents].sort(x => x.blockNumber)}
        renderItem={item => {
          if (item.event === "DataRequest")
            return (
              <List.Item key={item.blockNumber + "_" + item.args.sender + "_" + item.args.purpose}>
                <Address address={item.args[0]} ensProvider={mainnetProvider} fontSize={16} /> <br />
                Requested key: {item.args[1]}
              </List.Item>
            );
          else {
            return (
              <List.Item key={item.blockNumber + "_" + item.args.sender + "_" + item.args.purpose}>
                Data Updated: <br />
                Key: {item.args.key} <br />
                Value: {ethers.utils.formatEther(item.args.value)} <br />
                Timestamp: {item.args.timestamp.toString()}
              </List.Item>
            );
          }
        }}
      />
    </div>
  );
}
