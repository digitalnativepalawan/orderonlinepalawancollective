import { Product } from "./types";

export function buildDefaultProducts(): Product[] {
  const items: Product[] = [];
  let id = 1;
  const add = (name: string, cat: string, price: number, unit: string, inv: number) => {
    items.push({
      id: `p${id++}`, name, category: cat, price, unit, inventory: inv,
      image: `https://placehold.co/400x300/E8DCC8/6B5B3E?text=${encodeURIComponent(name.slice(0, 14))}`,
      isAvailable: true
    });
  };

  // Sausages
  add("Hungarian Sausage 500g", "Sausages", 377, "pack", 20);
  add("Breakfast Links 500g", "Sausages", 376, "pack", 18);
  add("Frankfurter 250g", "Sausages", 188, "pack", 25);
  add("Italian Garlic Sausage 250g", "Sausages", 187, "pack", 22);
  add("Double Smoked Ham 250g", "Sausages", 213, "pack", 15);
  add("Salami Milano 150g", "Sausages", 205, "pack", 12);
  add("Crabstick 1kg", "Sausages", 499, "pack", 10);
  add("Pepperoni 1kg", "Sausages", 896, "pack", 8);

  // Meats
  add("US Chuck Eye Roll", "Meats", 1245, "kg", 12);
  add("US Shortplate", "Meats", 877, "kg", 10);
  add("US Rib Eye", "Meats", 3366, "kg", 6);
  add("US Brisket", "Meats", 1245, "kg", 9);
  add("US Tenderloin", "Meats", 2459, "kg", 5);
  add("US Beef Hanging Tender", "Meats", 2155, "kg", 7);
  add("US Striploin", "Meats", 1595, "kg", 8);
  add("Bacon (LOCAL)", "Meats", 800, "kg", 14);

  // Seafood
  add("Whole Salmon", "Seafood", 1028, "kg", 6);
  add("Salmon Fillet", "Seafood", 1595, "kg", 8);
  add("Shrimp (per kg)", "Seafood", 825, "kg", 10);

  // Fries
  add("French Fries", "Fries", 478, "kg", 20);

  // Butter
  add("Unsalted Butter 2.5kg", "Butter", 472, "kg", 12);
  add("Unsalted Butter 8g (case)", "Butter", 2357, "case", 5);

  // Syrup
  add("Strawberry Syrup", "Syrup", 251, "bot", 15);
  add("Caramel Syrup", "Syrup", 251, "bot", 15);
  add("Chocolate Syrup", "Syrup", 251, "bot", 18);

  // Baking
  add("Baking Spray", "Baking", 334, "ltr", 10);
  add("Brownie Mix", "Baking", 396, "pack", 12);

  // Pampangga's Best
  add("Original Tocino 450g", "Pampangga's Best", 284, "pack", 20);
  add("Chicken Tocino 220g", "Pampangga's Best", 112, "pack", 18);
  add("Beef Tapa 450g", "Pampangga's Best", 286, "pack", 16);
  add("Bigatin Hotdog 1kg", "Pampangga's Best", 272, "pack", 14);
  add("Chicken White 250g", "Pampangga's Best", 111, "pack", 22);
  add("Chicken Longanisa 500g", "Pampangga's Best", 211, "pack", 15);
  add("Carne Norte Brazil 250g", "Pampangga's Best", 190, "pack", 12);
  add("Sweet Ham Regular 250g", "Pampangga's Best", 126, "pack", 18);
  add("Sweet Ham Premium 240g", "Pampangga's Best", 133, "pack", 17);
  add("Meaty Burger Patty 9pcs", "Pampangga's Best", 95, "pack", 25);
  add("Smoked Beef Longanisa 200g", "Pampangga's Best", 83, "pack", 20);

  // Dairy's
  add("Feta Cheese 200g", "Dairy's", 283, "pack", 12);
  add("Whipping Cream", "Dairy's", 650, "ltr", 8);
  add("Cooking Cream", "Dairy's", 534, "ltr", 9);
  add("Camembert 150g", "Dairy's", 321, "pack", 10);
  add("Brie 150g", "Dairy's", 321, "pack", 10);
  add("Burger Slices", "Dairy's", 826, "pack", 7);
  add("Perfect Pasta", "Dairy's", 398, "ltr", 6);
  add("Plain Yogurt", "Dairy's", 418, "ltr", 8);
  add("Red Cheddar", "Dairy's", 947, "kg", 5);
  add("Grated Parmesan", "Dairy's", 1910, "pack", 4);
  add("Parmesan Block", "Dairy's", 2005, "kg", 3);
  add("Cream Cheese", "Dairy's", 734, "kg", 7);
  add("Pizza Toppings 2.3kg", "Dairy's", 627, "kg", 5);
  add("Sour Cream", "Dairy's", 644, "ltr", 6);
  add("Blue Cheese Wheel", "Dairy's", 1322, "kg", 4);
  add("Feta Cheese Tub", "Dairy's", 826, "kg", 5);
  add("Gouda Cheese Wheel", "Dairy's", 1322, "kg", 4);
  add("Emmenthaler", "Dairy's", 1350, "kg", 4);

  return items;
}
