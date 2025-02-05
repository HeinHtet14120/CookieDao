import React from "react";

const TokenList = ({ tokens }: { tokens: any[] }) => {
  return (
    <ul style={styles.list}>
      {tokens.map((token, index) => (
        <li key={index} style={styles.listItem}>
          <strong>{token.chain}</strong>: {token.contractAddress}
        </li>
      ))}
    </ul>
  );
};

const styles = {
  list: {
    listStyle: "none",
    padding: "0",
  },
  listItem: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
  },
};

export default TokenList;
