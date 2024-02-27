import {Metaobject} from "./Metaobject";
import {Pagination} from "./Pagination";

export interface MetaobjectResponse {
  data: Metaobject[];
  pagination: Pagination;
}
