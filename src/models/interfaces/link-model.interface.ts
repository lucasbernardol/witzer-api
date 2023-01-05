export interface LinkTypes {
  id: string;
  href: string;
  hash: string;
  slug?: string | null;
  redirectings: number;
  activated_at: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  _version: number;
}
