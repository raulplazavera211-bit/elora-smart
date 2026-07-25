import { createContext, useContext, useEffect, useState } from "react";

export type Currency = "EUR" | "USD";
export type Region = "europe" | "world";

interface CurrencyContextType {
  currency: Currency;
  region: Region;
  isLoading: boolean;
  exchangeRate: number; // EUR to USD
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const EUROPEAN_COUNTRIES = new Set([
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE",
  "GB", "CH", "NO", "IS", "AD", "BA", "ME", "MK", "RS", "UA", "BY", "MD", "RU", // Extended Europe
]);

const EXCHANGE_RATE = 1.10; // 1 EUR = 1.10 USD

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("EUR");
  const [region, setRegion] = useState<Region>("europe");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const detectRegion = async () => {
      try {
        // Usar ip-api.com (gratuito, sin API key requerida)
        const response = await fetch("https://ipapi.co/json/", {
          method: "GET",
          headers: { Accept: "application/json" },
        });
        
        if (!response.ok) throw new Error("Geolocation failed");
        
        const data = await response.json();
        const countryCode = data.country_code as string;
        
        const isEurope = EUROPEAN_COUNTRIES.has(countryCode);
        const detectedCurrency = isEurope ? "EUR" : "USD";
        const detectedRegion = isEurope ? "europe" : "world";
        
        setCurrency(detectedCurrency);
        setRegion(detectedRegion);
        
        // Guardar en localStorage para evitar llamadas repetidas
        localStorage.setItem("currency", detectedCurrency);
        localStorage.setItem("region", detectedRegion);
      } catch (error) {
        console.warn("Geolocation detection failed, defaulting to EUR", error);
        setCurrency("EUR");
        setRegion("europe");
      } finally {
        setIsLoading(false);
      }
    };

    // Verificar localStorage primero
    const savedCurrency = localStorage.getItem("currency") as Currency | null;
    const savedRegion = localStorage.getItem("region") as Region | null;
    
    if (savedCurrency && savedRegion) {
      setCurrency(savedCurrency);
      setRegion(savedRegion);
      setIsLoading(false);
    } else {
      detectRegion();
    }
  }, []);

  return (
    <CurrencyContext.Provider value={{ currency, region, isLoading, exchangeRate: EXCHANGE_RATE }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within CurrencyProvider");
  }
  return context;
}

// Helper para convertir precios (usar priceUsd fijo si existe, si no calcular)
export function convertPrice(priceEur: number, currency: Currency, exchangeRate: number, priceUsd?: number): number {
  if (currency === "EUR") return priceEur;
  if (priceUsd !== undefined) return priceUsd;
  return Math.round(priceEur * exchangeRate * 100) / 100;
}

// Helper para formatear moneda
export function formatCurrency(price: number, currency: Currency): string {
  if (currency === "EUR") {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  } else {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  }
}
