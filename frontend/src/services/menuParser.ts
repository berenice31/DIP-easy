import { MenuItem } from "../types/menu";

interface ParsedLine {
  name: string;
  price?: number;
  description?: string;
}

export class MenuParser {
  private static readonly PRICE_REGEX = /(\d+[.,]\d{2})\s*€?/;
  private static readonly CATEGORY_INDICATORS = [
    "ENTRÉES",
    "PLATS",
    "DESSERTS",
    "BOISSONS",
    "APÉRITIFS",
    "VINS",
    "COCKTAILS",
  ];

  private static extractPrice(text: string): number | undefined {
    const match = text.match(this.PRICE_REGEX);
    if (match) {
      return parseFloat(match[1].replace(",", "."));
    }
    return undefined;
  }

  private static isCategoryLine(line: string): boolean {
    const upperLine = line.toUpperCase().trim();
    return this.CATEGORY_INDICATORS.some((indicator) =>
      upperLine.includes(indicator)
    );
  }

  private static parseLine(line: string): ParsedLine | null {
    const trimmedLine = line.trim();
    if (!trimmedLine || this.isCategoryLine(trimmedLine)) {
      return null;
    }

    const price = this.extractPrice(trimmedLine);
    const name = trimmedLine.replace(this.PRICE_REGEX, "").trim();

    return {
      name,
      price,
    };
  }

  public static parseText(text: string): MenuItem[] {
    const lines = text.split("\n");
    const items: MenuItem[] = [];
    let currentCategory = "Entrées";

    for (const line of lines) {
      if (this.isCategoryLine(line)) {
        currentCategory = line.trim();
        continue;
      }

      const parsedLine = this.parseLine(line);
      if (parsedLine && parsedLine.name && parsedLine.price) {
        items.push({
          id: crypto.randomUUID(),
          name: parsedLine.name,
          description: parsedLine.description,
          price: parsedLine.price,
          category: currentCategory,
        });
      }
    }

    return items;
  }
}
