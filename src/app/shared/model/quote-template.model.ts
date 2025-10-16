// Correspond à un élément du tableau "procedes"


// Correspond à un élément du tableau "quoteOperations" ou "childOperations"
export interface QuoteOperation {
  id: string; // Ajouté pour le tracking dans Angular
  name: string;
  sequence: number;
  mandatory: boolean;
  procedes: Process[];
  childOperations: QuoteOperation[];
  isProcess?: boolean; // Ajouté dynamiquement pour la logique d'affichage
}

// Correspond à la racine de l'objet JSON
export interface QuoteTemplate {
  templateName: string;
  templateDescription: string;
  templateType: string;
  quoteOperations: QuoteOperation[];
  // ... autres propriétés
}
export interface Product {
  id: string;
  name: string;
  unit: string;
}

export interface Process {
  id: string;
  main: Product;
  products: Product[];
}

export interface Operation {
  id: string;
  title: string;
  type: 'container' | 'task';
  children: Operation[];
  procedes: Process[];
}
