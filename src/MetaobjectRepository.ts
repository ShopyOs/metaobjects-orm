import type { GraphQLClient } from "@shopify/graphql-client";
import { createGraphQLClient } from "@shopify/graphql-client";
import { LATEST_API_VERSION } from "@shopify/shopify-api";
import type { Metaobject } from "./Metaobject";
import {MetaobjectResponse} from "./MetaobjectResponse";

export class MetaobjectRepository {

  private client: GraphQLClient;
  constructor(shop: string, token: string) {
    this.client = createGraphQLClient({
      url: `https://${shop}/admin/api/${LATEST_API_VERSION}/graphql.json`,
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token,
      },
      retries: 1
    });
  }

  public async save(metaobject: Metaobject): Promise<void> {
    await this.client.request(
      this.CREATE_METAOBJECT,
      {
        variables: {
          handle: {
            type: metaobject.type,
            handle: metaobject.handle
          },
          metaobject: {
            fields: metaobject.fields
          }
        }
      }
    );
  }

  public async list(
    type: string,
    cursor: string|null = null,
    direction: string|null = 'next',
    offset: number|null = 10
  ): Promise<MetaobjectResponse> {
    const { data } = await this.client.request(
      this.LIST_METAOBJECTS_PAGINATED,
      {
        variables: {
          type,
          first: ('next' === direction) ? offset : null,
          last: ('prev' === direction) ? offset : null,
          after: ('next' === direction) ? cursor : null,
          before: ('prev' === direction) ? cursor : null
        }
      }
    );
    return {
      data: data?.metaobjects?.edges.map((edge: any) => {
        return {
          id: edge.node.id,
          handle: edge.node.handle,
          fields: edge.node.fields
        };
      }) ?? [],
      pagination:  {
        startCursor: data?.metaobjects?.pageInfo.startCursor,
        endCursor: data?.metaobjects?.pageInfo.endCursor,
        hasNextPage: data?.metaobjects?.pageInfo.hasNextPage,
        hasPreviousPage: data?.metaobjects?.pageInfo.hasPreviousPage
      }
    };
  }

  public async get(handle: string, type: string): Promise<Metaobject|null> {
    const { data } = await this.client.request(
      this.GET_METAOBJECT_BY_HANDLE,
      {
        variables: {
          handle: {
            type,
            handle
          }
        }
      }
    );
    return data?.metaobjectByHandle ? {
      id: data.metaobjectByHandle?.id,
      handle: data.metaobjectByHandle?.handle,
      fields: data.metaobjectByHandle?.fields
    } : null;
  }

  public async getById(id: string): Promise<Metaobject|null> {
    const { data } = await this.client.request(
      this.GET_METAOBJECT_BY_ID,
      {
        variables: {
          id
        }
      }
    );
    return data?.metaobject ? {
      id: data.metaobject.id,
      handle: data.metaobject.handle,
      fields: data.metaobject.fields
    } : null;
  }

  public async delete(id: string): Promise<void> {
    await this.client.request(
      this.DELETE_METAOBJECT,
      {
        variables: {
          id
        }
      }
    );
  }

  DELETE_METAOBJECT: string = `
    mutation DeleteMetaobject($id: ID!) {
      metaobjectDelete(id: $id) {
        userErrors {
          field
          message
        }
      }
    }
  `;

  GET_METAOBJECT_BY_HANDLE: string = `
    query GetMetaobjectByHandle ($handle: MetaobjectHandleInput!) {
      metaobjectByHandle(handle: $handle) {
        handle,
        id,
        fields {
          key,
          value
        }
      }
    }
  `;

  GET_METAOBJECT_BY_ID: string = `
    query GetMetaobjectById ($id: ID!) {
      metaobject(id: $id) {
        handle,
        id,
        fields {
          key,
          value
        }
      }
    }
  `;

  LIST_METAOBJECTS_PAGINATED: string = `
    query ListMetaobjects ($type: String!, $first: Int, $last: Int, $after: String, $before: String) {
      metaobjects(type: $type, first: $first, last: $last, after: $after, before: $before) {
        edges {
          node {
            handle,
            id,
            fields {
              key,
              value
            }
          }
        },
        pageInfo {
          startCursor,
          hasNextPage,
          endCursor,
          hasPreviousPage
        }
      }
    }
  `;

  CREATE_METAOBJECT: string = `
    mutation UpsertMetaobject($handle: MetaobjectHandleInput!, $metaobject: MetaobjectUpsertInput!) {
      metaobjectUpsert(handle: $handle, metaobject: $metaobject) {
        metaobject {
          handle
        }
        userErrors {
          field
          message
          code
        }
      }
    }
  `;
}
