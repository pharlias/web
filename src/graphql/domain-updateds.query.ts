import { gql } from "graphql-request";

export const queryDomainUpdateds = (after: string | null = null) => {
  return gql`
    query {
      domainUpdateds(
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
          status
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

export const queryDomainUpdatedsUser = (address: string, after: string | null = null) => {
  return gql`
    query {
      domainUpdateds(
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
          status
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