import { seedAddresses } from "./address.seed.js";

async function seed() {
  console.log("🌱 Seeding database...");

  await seedAddresses();

  console.log("✅ Seeding complete.");

  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
