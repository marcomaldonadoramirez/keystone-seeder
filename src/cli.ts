#!/usr/bin/env node

import path from 'path';
import fs from 'fs';
import { Command } from "commander";
import { getAvailableModels } from "./models";
import { initializeContext } from "./context";
import { seed } from "./index";

/**
 * Find the Keystone config file in the user's project
 */
function findKeystoneConfig() {
  // Start from the current working directory
  const cwd = process.cwd();
  const possibleConfigPaths = [
    path.join(cwd, 'keystone.ts'),
    path.join(cwd, 'keystone.js'),
    path.join(cwd, 'src', 'keystone.ts'),
    path.join(cwd, 'src', 'keystone.js'),
    path.join(cwd, 'config', 'keystone.ts'),
    path.join(cwd, 'config', 'keystone.js')
  ];

  for (const configPath of possibleConfigPaths) {
    if (fs.existsSync(configPath)) {
      return configPath;
    }
  }
  throw new Error('Could not find Keystone configuration file. Make sure you are running this command from your Keystone project root.');
}

/**
 * Main CLI entry point
 */
async function main() {
  try {
    // Find the Keystone config
    const configPath = findKeystoneConfig();
    
    // Register ts-node for TypeScript support
    require('tsx/cjs');
    
    // Dynamically import the config
    const configModule = require(configPath);
    const config = configModule.config || configModule.default;
    
    if (!config) {
      throw new Error('Invalid Keystone configuration file. Could not find exported config object.');
    }

    // Import Prisma client
    const prismaModule = require('@prisma/client');
    
    // Setup and run the CLI
    const program = setupCLI(config, prismaModule);
    program.parse(process.argv);
  } catch (error) {
    console.error('Failed to initialize seeder:', error);
    process.exit(1);
  }
}

/**
 * Configure the CLI commands
 */
export function setupCLI(config: any, prismaModule: any): Command {
  const program = new Command();

  program
    .name("keystone-seeder")
    .description("Seed your Keystone 6 database with realistic test data")
    .version("1.0.0");

  program
    .command("list")
    .alias("l")
    .description("List all available models that can be seeded")
    .action(async () => {
      try {
        const context = await initializeContext(config, prismaModule);
        const models = await getAvailableModels(context);
        console.log("Available models:");
        models.forEach((model) => console.log(`  - ${model}`));
        process.exit(0);
      } catch (err) {
        console.error("Failed to retrieve models:", err);
        process.exit(1);
      }
    });

  program
    .command("seed [modelName]")
    .description("Seed the database with fake data")
    .option("-c, --count <number>", "Number of records to create", "10")
    .option("-f, --force", "Bypass confirmations and warnings")
    .option("-r, --relation-mode <mode>", "How to handle relation fields: 'connect-one' (use same entity), 'connect-random' (random for each), 'interactive' (select via prompts), or none", "interactive")
    .action(async (modelName, options) => {
      try {
        const context = await initializeContext(config, prismaModule);
        if (!modelName) {
          const models = await getAvailableModels(context);
          console.log("Available models:");
          models.forEach((model, i) => console.log(`  ${i + 1}. ${model}`));
          console.log("\nPlease specify a model name: seed <ModelName>");
          process.exit(1);
        }

        const recordCount = parseInt(options.count);
        if (isNaN(recordCount)) {
          console.error("The number of records must be a valid number.");
          process.exit(1);
        }

        const availableModels = await getAvailableModels(context);
        if (!availableModels.includes(modelName)) {
          console.error(`Model '${modelName}' not found. Available models:`);
          availableModels.forEach((model) => console.log(`  - ${model}`));
          process.exit(1);
        }

        if (recordCount > 100 && !options.force) {
          console.warn(
            `Warning: Creating ${recordCount} records might take a while.`,
          );
          console.warn("Use --force to bypass this warning.");
          process.exit(1);
        }

        const relationMode = ['connect-one', 'connect-random', 'interactive'].includes(options.relationMode) ? options.relationMode : null;

        await seed(context, {
          modelName,
          recordCount,
          relationMode,
        });
      } catch (err) {
        console.error("Seeding failed:", err);
        process.exit(1);
      }
    });

  program.on("command:*", () => {
    console.error(
      "Invalid command: %s\nSee --help for a list of available commands.",
      program.args.join(" "),
    );
    process.exit(1);
  });

  return program;
}

// Run the CLI
main();