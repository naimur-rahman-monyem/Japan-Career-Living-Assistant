import path from "node:path";
import { PrismaClient } from "@prisma/client";
import * as XLSX from "xlsx";

const prisma = new PrismaClient();
const sourcePath = process.argv[2] || process.env.LIVING_COST_WORKBOOK || path.resolve(process.cwd(), "japan_living_cost_project_data.xlsx");
const requiredColumns = ["City", "Category", "Item", "Price (JPY)", "Range"];
const sourceName = "Numbeo dataset provided for Japan Career & Living Assistant";

type RawRow = Record<string, unknown>;

function parsePrice(value: unknown, rowNumber: number) {
  if (value === null || value === undefined || String(value).trim() === "") return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const cleaned = String(value ?? "").replace(/[¥,]/g, "").trim();
  const parsed = Number(cleaned);
  if (!cleaned || !Number.isFinite(parsed) || parsed < 0) throw new Error(`Invalid price at Raw Data row ${rowNumber}: ${String(value)}`);
  return parsed;
}

function readRows() {
  const workbook = XLSX.readFile(sourcePath, { cellDates: true });
  const sheet = workbook.Sheets["Raw Data"];
  if (!sheet) throw new Error('Workbook must contain a "Raw Data" sheet.');
  const rows = XLSX.utils.sheet_to_json<RawRow>(sheet, { defval: null });
  const columns = rows.length ? Object.keys(rows[0]) : [];
  const missing = requiredColumns.filter((column) => !columns.includes(column));
  if (missing.length) throw new Error(`Raw Data is missing required columns: ${missing.join(", ")}`);
  return rows.flatMap((row, index) => {
    const city = String(row.City ?? "").trim();
    const category = String(row.Category ?? "").trim();
    const item = String(row.Item ?? "").trim();
    if (!city || !category || !item) throw new Error(`Missing city, category, or item at Raw Data row ${index + 2}.`);
    const price = parsePrice(row["Price (JPY)"], index + 2);
    if (price === null) return [];
    return [{ city, category, item, price, range: row.Range ? String(row.Range).trim() : null }];
  });
}

async function main() {
  const workbook = XLSX.readFile(sourcePath, { cellDates: true });
  const rawRows = XLSX.utils.sheet_to_json<RawRow>(workbook.Sheets["Raw Data"], { defval: null });
  const missingPrices = rawRows.filter((row) => row["Price (JPY)"] === null || row["Price (JPY)"] === undefined || String(row["Price (JPY)"]).trim() === "").length;
  const rows = readRows();
  const cities = new Set(rows.map((row) => row.city));
  let imported = 0;
  for (const city of Array.from(cities)) {
    const cityRecord = await prisma.livingCostCity.upsert({
      where: { city },
      update: { source: sourceName, currency: "JPY" },
      create: { city, source: sourceName, currency: "JPY" },
    });
    for (const row of rows.filter((entry) => entry.city === city)) {
      await prisma.livingCostItem.upsert({
        where: { cityId_category_item: { cityId: cityRecord.id, category: row.category, item: row.item } },
        update: { price: row.price, range: row.range },
        create: { cityId: cityRecord.id, category: row.category, item: row.item, price: row.price, range: row.range },
      });
      imported += 1;
    }
  }
  console.log(`Imported ${imported} living-cost records for ${cities.size} cities from ${sourcePath}. Skipped ${missingPrices} rows with missing prices.`);
}

main().catch((error) => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
