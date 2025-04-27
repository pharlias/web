import { gql } from "graphql-request";

export const queryDomainUpdatedsUser = (address: string) => {
  return gql`
    query {
      domainUpdateds(
        orderBy: "blockTimestamp"
        orderDirection: "desc"
        where: {owner: "${address}"}
      ){
        items {
          blockNumber
          blockTimestamp
          expires
          id
          name
          owner
          tokenId
          transactionHash
          status
        }
      }
    }
  `;
};
