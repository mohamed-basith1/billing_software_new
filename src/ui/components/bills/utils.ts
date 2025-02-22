export const calculateAmount = (uom: string, qty: number, rate: number): number => {
    switch (uom) {
      case "Kg":
      case "liter":
      case "piece":
        return qty * rate;

      case "gram":
        return (qty / 1000) * rate; // Convert grams to Kg

      default:
        console.warn(`Unknown UOM: ${uom}`);
        return 0; // Return 0 as a fallback
    }
  };