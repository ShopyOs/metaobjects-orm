# Shopify GraphQL Metaobjects API

## Overview

This npm package provides a convenient wrapper for the Shopify GraphQL Metaobjects API, simplifying the integration of metaobjects as a persistence layer in your applications. It is designed to be template-agnostic, allowing flexibility in the choice of templates for your Shopify App.

## Installation

To install the package, use npm:

```bash
npm install @shopyos/metaobjects-orm
```

## Usage

To use the package, first you need to create a new file in the root of your project called `metaobjects/schema.json`

### Schema example

```json
[
  {
    "type": "faq_groups",
    "name": "FAQs Groups",
    "is_public": true,
    "fields": [
      {
        "name": "Group name",
        "key": "name",
        "type": "single_line_text_field",
        "validations": []
      }
    ]
  },
  {
    "type": "faq_questions",
    "name": "FAQs",
    "is_public": true,
    "fields": [
      {
        "name": "Question",
        "key": "question",
        "type": "single_line_text_field",
        "validations": []
      },
      {
        "name": "Answer",
        "key": "answer",
        "type": "multi_line_text_field",
        "validations": []
      },
      {
        "name": "Weight",
        "key": "weight",
        "type": "number_integer",
        "validations": []
      },
      {
        "name": "Group",
        "key": "group",
        "type": "metaobject_reference",
        "validations": [
          {
            "name": "metaobject_definition_id",
            "value": "faq_groups"
          }
        ]
      }
    ]
  }
]

```

### Schema installation

After creating the schema file, you can import the `installAppSchema` or `uninstallAppSchema` to run the installation

  ```javascript
  import { installAppSchema } from 'metaobjects-orm';

  installAppSchema(shop, token);
  ```

### Create or update entries
```javascript
import {Metaobject} from "metaobjects-orm/dist/Metaobject";
import {metaobject} from "@shopyos/metaobjects-orm";

export class GroupCreator {
  public async execute(
    type: string,
    value: string,
    shop: string,
    token: string
  ): Promise<void> {
    const object: Metaobject = {
      type: 'my_metaobject_type',
      handle: type,
      fields: [{
        key: 'my_field',
        value: 'my_value'
      }]
    };
    await metaobject.manager.save(shop, token, object);
  }
}
```

### Delete entries
```javascript
import {metaobject} from "@shopyos/metaobjects-orm";
export class Delete {
  public async delete(id: string, shop: string, token: string): Promise<void> {
    const object = await metaobject.manager.get(shop, token, id, 'my_type');
    await metaobject.manager.delete(shop, token, object?.id);
  }
}
```

### Fetching entries
```javascript
import {metaobject} from "@shopyos/metaobjects-orm";

type MyInterface = {
  id: string;
  resource?: string;
  name: string;
};

export class Find {
  public async findAll(shop: string, token: string): Promise<MyInterface[]> {
    const metaobjectList = await metaobject.manager.list(shop, token, 'my_type');
    return metaobjectList?.map((object) => {
      return {
        id: object.handle,
        resource: object.id,
        name: String(object.fields.find((field) => field.key === 'name')?.value) ?? ''
      };
    });
  }
}

```

## Contributions

Contributions are welcome! For feature requests and bug reports please [submit an issue](https://github.com/ShopyOs/metaobjects-orm/issues).

## License

This package is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
