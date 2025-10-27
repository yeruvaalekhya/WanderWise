export interface Place {
  name: string;
  description: string;
  address?: string;
}

export interface Hotel extends Place {
  rating: number;
  priceRange: string;
}

export interface Restaurant extends Place {
  cuisine: string;
  budget: string;
}

export interface Trek extends Place {
  difficulty: string;
  distance: string;
  safetyInfo: string;
}

export interface Shopping extends Place {
  openingHours: string;
  transportInfo: string;
}

export type Recommendation = Hotel | Restaurant | Trek | Shopping | Place;

export interface TravelGuide {
  placesToVisit?: Place[];
  hotels?: Hotel[];
  restaurants?: Restaurant[];
  treks?: Trek[];
  shoppingMalls?: Shopping[];
}
