import { gql } from "graphql-request";

export const queryETHTransferToPNSs = (address: string, after: string | null = null) => {
  return gql`
    query {
      eTHTransferToPNSs(
        orderBy: "blockTimestamp"
        orderDirection: "desc"
        where: {sender: "${address}"}
        ${after ? `after: "${after}"` : ""}
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
        pageInfo {
          startCursor
          endCursor
          hasPreviousPage
          hasNextPage
        }
        totalCount
      }
    }
  `;
};
