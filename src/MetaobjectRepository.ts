import type { GraphQLClient } from "@shopify/graphql-client";
import { createGraphQLClient } from "@shopify/graphql-client";
import { LATEST_API_VERSION } from "@shopify/shopify-api";
import type { Metaobject } from "./Metaobject";

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

  public async list(type: string): Promise<Metaobject[]> {
    const { data } = await this.client.request(
      this.LIST_METAOBJECTS,
      {
        variables: {
          type: type
        }
      }
    );
    return data?.metaobjects?.edges.map((edge: any) => {
      return {
        id: edge.node.id,
        handle: edge.node.handle,
        fields: edge.node.fields
      };
    }) ?? [];
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

  LIST_METAOBJECTS: string = `
    query ListMetaobjects ($type: String!) {
      metaobjects(type: $type, first: 10) {
        edges {
          node {
            handle,
            id,
            fields {
              key,
              value
            }
          }
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
