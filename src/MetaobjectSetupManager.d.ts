import type { Definition } from "./Definition/Definition";
export declare class MetaobjectSetupManager {
    private client;
    constructor(shop: string, token: string);
    getDefinitionId(type: string): Promise<string | null>;
    createDefinition(definition: Definition): Promise<void>;
    removeDefinition(id: string): Promise<void>;
    GET_DEFINITION_BY_TYPE: string;
    REMOVE_DEFINITION: string;
    CREATE_DEFINITION_MUTATION: string;
}
