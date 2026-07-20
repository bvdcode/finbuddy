export interface NormalizedCategory {
  key: string;
  label: string;
}

export function normalizeCategory(
  sourceLabel: string,
): NormalizedCategory | null {
  const label = sourceLabel.trim();
  if (label.length === 0) {
    return null;
  }

  switch (label.toLocaleLowerCase("en-US")) {
    case "car":
    case "transport":
      return { key: "transport", label };
    case "fixed goals":
    case "goals":
      return { key: "goals", label };
    default: {
      const key = label
        .toLocaleLowerCase("en-US")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      if (key.length === 0) {
        return null;
      }

      return { key, label };
    }
  }
}
