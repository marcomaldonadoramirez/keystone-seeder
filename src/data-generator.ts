import { fakerES_MX as faker } from "@faker-js/faker";

// Entity context for maintaining consistency between related fields
class EntityContext {
  private gender: string;
  private firstName: string;
  private lastName: string;
  private username: string;
  private email: string;
  private avatar: string;
  private company: string;
  private jobTitle: string;
  private phoneNumber: string;
  private address: string;
  private city: string;
  private state: string;
  private zipCode: string;
  private country: string;
  private birthDate: Date;

  constructor() {
    this.gender = faker.person.sex();
    this.firstName = faker.person.firstName(this.gender.toLowerCase() as 'female' | 'male');
    this.lastName = faker.person.lastName();
    this.username = faker.internet.username({ firstName: this.firstName, lastName: this.lastName });
    this.email = faker.internet.email({ firstName: this.firstName, lastName: this.lastName });
    this.avatar = faker.image.avatar();
    this.company = faker.company.name();
    this.jobTitle = faker.person.jobTitle();
    this.phoneNumber = faker.phone.number();
    this.address = faker.location.streetAddress();
    this.city = faker.location.city();
    this.state = faker.location.state();
    this.zipCode = faker.location.zipCode();
    this.country = faker.location.countryCode({ variant: "alpha-3" }).toLowerCase();
    this.birthDate = faker.date.birthdate({ min: 18, max: 65, mode: 'age' });
  }

  getFirstName(): string { return this.firstName; }
  getLastName(): string { return this.lastName; }
  getFullName(): string { return `${this.firstName} ${this.lastName}`; }
  getUsername(): string { return this.username; }
  getEmail(): string { return this.email; }
  getGender(): string { return this.gender; }
  getAvatar(): string { return this.avatar; }
  getCompany(): string { return this.company; }
  getJobTitle(): string { return this.jobTitle; }
  getPhoneNumber(): string { return this.phoneNumber; }
  getAddress(): string { return this.address; }
  getCity(): string { return this.city; }
  getState(): string { return this.state; }
  getZipCode(): string { return this.zipCode; }
  getCountry(): string { return this.country; }
  getBirthDate(): Date { return this.birthDate; }
  getAge(): number { return new Date().getFullYear() - this.birthDate.getFullYear(); }
}

// Field name pattern matchers
type StringFieldPatternFn = (modelName: string, context?: EntityContext) => string;
interface StringFieldPatterns {
  [key: string]: StringFieldPatternFn;
}

