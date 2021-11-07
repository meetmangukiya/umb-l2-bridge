import { SyncOutlined } from "@ant-design/icons";
import { utils } from "ethers";
import { Button, Card, DatePicker, Divider, Input, Progress, Slider, Spin, Switch } from "antd";
import React, { useState } from "react";
import { Address, Balance, Events } from "../components";

export default function ExampleUI({
  purpose,
  address,
  mainnetProvider,
  localProvider,
  yourLocalBalance,
  price,
  tx,
  readContracts,
  writeContracts,
}) {
  const [newPurpose, setNewPurpose] = useState("loading...");

  return (
    <div>
      {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}
      <div style={{ textAlign: "left", display: "inline-block", marginTop: "24px", maxWidth: "600px" }}>
        <h1 id="umbrella-l2-bridge">Umbrella L2 Bridge</h1>
        <h2 id="intro">Intro</h2>
        <p>Umbrella oracles provide two types of data:</p>
        <ol>
          <li>
            <strong>First-Class Data(FCD)</strong>: First-class data is key-value pairs that are available and committed
            on-chain. More details{" "}
            <a href="https://umbrella-network.readme.io/docs/intro-to-first-class-data-fcd">here</a>.
          </li>
          <li>
            <strong>Level-2(L2) Data</strong>: Level-2 data are key-value pairs that are relatively uncommon and are not
            committed on-chain. Only the merkle root is published on-chain. More details{" "}
            <a href="https://umbrella-network.readme.io/docs/intro-to-layer-2-data-l2d">here</a>.
          </li>
        </ol>
        <h2 id="problem">Problem</h2>
        <p>
          What this means is if a smart contract wants to use an L2 key-pair, it won&#39;t be able to because L2-data is
          published on-chain.
        </p>
        <h2 id="solution">Solution</h2>
        <p>
          This project solves this problem by creating a service that monitors for data requests using the{" "}
          <code>DataRequest</code> event emitted by the contract. Whenever this event is fired, the worker service gets
          data from the umbrella L2 chain using the umbrella API, and submit the data along with proofs that are first
          validated by the <code>Chain</code> contract&#39;s <code>verifyProofForBlock</code> method. If the data is
          valid, the data is published on-chain within the bridge contract that can be queried for. Another event{" "}
          <code>DataUpdated</code> event is also emitted everytime the data is updated that can be watched for to react
          to the data availability.
        </p>
        <h2 id="flow">Flow</h2>
      </div>
      <p style={{ paddingBottom: "30px" }}>
        <img src="./flow.mmd.png" alt="Flowchart" />
      </p>
    </div>
  );
}
