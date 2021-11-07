import { PageHeader } from "antd";
import React from "react";

// displays a page header

export default function Header() {
  return (
    <a href="https://github.com/meetmangukiya/umb-l2-bridge" target="_blank" rel="noopener noreferrer">
      <PageHeader
        title="🌉 Umbrella L2 Bridge"
        subTitle="Umbrella L2 Bridge to request for L2 data to be published on-chain."
        style={{ cursor: "pointer" }}
      />
    </a>
  );
}
