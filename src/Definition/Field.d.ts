import type { Validation } from "./Validation";
export interface Field {
    name: string;
    key: string;
    type: string;
    validations: Validation[];
}
