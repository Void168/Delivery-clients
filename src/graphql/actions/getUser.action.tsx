"use client";

import { gql, DocumentNode } from "@apollo/client";

export const GET_USER: DocumentNode = gql`
  query {
    getLoggedInUser {
      user {
        id
        name
        email
        address
      }
      accessToken
      refreshToken
    }
  }
`;