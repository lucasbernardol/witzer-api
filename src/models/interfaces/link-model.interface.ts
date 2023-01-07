export interface LinkTypes {
  id: string;
  href: string;
  hash: string;
  redirectings: number;
  activated_at: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  _version: number;
}
