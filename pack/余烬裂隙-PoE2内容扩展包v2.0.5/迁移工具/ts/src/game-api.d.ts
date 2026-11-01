interface RiftCharacter {
  level: number;
  cls: string;
  advTree?: string[];
  shopHeat?: Record<string, { mult: number; lastAt: number }>;
}
interface Window {
  HOTFIX?: unknown;
  __ADV?: unknown;
  __erTest?: unknown;
  __SHOP?: unknown;
}
