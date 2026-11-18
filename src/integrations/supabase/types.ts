export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      agents: {
        Row: {
          created_at: string
          description: string | null
          enabled: boolean
          id: string
          is_demo: boolean
          model: string
          name: string
          provider_key: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          enabled?: boolean
          id?: string
          is_demo?: boolean
          model: string
          name: string
          provider_key: string
          role?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          enabled?: boolean
          id?: string
          is_demo?: boolean
          model?: string
          name?: string
          provider_key?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      approvals: {
        Row: {
          action_type: string
          created_at: string
          decided_at: string | null
          id: string
          status: string
          summary: string
          task_id: string | null
          user_id: string
        }
        Insert: {
          action_type: string
          created_at?: string
          decided_at?: string | null
          id?: string
          status?: string
          summary: string
          task_id?: string | null
          user_id?: string
        }
        Update: {
          action_type?: string
          created_at?: string
          decided_at?: string | null
          id?: string
          status?: string
          summary?: string
          task_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "approvals_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_events: {
        Row: {
          action: string
          category: string
          created_at: string
          detail: string | null
          id: string
          user_id: string
        }
        Insert: {
          action: string
          category: string
          created_at?: string
          detail?: string | null
          id?: string
          user_id?: string
        }
        Update: {
          action?: string
          category?: string
          created_at?: string
          detail?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      browser_sessions: {
        Row: {
          companion_id: string | null
          created_at: string
          id: string
          label: string
          revoked_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          companion_id?: string | null
          created_at?: string
          id?: string
          label: string
          revoked_at?: string | null
          status?: string
          user_id?: string
        }
        Update: {
          companion_id?: string | null
          created_at?: string
          id?: string
          label?: string
          revoked_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      permissions: {
        Row: {
          created_at: string
          domain: string
          id: string
          level: string
          session_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          domain: string
          id?: string
          level?: string
          session_id?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string
          domain?: string
          id?: string
          level?: string
          session_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "permissions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "browser_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      providers: {
        Row: {
          connected_at: string | null
          connection_method: string
          created_at: string
          id: string
          provider_key: string
          scopes: string[]
          secret_ref: string | null
          status: string
          user_id: string
        }
        Insert: {
          connected_at?: string | null
          connection_method?: string
          created_at?: string
          id?: string
          provider_key: string
          scopes?: string[]
          secret_ref?: string | null
          status?: string
          user_id?: string
        }
        Update: {
          connected_at?: string | null
          connection_method?: string
          created_at?: string
          id?: string
          provider_key?: string
          scopes?: string[]
          secret_ref?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      task_messages: {
        Row: {
          agent_id: string | null
          citations: string[]
          content: string
          created_at: string
          id: string
          kind: string
          task_id: string
          user_id: string
        }
        Insert: {
          agent_id?: string | null
          citations?: string[]
          content: string
          created_at?: string
          id?: string
          kind?: string
          task_id: string
          user_id?: string
        }
        Update: {
          agent_id?: string | null
          citations?: string[]
          content?: string
          created_at?: string
          id?: string
          kind?: string
          task_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_messages_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_messages_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          agent_ids: string[]
          cost_usd: number
          created_at: string
          id: string
          instructions: string
          is_demo: boolean
          mode: string
          risk: string
          status: Database["public"]["Enums"]["task_status"]
          synthesis: string | null
          target_url: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          agent_ids?: string[]
          cost_usd?: number
          created_at?: string
          id?: string
          instructions?: string
          is_demo?: boolean
          mode?: string
          risk?: string
          status?: Database["public"]["Enums"]["task_status"]
          synthesis?: string | null
          target_url?: string | null
          title: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          agent_ids?: string[]
          cost_usd?: number
          created_at?: string
          id?: string
          instructions?: string
          is_demo?: boolean
          mode?: string
          risk?: string
          status?: Database["public"]["Enums"]["task_status"]
          synthesis?: string | null
          target_url?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      workflows: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_template: boolean
          name: string
          nodes: Json
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_template?: boolean
          name: string
          nodes?: Json
          status?: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_template?: boolean
          name?: string
          nodes?: Json
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      task_status:
        | "draft"
        | "queued"
        | "running"
        | "needs_approval"
        | "completed"
        | "failed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      task_status: [
        "draft",
        "queued",
        "running",
        "needs_approval",
        "completed",
        "failed",
      ],
    },
  },
} as const
