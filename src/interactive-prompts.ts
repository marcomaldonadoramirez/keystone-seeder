import { select, checkbox } from '@inquirer/prompts';

/**
 * Interactively select a single entity from a list of related entities
 */
export async function selectSingleEntity(
  fieldName: string,
  relatedModel: string,
  entities: any[]
): Promise<{ id: string } | null> {
  if (entities.length === 0) {
    console.warn(`No ${relatedModel} entities found for relation field ${fieldName}. Skipping.`);
    return null;
  }

  // Format entities for display
  const choices = entities.map(entity => ({
    name: formatEntityForDisplay(entity),
    value: entity.id
  }));

  // Add a skip option
  choices.push({
    name: '(Skip this relation)',
    value: 'skip'
  });

  // Prompt user to select an entity
  console.log(`\nSelect a ${relatedModel} for the ${fieldName} field:`);
  const selectedId = await select({
    message: `Choose a ${relatedModel}:`,
    choices
  });

  if (selectedId === 'skip') {
    return null;
  }

  return { id: selectedId };
}

/**
 * Interactively select multiple entities from a list of related entities
 */
export async function selectMultipleEntities(
  fieldName: string,
  relatedModel: string,
  entities: any[]
): Promise<{ id: string }[] | null> {
  if (entities.length === 0) {
    console.warn(`No ${relatedModel} entities found for relation field ${fieldName}. Skipping.`);
    return null;
  }

  // Format entities for display
  const choices = entities.map(entity => ({
    name: formatEntityForDisplay(entity),
    value: entity.id
  }));

  // Prompt user to select entities
  console.log(`\nSelect ${relatedModel} entities for the ${fieldName} field:`);
  const selectedIds = await checkbox({
    message: `Choose ${relatedModel} entities:`,
    choices
  });

  if (selectedIds.length === 0) {
    return null;
  }

  return selectedIds.map(id => ({ id }));
}

/**
 * Format an entity for display in the selection prompt
 * Tries to find a good display name based on common field patterns
 */
function formatEntityForDisplay(entity: any): string {
  // Try to find a good display field
  const displayFields = [
    'name',
    'title',
    'label',
    'fullName',
    'firstName',
    'username',
    'email',
    'id'
  ];

  for (const field of displayFields) {
    if (entity[field]) {
      return `${entity[field]} (ID: ${entity.id})`;
    }
  }

  // If no good display field is found, show the ID with some entity keys
  const keys = Object.keys(entity).filter(key => 
    typeof entity[key] !== 'object' && 
    key !== 'id' && 
    entity[key] !== null
  ).slice(0, 2);
  
  if (keys.length > 0) {
    const preview = keys.map(key => `${key}: ${entity[key]}`).join(', ');
    return `${preview} (ID: ${entity.id})`;
  }

  // Fallback to just the ID
  return `Entity ID: ${entity.id}`;
}