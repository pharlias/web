import { gql } from "graphql-request";

export const queryETHTransferToPNSs = (address: string) => {
  return gql`
    query {
      eTHTransferToPNSs(
        orderBy: "blockTimestamp"
        orderDirection: "desc"
        where: {sender: "${address}"}
      ){
        items {
          id
          name
          amount
          sender
          blockNumber
          blockTimestamp
          transactionHash
        }
      }
    }
  `;
};
