import { getDMMF } from "@prisma/internals";
import { ListsQuery, FieldsAdminMetaQuery } from "./queries";

/**
 * Get a list of all available models that can be seeded
 */
export async function getAvailableModels(context: any): Promise<string[]> {
  try {
    const {
      keystone: {
        adminMeta: { lists },
      },
    } = (await context.sudo().graphql.run({ query: ListsQuery })) as any;
    return lists.map((list: any) => list.key);
  } catch (error) {
    console.error("Error fetching available models:", error);
    throw error;
  }
}

/**
 * Get the Prisma model configuration for a specific model
 */
export async function getModelConfig(modelName: string): Promise<any> {
  try {
    const dmmf = await getDMMF({ datamodelPath: "schema.prisma" });
    const model = dmmf.datamodel.models.find((m) => m.name === modelName);

    if (!model) {
      throw new Error(`Model '${modelName}' not found in Prisma DMMF.`);
    }

    return model;
  } catch (error) {
    console.error(`Error getting model config for ${modelName}:`, error);
    throw error;
  }
}

/**
 * Get field metadata for a specific model from Keystone
 */
export async function getFieldsMeta(context: any, modelName: string): Promise<any> {
  try {
    const {
      keystone: {
        adminMeta: { list },
      },
    } = (await context.sudo().graphql.run({
      query: FieldsAdminMetaQuery,
      variables: { key: modelName },
    })) as any;
    
    return list.fields.reduce((result: any, item: any) => {
      result[item.path] = item.fieldMeta;
      return result;
    }, {});
  } catch (error) {
    console.error(`Error getting fields metadata for ${modelName}:`, error);
    throw error;
  }
}