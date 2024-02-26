import {MetaobjectSetupManager} from "./MetaobjectSetupManager";
import {Definition} from "./Definition/Definition";
import {MetaobjectRepository} from "./MetaobjectRepository";
import {Metaobject} from "./Metaobject";

export const metaobject = {
  definition: {
    save: async function (shop: string, token: string, definition: Definition): Promise<void> {
      const repository = new MetaobjectSetupManager(shop, token);
      await repository.createDefinition(definition);
    },
    delete: async function (shop: string, token: string, id: string): Promise<void> {
      const repository = new MetaobjectSetupManager(shop, token);
      await repository.removeDefinition(id);
    },
    get: async function (shop: string, token: string, type: string): Promise<string | null> {
      const repository = new MetaobjectSetupManager(shop, token);
      return await repository.getDefinitionId(type);
    }
  },
  manager: {
    save: async function (shop: string, token: string, metaobject: Metaobject): Promise<void> {
      const repository = new MetaobjectRepository(shop, token);
      return await repository.save(metaobject);
    },
    list: async function (shop: string, token: string, type: string): Promise<Metaobject[]> {
      const repository = new MetaobjectRepository(shop, token);
      return await repository.list(type);
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
