/**
 * GraphQL queries used by the seeder
 */

export const ListsQuery = `query Lists {
  keystone {
     adminMeta {
      lists {
        key
      }
    }
  }
}`;

export const FieldsAdminMetaQuery = `query FieldsAdminMeta($key: String!) {
  keystone {
    adminMeta {
      list(key: $key) {
        key
        fields {
          path
          fieldMeta
        }
      }
    }
  }
}`;