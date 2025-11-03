/**
 * TypeScript type definitions for wiki-synchronized data
 *
 * These interfaces match the JSON schema structures in src/data/*.json
 * and are used for wiki data transformation and validation.
 *
 * @see scripts/schemas/faction.schema.json
 * @see scripts/schemas/biome.schema.json
 */

// ═══════════════════════════════════════════════════════════════════════════════
// Faction Types
// ═══════════════════════════════════════════════════════════════════════════════

export interface FactionColors {
  primary: string;    // Hex color (#RRGGBB)
  secondary: string;  // Hex color (#RRGGBB)
  accent: string;     // Hex color (#RRGGBB)
}

export interface FactionAbility {
  name: string;
  description: string;
  cooldown: 'passive' | 'short' | 'medium' | 'long';
}

export interface Faction {
  id: string;                      // Faction code (e.g., "FCT_DIR")
  name: string;                    // Full faction name
  shortName: string;               // Short display name
  role: string;                    // Gameplay role (e.g., "tank", "scavenger")
  coopAbility: string;             // Co-op bonus description
  homeBiome: string;               // Home biome ID
  launchStatus: 'ea-launch' | 'expansion-1' | 'expansion-2' | 'planned';
  launchWindow: string;            // e.g., "EA Launch", "Expansion 1"
  philosophy: string;              // Faction philosophy/motto
  specialty: string;               // Gameplay specialty description
  lore: string;                    // Lore description
  colors: FactionColors;           // Visual identity colors
  playstyle: string;               // Playstyle description
  strengths: string[];             // List of strengths
  weaknesses: string[];            // List of weaknesses
  uniqueAbilities: FactionAbility[];
  lastSynced?: string;             // ISO timestamp of last wiki sync (optional)
}

export interface FactionsData {
  factions: Faction[];
  lastSynced?: string;             // ISO timestamp of last data sync (optional)
}

// ═══════════════════════════════════════════════════════════════════════════════
// Biome Types
// ═══════════════════════════════════════════════════════════════════════════════

export interface BiomeVisualCharacteristics {
  climate: string;                 // e.g., "Arctic", "Temperate"
  temperature: string;             // e.g., "Below freezing", "Moderate"
  weather: string[];               // Weather conditions
  visibility: string;              // Visibility conditions
  terrain: string;                 // Terrain description
}

export interface Biome {
  id: string;                      // Biome ID (kebab-case)
  name: string;                    // Biome name (PascalCase)
  displayName: string;             // Display name with spaces
  threatTier: string;              // Threat tier (e.g., "H2", "H3")
  threatLevel: 'Low' | 'Medium' | 'High' | 'Extreme';
  location: string;                // Geographic location
  launchStatus: 'ea-launch' | 'expansion-1' | 'expansion-2' | 'planned';
  launchWindow: string;            // e.g., "EA Launch"
  geography: string;               // Geographic description
  macroFeatures: string[];         // Large-scale features
  visualCharacteristics: BiomeVisualCharacteristics;
  keyFeatures: string[];           // Notable points of interest
  factionPresence: string[];       // Factions active in biome
  hazards: string[];               // Environmental hazards
  resources: string[];             // Available resources
  description: string;             // Biome lore description
  lastSynced?: string;             // ISO timestamp of last wiki sync (optional)
}

export interface BiomesData {
  biomes: Biome[];
  lastSynced?: string;             // ISO timestamp of last data sync (optional)
}

// ═══════════════════════════════════════════════════════════════════════════════
// Design Token Types (Style Dictionary format)
// ═══════════════════════════════════════════════════════════════════════════════

export interface DesignTokenValue {
  value: string;                   // Token value (color, font, size, etc.)
  type: 'color' | 'fontFamily' | 'fontSize' | 'fontWeight' | 'spacing' | 'dimension';
  description?: string;            // Optional usage description
  $type?: string;                  // DTCG spec type (Style Dictionary v4+)
  $value?: string;                 // DTCG spec value (Style Dictionary v4+)
}

export interface ColorTokens {
  [key: string]: DesignTokenValue | ColorTokens;
}

export interface TypographyTokens {
  [key: string]: DesignTokenValue | TypographyTokens;
}

export interface DesignTokens {
  color?: ColorTokens;             // Color palette tokens
  typography?: TypographyTokens;   // Typography tokens
  [category: string]: any;         // Allow additional token categories
}

// ═══════════════════════════════════════════════════════════════════════════════
// Wiki Metadata Types
// ═══════════════════════════════════════════════════════════════════════════════

export interface WikiSyncMetadata {
  lastSynced: string;              // ISO timestamp of last successful sync
  factionCount: number;            // Number of factions synced
  biomeCount: number;              // Number of biomes synced
  syncDuration: number;            // Sync duration in milliseconds
  wikiPagesProcessed: number;      // Number of wiki pages processed
  errors?: string[];               // Any errors encountered during sync
}

// ═══════════════════════════════════════════════════════════════════════════════
// Wiki Configuration Types
// ═══════════════════════════════════════════════════════════════════════════════

export interface WikiPageConfig {
  slug: string;                    // Wiki page slug (e.g., "Marketing/Brand_Guidelines")
  url: string;                     // Full GitLab wiki URL
  purpose: string;                 // Description of what data this page contains
  outputPath: string;              // Where to save raw markdown (e.g., "temp/wiki-raw/brand-guidelines.md")
  dataType: 'factions' | 'biomes' | 'designTokens' | 'content';
}

export interface WikiConfig {
  wikiPages: WikiPageConfig[];    // Array of wiki pages to fetch
  cacheTTL: number;                // Cache TTL in milliseconds (default: 86400000 = 24 hours)
  description: string;             // Configuration description
}

// ═══════════════════════════════════════════════════════════════════════════════
// Audit Report Types
// ═══════════════════════════════════════════════════════════════════════════════

export type DiscrepancySeverity = 'critical' | 'warning' | 'minor';

export interface Discrepancy {
  severity: DiscrepancySeverity;
  field: string;                   // Field path (e.g., "factions[0].colors.primary")
  wikiValue: any;                  // Value from wiki
  websiteValue: any;               // Current website value
  description: string;             // Human-readable description
}

export interface AuditReport {
  timestamp: string;               // ISO timestamp of audit
  summary: {
    total: number;                 // Total discrepancies found
    critical: number;              // Critical issues (blocks build)
    warning: number;               // Warnings (similarity < 0.85)
    minor: number;                 // Minor issues (formatting)
  };
  discrepancies: Discrepancy[];    // Detailed discrepancy list
  factionCount: {
    wiki: number;
    website: number;
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// Type Guards (Runtime Type Checking)
// ═══════════════════════════════════════════════════════════════════════════════

export function isFaction(obj: any): obj is Faction {
  return (
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.colors === 'object' &&
    typeof obj.colors.primary === 'string'
  );
}

export function isBiome(obj: any): obj is Biome {
  return (
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.visualCharacteristics === 'object'
  );
}

export function isFactionsData(obj: any): obj is FactionsData {
  return (
    typeof obj === 'object' &&
    Array.isArray(obj.factions) &&
    obj.factions.every(isFaction)
  );
}

export function isBiomesData(obj: any): obj is BiomesData {
  return (
    typeof obj === 'object' &&
    Array.isArray(obj.biomes) &&
    obj.biomes.every(isBiome)
  );
}
