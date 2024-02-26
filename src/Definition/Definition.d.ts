import type { Field } from "./Field";
export interface Definition {
    type: string;
    name: string;
    is_public: boolean;
    fields: Field[];
}
