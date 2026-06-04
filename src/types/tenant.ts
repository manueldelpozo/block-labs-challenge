export interface TenantThemeConfig {
  primaryColor: string; // Mantine color name (e.g., 'blue', 'emerald')
  brandColors: string[]; // 10-shade color array for Mantine theme
  fontFamily: string;
  borderRadius: string; // Mantine default radius (e.g. 'sm', 'md', 'lg')
}

export interface TenantConfig {
  id: string;
  name: string;
  theme: TenantThemeConfig;
  features: Record<string, boolean>;
  logo: string;
  apiBase: string;
}
