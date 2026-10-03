export type AuditAction =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "LOGIN"
  | "LOGOUT"
  | "OTHER";

export interface AuditLog {
  id: number;
  user: number | null;
  user_email: string | null;
  action: AuditAction;
  model_name: string;
  object_id: string;
  description: string;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: string;
}

export interface AuditLogsResponse {
  success: boolean;
  count: number;
  logs: AuditLog[];
}

export interface AuditLogsQuery {
  action?: AuditAction;
  model_name?: string;
  user?: number;
  search?: string;
}
