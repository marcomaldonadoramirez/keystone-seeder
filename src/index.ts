import { getModelConfig, getFieldsMeta } from "./models";
import { buildSeedData, handleRelationField } from "./data-generator";
import { KeystoneContext } from "@keystone-6/core/types";

/**
 * Main seeding function that creates records for a specified model
 */
export async function seed(
  context: KeystoneContext,
  { 
    modelName, 
    recordCount, 
    relationMode 
  }: { 
    modelName: string; 
    recordCount: number; 
    relationMode?: 'connect-one' | 'connect-random' | 'interactive' | null 
  },
): Promise<void> {
  try {
    const model = await getModelConfig(modelName);
    const fieldsMeta = await getFieldsMeta(context, modelName);

    let successCount = 0;

    console.log(
      `\n(seeder) Starting to seed ${recordCount} ${modelName} records...\n`,
    );

    for (let i = 0; i < recordCount; i++) {
      try {
        // Generate seed data with relation field information
        const seedData = buildSeedData(model, fieldsMeta, relationMode ? context : undefined, relationMode);
        
        // Handle relation fields if present
        const finalData: Record<string, any> = { ...seedData };
        delete finalData._relationFields;
        
        // Process relation fields if they exist
        if (seedData._relationFields && relationMode) {
          for (const relationField of seedData._relationFields) {
            const { fieldName, relatedModel, isList } = relationField;
            
            // Import the handleRelationField function            
            // Use the handleRelationField function to process relations
            const relationData = await handleRelationField(
              context,
              { name: fieldName, type: relatedModel, isList },
              relationMode
            );
            
            if (relationData) {
              finalData[fieldName] = relationData;
            }
          }
        }
        
        console.log(
          `(seeder) Creating ${modelName} entry #${i + 1}/${recordCount}...`,
        );
        
        await context.sudo().db[modelName].createOne({ data: finalData });
        successCount++;
      } catch (error) {
        console.error(`Error creating ${modelName} entry #${i + 1}:`, error);
      }
    }

    console.log(
      `\n(seeder) Seeding complete! Successfully created ${successCount}/${recordCount} records.`,
    );
  } catch (error) {
    console.error("Error during seeding process:", error);
    throw error;
  }
}



// Export all necessary functions
export { getAvailableModels, getModelConfig, getFieldsMeta } from "./models";
export { initializeContext } from "./context";
export { buildSeedData, generateFieldValue } from "./data-generator";