const stringFieldPatterns: StringFieldPatterns = {
  fullname: (_, context?: EntityContext) => context ? context.getFullName() : `${faker.person.firstName()} ${faker.person.lastName()}`,
  firstname: (_, context?: EntityContext) => context ? context.getFirstName() : faker.person.firstName(),
  lastname: (_, context?: EntityContext) => context ? context.getLastName() : faker.person.lastName(),
  username: (_, context?: EntityContext) => context ? context.getUsername() : faker.internet.username(),
  name: (modelName: string, context?: EntityContext) => {
    const sanitizedModelName = modelName.toLowerCase();
    if (sanitizedModelName.includes("product")) return faker.commerce.productName();
    if (sanitizedModelName.includes("event")) return faker.lorem.words(3);
    if (sanitizedModelName.includes("company")) return faker.company.name();
    if (sanitizedModelName.includes("job")) return faker.person.jobTitle();
    if (sanitizedModelName.includes("course")) return faker.lorem.words(2) + " Course";
    if (sanitizedModelName.includes("category")) return faker.commerce.department();
    if (sanitizedModelName.includes("blog") || sanitizedModelName.includes("post") || sanitizedModelName.includes("article")) return faker.lorem.sentence(5);
    return context ? context.getFirstName() : faker.person.firstName();
  },
  email: (_, context?: EntityContext) => context ? context.getEmail() : faker.internet.email(),
  gender: (_, context?: EntityContext) => context ? context.getGender() : faker.person.sex(),
  password: () => faker.internet.password({ length: 12, memorable: true }),
  phone: (_, context?: EntityContext) => context ? context.getPhoneNumber() : faker.phone.number(),
  phonenumber: (_, context?: EntityContext) => context ? context.getPhoneNumber() : faker.phone.number(),
  mobile: (_, context?: EntityContext) => context ? context.getPhoneNumber() : faker.phone.number(),
  address: (_, context?: EntityContext) => context ? context.getAddress() : faker.location.streetAddress(),
  street: (_, context?: EntityContext) => context ? context.getAddress() : faker.location.street(),
  city: (_, context?: EntityContext) => context ? context.getCity() : faker.location.city(),
  state: (_, context?: EntityContext) => context ? context.getState() : faker.location.state(),
  zipcode: (_, context?: EntityContext) => context ? context.getZipCode() : faker.location.zipCode(),
  postalcode: (_, context?: EntityContext) => context ? context.getZipCode() : faker.location.zipCode(),
  country: (_, context?: EntityContext) => context ? context.getCountry() : faker.location.countryCode({ variant: "alpha-3" }).toLowerCase(),
  company: (_, context?: EntityContext) => context ? context.getCompany() : faker.company.name(),
  jobtitle: (_, context?: EntityContext) => context ? context.getJobTitle() : faker.person.jobTitle(),
  title: (modelName: string) => {
    const sanitizedModelName = modelName.toLowerCase();
    if (sanitizedModelName.includes("product")) return faker.commerce.productName();
    if (sanitizedModelName.includes("job")) return faker.person.jobTitle();
    if (sanitizedModelName.includes("post") || sanitizedModelName.includes("article") || sanitizedModelName.includes("blog")) return faker.lorem.sentence();
    return faker.lorem.words(3);
  },
  description: (modelName: string) => {
    const sanitizedModelName = modelName.toLowerCase();
    if (sanitizedModelName.includes("product")) return faker.commerce.productDescription();
    if (sanitizedModelName.includes("user") || sanitizedModelName.includes("person")) return faker.lorem.sentence(8);
    return faker.lorem.paragraph();
  },
  content: () => faker.lorem.paragraphs(3),
  summary: () => faker.lorem.paragraph(),
  bio: () => faker.lorem.paragraph(2),
  avatar: (_, context?: EntityContext) => context ? context.getAvatar() : faker.image.avatar(),
  image: (modelName: string) => {
    const sanitizedModelName = modelName.toLowerCase();
    if (sanitizedModelName.includes("avatar") || sanitizedModelName.includes("profile")) return faker.image.avatar();
    return faker.image.url();
  },
  url: () => faker.internet.url(),
  website: () => faker.internet.url(),
  date: () => faker.date.recent().toISOString(),
  birthdate: (_, context?: EntityContext) => context ? context.getBirthDate().toISOString() : faker.date.birthdate({ min: 18, max: 65, mode: 'age' }).toISOString(),
  birthday: (_, context?: EntityContext) => context ? context.getBirthDate().toISOString() : faker.date.birthdate({ min: 18, max: 65, mode: 'age' }).toISOString(),
  age: (_, context?: EntityContext) => context ? context.getAge().toString() : faker.number.int({ min: 18, max: 65 }).toString(),
  sku: () => faker.commerce.isbn({ separator: "" }),
  isbn: () => faker.commerce.isbn(),
  price: () => faker.commerce.price().toString(),
  cost: () => faker.commerce.price().toString(),
  currency: () => faker.finance.currencyCode(),
  color: () => faker.color.human(),
  hex: () => faker.color.rgb(),
  rgb: () => faker.color.rgb(),
  department: () => faker.commerce.department(),
  category: () => faker.commerce.department(),
  tag: () => faker.lorem.word(),
  tags: () => faker.lorem.words(3),
  status: (modelName: string) => {
    const statuses = ["active", "inactive", "pending", "completed", "cancelled"];
    if (modelName.toLowerCase().includes("order")) {
      return faker.helpers.arrayElement(["pending", "processing", "shipped", "delivered", "cancelled"]);
    }
    return faker.helpers.arrayElement(statuses);
  },
  role: () => faker.helpers.arrayElement(["user", "admin", "editor", "viewer"]),
  permission: () => faker.helpers.arrayElement(["read", "write", "admin"]),
  language: () => faker.helpers.arrayElement(["en", "es", "fr", "de", "it"]),
  locale: () => faker.helpers.arrayElement(["en-US", "es-ES", "fr-FR", "de-DE", "it-IT"]),
  timezone: () => faker.location.timeZone(),
  uuid: () => faker.string.uuid(),
  ip: () => faker.internet.ip(),
  mac: () => faker.internet.mac(),
  domain: () => faker.internet.domainName(),
  useragent: () => faker.internet.userAgent(),
  token: () => faker.string.alphanumeric(32),
  default: () => faker.lorem.words(3)
};

// Type handlers
type FieldHandler = (fieldName: string, modelName: string, context?: EntityContext) => any;
interface TypeHandlers {
  [key: string]: FieldHandler;
}

