import type { Metaobject } from "~/src/metaobjects/Metaobject";
export declare class MetaobjectRepository {
    private client;
    constructor(shop: string, token: string);
    save(metaobject: Metaobject): Promise<void>;
    list(type: string): Promise<Metaobject[]>;
    get(handle: string, type: string): Promise<Metaobject | null>;
    getById(id: string): Promise<Metaobject | null>;
    delete(id: string): Promise<void>;
    DELETE_METAOBJECT: string;
    GET_METAOBJECT_BY_HANDLE: string;
    GET_METAOBJECT_BY_ID: string;
    LIST_METAOBJECTS: string;
    CREATE_METAOBJECT: string;
}
