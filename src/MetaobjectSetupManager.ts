import type { Definition } from "./Definition/Definition";
import type { GraphQLClient} from "@shopify/graphql-client";
import {createGraphQLClient} from "@shopify/graphql-client";
import {LATEST_API_VERSION} from "@shopify/shopify-api";

export class MetaobjectSetupManager {
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

  public async getDefinitionId(type: string): Promise<string|null> {
    const { data } = await this.client.request(
      this.GET_DEFINITION_BY_TYPE, {
        variables: {
          type: type
        }
      }
    );
    return data?.metaobjectDefinitionByType?.id ?? null;
  }

  public async createDefinition(definition: Definition): Promise<void> {
    const { errors } = await this.client.request(
      this.CREATE_DEFINITION_MUTATION, {
        variables: {
          definition: {
            name: definition.name,
            type: definition.type,
            access: {
              storefront: definition.is_public ? 'PUBLIC_READ' : 'NONE'
            },
            fieldDefinitions: definition.fields
          }
        }
      }
    );
    if (errors) {
      console.error(errors?.graphQLErrors)
    }
  }

  public async removeDefinition(id: string): Promise<void> {
    const { data, errors } = await this.client.request(
      this.REMOVE_DEFINITION, {
        variables: {
          id
        }
      }
    );

    console.log(data, errors);
  }

  GET_DEFINITION_BY_TYPE: string = `
    query ($type: String!) {
      metaobjectDefinitionByType (type: $type) {
        id
      }
    }
  `;

  REMOVE_DEFINITION: string = `
    mutation metaobjectDefinitionDelete($id: ID!) {
      metaobjectDefinitionDelete(id: $id) {
        deletedId
        userErrors {
          field
          message
        }
      }
    }
  `;

  CREATE_DEFINITION_MUTATION: string = `
    mutation CreateMetaobjectDefinition($definition: MetaobjectDefinitionCreateInput!) {
      metaobjectDefinitionCreate(definition: $definition) {
        metaobjectDefinition {
          name
          type
          fieldDefinitions {
            name
            key
          }
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
