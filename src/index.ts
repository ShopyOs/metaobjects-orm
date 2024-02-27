import {MetaobjectSetupManager} from "./MetaobjectSetupManager";
import {Definition} from "./Definition/Definition";
import {MetaobjectRepository} from "./MetaobjectRepository";
import {Metaobject} from "./Metaobject";
import {readFileSync} from "fs";
import {MetaobjectResponse} from "./MetaobjectResponse";

export const metaobject = {
  schema: {
    install: async (shop: string, token: string): Promise<void> => {
      console.log('Installing app schema for shop: ' + shop);
      const manager = new MetaobjectSetupManager(shop, token);
      try {
        const schema: string = readFileSync('metaobject/schema.json', 'utf8');
        const definitions: Definition[] = JSON.parse(schema);
        for (const definition of definitions) {
          await Promise.all(definition.fields
            .filter(field => 'metaobject_reference' === field.type)
            .map(async field => {
              let validation = field.validations.find(validation => validation.name === 'metaobject_definition_id');
              if (validation && validation.value !== undefined) {
                validation.value = await manager.getDefinitionId(validation.value as string) ?? '';
              }
            }));
          await manager.createDefinition(definition);
        }
      } catch (e) {
        console.error('No schema is not defined');
        return;
      }
    },
    uninstall: async (shop: string, token: string): Promise<void> => {
      console.log('Uninstalling app schema for shop: ' + shop);
      const manager = new MetaobjectSetupManager(shop, token);
      try {
        const schema: string = readFileSync('metaobject/schema.json', 'utf8');
        const definitions: Definition[] = JSON.parse(schema);
        for (const definition of definitions) {
          const id = await manager.getDefinitionId(definition.type);
          if (null === id) {
            continue;
          }
          await manager.removeDefinition(id);
        }
      } catch (e) {
        console.error('No schema is not defined');
        return;
      }
    }
  },
  manager: {
    save: async function (shop: string, token: string, metaobject: Metaobject): Promise<void> {
      const repository = new MetaobjectRepository(shop, token);
      return await repository.save(metaobject);
    },
    list: async function (
      shop: string,
      token: string,
      type: string,
      cursor: string|null,
      direction: string|null,
      offset: number|null
    ): Promise<MetaobjectResponse> {
      const repository = new MetaobjectRepository(shop, token);
      return await repository.list(type, cursor, direction, offset);
    },
    get: async function (shop: string, token: string, type: string, id: string): Promise<Metaobject | null> {
      const repository = new MetaobjectRepository(shop, token);
      return await repository.get(type, id);
    },
    getById: async function (shop: string, token: string, id: string): Promise<Metaobject | null> {
      const repository = new MetaobjectRepository(shop, token);
      return await repository.getById(id);
    },
    delete: async function (shop: string, token: string, id: string): Promise<void> {
      const repository = new MetaobjectRepository(shop, token);
      return await repository.delete(id);
    }
  }
}