const typeHandlers: TypeHandlers = {
  String: (fieldName: string, modelName: string, context?: EntityContext) => {
    const pattern = Object.keys(stringFieldPatterns).find(pattern => fieldName.includes(pattern));
    return pattern ? stringFieldPatterns[pattern](modelName, context) : stringFieldPatterns.default(modelName);
  },
  Int: (fieldName: string, modelName: string) => {
    const sanitizedFieldName = fieldName.toLowerCase();
    const sanitizedModelName = modelName.toLowerCase();
    
    if (sanitizedFieldName.includes("age")) return faker.number.int({ min: 18, max: 65 });
    if (sanitizedFieldName.includes("year")) return faker.number.int({ min: 2000, max: 2023 });
    if (sanitizedFieldName.includes("step")) return faker.number.int({ min: 1, max: 20 });
    if (sanitizedFieldName.includes("count") || sanitizedFieldName.includes("quantity")) return faker.number.int({ min: 1, max: 100 });
    if (sanitizedFieldName.includes("rating") || sanitizedFieldName.includes("score")) return faker.number.int({ min: 1, max: 5 });
    if (sanitizedFieldName.includes("price") || sanitizedFieldName.includes("cost")) return faker.number.int({ min: 5, max: 500 });
    if (sanitizedFieldName.includes("discount") || sanitizedFieldName.includes("percentage")) return faker.number.int({ min: 5, max: 30 });
    if (sanitizedModelName.includes("order") && sanitizedFieldName.includes("total")) return faker.number.int({ min: 10, max: 1000 });
    
    return faker.number.int({ min: 1, max: 1000 });
  },
  Float: (fieldName: string) => {
    const sanitizedFieldName = fieldName.toLowerCase();
    
    if (sanitizedFieldName.includes("price") || sanitizedFieldName.includes("cost")) return faker.number.float({ min: 5, max: 500, fractionDigits: 2 });
    if (sanitizedFieldName.includes("rating") || sanitizedFieldName.includes("score")) return faker.number.float({ min: 1, max: 5, fractionDigits: 1 });
    if (sanitizedFieldName.includes("discount") || sanitizedFieldName.includes("percentage")) return faker.number.float({ min: 0.05, max: 0.3, fractionDigits: 2 });
    if (sanitizedFieldName.includes("weight")) return faker.number.float({ min: 0.1, max: 10, fractionDigits: 1 });
    if (sanitizedFieldName.includes("height") || sanitizedFieldName.includes("width") || sanitizedFieldName.includes("length")) {
      return faker.number.float({ min: 1, max: 100, fractionDigits: 1 });
    }
    
    return faker.number.float({ min: 1, max: 1000, fractionDigits: 2 });
  },
  Boolean: (fieldName: string) => {
    const sanitizedFieldName = fieldName.toLowerCase();
    
    if (sanitizedFieldName.includes("active") || sanitizedFieldName.includes("enabled") || sanitizedFieldName.includes("available")) {
      return true;
    }
    if (sanitizedFieldName.includes("deleted") || sanitizedFieldName.includes("archived") || sanitizedFieldName.includes("disabled")) {
      return false;
    }
    if (sanitizedFieldName.includes("featured") || sanitizedFieldName.includes("premium")) {
      return faker.datatype.boolean({ probability: 0.3 }); // 30% chance of being true
    }
    if (sanitizedFieldName.includes("verified") || sanitizedFieldName.includes("confirmed")) {
      return faker.datatype.boolean({ probability: 0.8 }); // 80% chance of being true
    }
    
    return faker.datatype.boolean();
  },
  DateTime: (fieldName: string) => {
    const sanitizedFieldName = fieldName.toLowerCase();
    
    if (sanitizedFieldName.includes("created") || sanitizedFieldName.includes("createdAt")) {
      return faker.date.recent({ days: 30 });
    }
    if (sanitizedFieldName.includes("updated") || sanitizedFieldName.includes("updatedAt")) {
      return faker.date.recent({ days: 7 });
    }
    if (sanitizedFieldName.includes("birth") || sanitizedFieldName.includes("dob")) {
      return faker.date.birthdate({ min: 18, max: 65, mode: 'age' });
    }
    if (sanitizedFieldName.includes("expiry") || sanitizedFieldName.includes("expiration")) {
      return faker.date.future({ years: 2 });
    }
    if (sanitizedFieldName.includes("start")) {
      return faker.date.past({ years: 1 });
    }
    if (sanitizedFieldName.includes("end") || sanitizedFieldName.includes("deadline")) {
      return faker.date.future({ years: 1 });
    }
    
    return faker.date.recent();
  },
  default: () => null
};

