import { gql } from "graphql-request";

export const queryDomainRegistereds = (after: string | null = null) => {
  return gql`
    query {
      domainRegistereds(
        orderBy: "blockTimestamp"
        orderDirection: "desc"
        ${after ? `after: "${after}"` : ""}
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

export const queryDomainRegisteredsUser = (address: string, after: string | null = null) => {
  return gql`
    query {
      domainRegistereds(
        orderBy: "blockTimestamp"
        orderDirection: "desc"
        where: {owner: "${address}"}
        ${after ? `after: "${after}"` : ""}
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
