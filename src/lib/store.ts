import { Product } from "./types";

export function exportProductsCSV(products: Product[]): string {
  const headers = ["id", "name", "category", "price", "cost", "unit", "inventory", "isAvailable", "description", "image"];
  
  const rows = products.map(p => [
    p.id,
    `"${p.name.replace(/"/g, '""')}"`,
    p.category,
    p.price.toFixed(2),
    (p.cost || 0).toFixed(2),
    p.unit,
    p.inventory,
    p.isAvailable,
    `"${(p.description || '').replace(/"/g, '""')}"`,
    p.image || p.imageBase64 || ''
  ].join(","));

  return [headers.join(","), ...rows].join("\n");
}

export function importProductsCSV(csvText: string): Product[] {
  const lines = csvText.trim().split("\n");
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
  
  // Find column indices
  const idx = {
    id: headers.indexOf("id"),
    name: headers.indexOf("name"),
    category: headers.indexOf("category"),
    price: headers.indexOf("price"),
    cost: headers.indexOf("cost"),
    unit: headers.indexOf("unit"),
    inventory: headers.indexOf("inventory"),
    isAvailable: headers.indexOf("isavailable"),
    description: headers.indexOf("description"),
    image: headers.indexOf("image"),
  };

  const products: Product[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    
    const price = parseFloat(values[idx.price]) || 0;
    const costValue = parseFloat(values[idx.cost]) || 0;
    
    // If cost is 0 or missing, calculate 20% margin automatically
    const cost = costValue > 0 ? costValue : price * 0.80;

    products.push({
      id: values[idx.id] || `prod_${Date.now()}_${i}`,
      name: values[idx.name]?.replace(/^"|"$/g, '') || "Unknown",
      category: values[idx.category] || "Meats",
      price: price,
      cost: cost,
      unit: values[idx.unit] || "kg",
      inventory: parseInt(values[idx.inventory]) || 0,
      isAvailable: values[idx.isAvailable] !== "false",
      description: values[idx.description]?.replace(/^"|"$/g, '') || "",
      image: values[idx.image] || "",
    });
  }

  return products;
}

// Helper function to parse CSV lines with quoted values
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  
  return result;
}
