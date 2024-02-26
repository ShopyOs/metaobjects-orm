import { MetaobjectField } from "~/src/metaobjects/MetaobjectField";
export interface Metaobject {
    type?: string;
    id?: string;
    handle: string;
    fields: MetaobjectField[];
}
