import { MetaobjectField } from "./MetaobjectField";

export interface Metaobject {
  type?: string;
  id?: string;
  handle: string;
  fields: MetaobjectField[];
}
