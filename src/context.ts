import { getContext } from "@keystone-6/core/context";
import { KeystoneContext } from "@keystone-6/core/types";

/**
 * Initialize the Keystone context for database operations
 */
export async function initializeContext(config: any, prismaModule: any): Promise<KeystoneContext> {
  try {
    const context = getContext(config, prismaModule);
    console.log("(seeder)", "Connecting to DB...");

    if (typeof config.db.onConnect === "function") {
      await config.db.onConnect(context);
    }

    return context;
  } catch (error) {
    console.error("Error initializing context:", error);
    throw error;
  }
}