import { gql } from "graphql-request";

export const queryDomainRegistereds = (address: string) => {
  return gql`
    query {
      domainRegistereds(
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
        }
      }
    }
  `;
};
