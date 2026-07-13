import { products } from "@/lib/mock-data";

export function getRecommendedProduct(recommendation) {
  if (!recommendation?.product) return null;

  const normalized = recommendation.product.toLowerCase();

  const productMap = [
    { id: "fd", patterns: ["fixed deposit", "fd"] },
    { id: "rd", patterns: ["recurring deposit", "rd"] },
    { id: "ppf", patterns: ["ppf", "public provident fund", "public provident"] },
    { id: "mf", patterns: ["mutual fund", "mutual funds", "mf"] },
    { id: "gold", patterns: ["gold etf", "gold"] },
    { id: "nps", patterns: ["nps", "national pension system"] },
  ];

  const match = productMap.find(({ patterns }) =>
    patterns.some((pattern) => normalized.includes(pattern))
  );

  return products.find((product) => product.id === match?.id) ?? null;
}
