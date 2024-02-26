import {MetaobjectSetupManager} from "../MetaobjectSetupManager";
import type {Definition} from "../Definition/Definition";
import {readFileSync} from 'fs';

export const installAppSchema =
  async function (shop: string, token: string): Promise<void> {
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
  }

export const uninstallAppSchema =
  async function (shop: string, token: string): Promise<void> {
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
