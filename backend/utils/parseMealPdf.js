import { PDFParse } from "pdf-parse";

const MEAL_TYPES = new Set(["breakfast", "lunch", "dinner", "snacks"]);

const COLUMN_ALIASES = {
  mealType: ["meal type", "mealtype", "type", "meal"],
  foodName: ["food name", "food", "item", "name", "food item"],
  quantity: ["quantity", "qty", "amount", "grams", "g", "weight"],
  calories: ["calories", "calorie", "kcal", "cals", "cal"],
  protein: ["protein", "prot", "proteins"],
  carbs: ["carbs", "carb", "carbohydrates", "carbohydrate"],
  fat: ["fat", "fats"],
  consumedAt: ["date", "consumed at", "consumed", "logged at", "time"],
  iron: ["iron"],
  calcium: ["calcium"],
  vitaminC: ["vitamin c", "vitaminc", "vit c"],
  vitaminD: ["vitamin d", "vitamind", "vit d"],
};

const normalizeHeader = (value) =>
  value.toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();

const splitRow = (line) => {
  if (line.includes("\t")) {
    return line.split("\t").map((cell) => cell.trim());
  }

  if (line.includes("|")) {
    return line.split("|").map((cell) => cell.trim());
  }

  if (line.includes(",")) {
    return line.split(",").map((cell) => cell.trim());
  }

  return line
    .split(/\s{2,}/)
    .map((cell) => cell.trim())
    .filter(Boolean);
};

const parseNumber = (value) => {
  if (value == null || value === "") {
    return null;
  }

  const parsed = Number(String(value).replace(/[^\d.-]/g, ""));

  return Number.isFinite(parsed) ? parsed : null;
};

const normalizeMealType = (value) => {
  const normalized = String(value).toLowerCase().trim();

  if (normalized.startsWith("break")) return "breakfast";
  if (normalized.startsWith("lunch")) return "lunch";
  if (normalized.startsWith("dinn")) return "dinner";
  if (normalized.startsWith("snack")) return "snacks";

  return MEAL_TYPES.has(normalized) ? normalized : null;
};

const parseDateValue = (value) => {
  if (!value) {
    return undefined;
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return undefined;
  }

  return parsed;
};

const findColumnIndex = (headers, aliases) => {
  for (let index = 0; index < headers.length; index += 1) {
    const header = headers[index];

    if (aliases.some((alias) => header === alias || header.includes(alias))) {
      return index;
    }
  }

  return -1;
};

const buildColumnMap = (headerCells) => {
  const headers = headerCells.map(normalizeHeader);
  const columnMap = {};

  for (const [field, aliases] of Object.entries(COLUMN_ALIASES)) {
    const index = findColumnIndex(headers, aliases);

    if (index !== -1) {
      columnMap[field] = index;
    }
  }

  return columnMap;
};

const isHeaderRow = (cells) => {
  const normalized = cells.map(normalizeHeader).join(" ");

  return (
    (normalized.includes("food") || normalized.includes("item")) &&
    (normalized.includes("calorie") ||
      normalized.includes("protein") ||
      normalized.includes("kcal"))
  );
};

const getCellValue = (cells, index) => {
  if (index == null || index < 0 || index >= cells.length) {
    return "";
  }

  return cells[index]?.trim() ?? "";
};

const parseMealRow = (cells, columnMap, rowNumber) => {
  const mealType = normalizeMealType(
    getCellValue(cells, columnMap.mealType) || "snacks",
  );
  const foodName = getCellValue(cells, columnMap.foodName);
  const quantity = parseNumber(getCellValue(cells, columnMap.quantity));
  const calories = parseNumber(getCellValue(cells, columnMap.calories));
  const protein = parseNumber(getCellValue(cells, columnMap.protein));
  const carbs = parseNumber(getCellValue(cells, columnMap.carbs));
  const fat = parseNumber(getCellValue(cells, columnMap.fat));
  const consumedAt = parseDateValue(getCellValue(cells, columnMap.consumedAt));

  if (!foodName) {
    return {
      error: `Row ${rowNumber}: food name is required`,
    };
  }

  if (
    !mealType ||
    quantity == null ||
    calories == null ||
    protein == null ||
    carbs == null ||
    fat == null
  ) {
    return {
      error: `Row ${rowNumber}: invalid or missing nutrition values`,
    };
  }

  const micronutrients = {
    iron: parseNumber(getCellValue(cells, columnMap.iron)) ?? 0,
    calcium: parseNumber(getCellValue(cells, columnMap.calcium)) ?? 0,
    vitaminC: parseNumber(getCellValue(cells, columnMap.vitaminC)) ?? 0,
    vitaminD: parseNumber(getCellValue(cells, columnMap.vitaminD)) ?? 0,
  };

  return {
    meal: {
      mealType,
      foodName,
      quantity,
      calories,
      protein,
      carbs,
      fat,
      micronutrients,
      ...(consumedAt ? { consumedAt } : {}),
    },
  };
};

export const extractTextFromPdf = async (buffer) => {
  const parser = new PDFParse({ data: buffer });

  try {
    const result = await parser.getText({
      cellSeparator: "\t",
      lineEnforce: true,
    });

    return result.text ?? "";
  } finally {
    await parser.destroy();
  }
};

export const parseMealPdfText = (text) => {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    throw new Error("The PDF does not contain any readable text");
  }

  let headerIndex = lines.findIndex((line) => isHeaderRow(splitRow(line)));

  if (headerIndex === -1) {
    throw new Error(
      "Could not detect a table header. Include columns like Food, Meal Type, Calories, Protein, Carbs, and Fat.",
    );
  }

  const columnMap = buildColumnMap(splitRow(lines[headerIndex]));

  if (
    columnMap.foodName == null ||
    columnMap.calories == null ||
    columnMap.protein == null ||
    columnMap.carbs == null ||
    columnMap.fat == null
  ) {
    throw new Error(
      "Missing required columns. Expected at least Food, Calories, Protein, Carbs, and Fat.",
    );
  }

  const meals = [];
  const skippedRows = [];

  for (let index = headerIndex + 1; index < lines.length; index += 1) {
    const cells = splitRow(lines[index]);

    if (cells.length < 3 || isHeaderRow(cells)) {
      continue;
    }

    const result = parseMealRow(cells, columnMap, index + 1);

    if (result.error) {
      skippedRows.push(result.error);
      continue;
    }

    meals.push(result.meal);
  }

  if (meals.length === 0) {
    throw new Error(
      "No valid meal rows found in the PDF. Check the table format and try again.",
    );
  }

  return { meals, skippedRows };
};