/**
 * Generate a value for a field based on its type and name
 */
export function generateFieldValue(field: { name: string; type: string }, modelName: string, context?: EntityContext): any {
  const fieldName = field.name.toLowerCase();
  const handler = typeHandlers[field.type] || typeHandlers.default;
  return handler(fieldName, modelName, context);
}

/**
 * Build seed data for a model based on its fields and metadata
 */
/**
 * Get related entities for a relation field
 */
async function getRelatedEntities(context: any, relatedModel: string): Promise<any[]> {
  try {
    // Query the database to get all entities of the related model
    const entities = await context.sudo().db[relatedModel].findMany({
      take: 100, // Limit to 100 records for performance
    });
    return entities;
  } catch (error) {
    console.error(`Error fetching related entities for ${relatedModel}:`, error);
    return [];
  }
}

/**
 * Handle relation field by selecting a related entity
 */
import { selectSingleEntity, selectMultipleEntities } from './interactive-prompts';

export async function handleRelationField(
  context: any, 
  field: any, 
  relationMode: 'connect-one' | 'connect-random' | 'interactive' | null
): Promise<any> {
  try {
    // Get the related model name from the field
    const relatedModel = field.type;
    const fieldName = field.name;
    
    // Get all available entities of the related model
    const relatedEntities = await getRelatedEntities(context, relatedModel);
    
    if (relatedEntities.length === 0) {
      console.warn(`No ${relatedModel} entities found for relation. Skipping relation field.`);
      return null;
    }
    
    // If connect-one mode, always use the first entity
    if (relationMode === 'connect-one' && relatedEntities.length > 0) {
      return { connect: { id: relatedEntities[0].id } };
    }

    // If interactive mode, prompt user to select entities
    if (relationMode === 'interactive') {
      if (field.isList) {
        const selectedEntities = await selectMultipleEntities(fieldName, relatedModel, relatedEntities);
        return selectedEntities ? { connect: selectedEntities } : null;
      } else {
        const selectedEntity = await selectSingleEntity(fieldName, relatedModel, relatedEntities);
        return selectedEntity ? { connect: selectedEntity } : null;
      }
    }
    
    // Otherwise, randomly select an entity
    const randomEntity = faker.helpers.arrayElement(relatedEntities);
    return { connect: { id: randomEntity.id } };
  } catch (error) {
    console.error(`Error handling relation field:`, error);
    return null;
  }
}

export function buildSeedData(model: any, fieldsMeta: any, context?: any, relationMode?: 'connect-one' | 'connect-random' | 'interactive' | null): Record<string, any> {
  const data: Record<string, any> = {};
  try {
    // Get non-relation required fields
    const regularFields = model.fields.filter(
      (field: any) =>
        field.isRequired &&
        !field.isGenerated &&
        !field.isId &&
        !field.relationName,
    );
    
    // Get relation fields (if relation mode is specified)
    const relationFields = relationMode ? model.fields.filter(
      (field: any) => field.isRequired && field.relationName && !field.isId && !field.name.startsWith('from'),
    ) : [];

    // Create entity context if the model appears to be person-related
    const modelNameLower = model.name.toLowerCase();
    const isPersonModel = modelNameLower.includes('user') || 
                         modelNameLower.includes('person') || 
                         modelNameLower.includes('employee') || 
                         modelNameLower.includes('customer');
    const entityContext = isPersonModel ? new EntityContext() : undefined;

    // Process regular fields
    for (const field of regularFields) {
      const fieldName = field.name;
      const fieldMeta = fieldsMeta[fieldName];
      if (fieldMeta?.options) {
        // Handle select fields with options
        const options = fieldMeta.options;
        // Check if 'published' exists in options
        const publishedOption = options.find(
          (opt: any) => opt.value === "published",
        );
        if (publishedOption) {
          data[field.name] = "published";
        } else if (fieldMeta?.defaultValue !== undefined) {
          // Use defaultValue if available
          data[field.name] = fieldMeta.defaultValue;
        } else {
          data[field.name] = faker.helpers.arrayElement<{ value: string }>(
            options,
          ).value;
        }
      } else {
        data[field.name] = generateFieldValue(field, model.name, entityContext);
      }
    }
    
    // Process relation fields if relation mode is specified
    if (relationMode && context) {
      // We'll handle relation fields asynchronously later in the seed function
      data._relationFields = relationFields.map((field: any) => ({
        fieldName: field.name,
        relatedModel: field.type,
        isList: field.isList
      }));
    }

    return data;
  } catch (error) {
    console.error("Error building seed data:", error);
    throw error;
  }
}
