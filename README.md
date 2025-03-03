# ✨ Keystone-Seeder

A flexible data seeder for Keystone 6 projects that helps you generate realistic test data using Faker.js.

## 🚀 Features

- 🎯 Easy-to-use CLI interface
- 🔧 Supports all Keystone 6 field types
- 🔄 Intelligent relation handling
- 🎲 Realistic data generation using Faker.js
- 💬 Interactive mode for relation fields
- ⚙️ Configurable seeding options

## 📦 Installation

```bash
npm install keystone-seeder
# or
yarn add keystone-seeder
# or
pnpm add keystone-seeder
```

## 🛠️ Usage

Keystone-Seeder provides a CLI tool to help you seed your database. Here are the available commands:

### 📋 List Available Models

```bash
keystone-seeder list
# or
keystone-seeder l
```

### 🌱 Seed Data

```bash
keystone-seeder seed <ModelName> [options]
```

Options:
- `-c, --count <number>` - Number of records to create (default: 10)
- `-f, --force` - Bypass confirmations and warnings
- `-r, --relation-mode <mode>` - How to handle relation fields:
  - `connect-one`: Use the same entity for all relations
  - `connect-random`: Use random entities for each relation
  - `interactive`: Select via prompts (default)

Example:
```bash
keystone-seeder seed User -c 20 -r connect-random
```

## ⚙️ Configuration

Keystone-Seeder automatically detects your Keystone configuration file and uses it to understand your schema. No additional configuration is required.

The tool looks for your Keystone config in the following locations:
- `./keystone.ts`
- `./keystone.js`
- `./src/keystone.ts`
- `./src/keystone.js`
- `./config/keystone.ts`
- `./config/keystone.js`

## 📋 Requirements

- Node.js >= 14
- Keystone 6 project
- Prisma (automatically installed with Keystone)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see LICENSE for details.

## 👨‍💻 Author

Marco Maldonado

## 💬 Support

If you encounter any issues or have questions, please file them in the [GitHub issues](https://github.com/marcomaldonadoramirez/keystone-seeder/issues) page.