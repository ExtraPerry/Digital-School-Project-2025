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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      partner_station: {
        Row: {
          address: string
          created_at: string
          filled_slots: number
          id: string
          is_open: boolean
          max_slots: number
          name: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address: string
          created_at?: string
          filled_slots: number
          id?: string
          is_open?: boolean
          max_slots: number
          name: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: string
          created_at?: string
          filled_slots?: number
          id?: string
          is_open?: boolean
          max_slots?: number
          name?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_station_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      rental_history: {
        Row: {
          created_at: string
          distance_travelled: number
          end_location: string
          end_time: string
          id: string
          scooter_id: string | null
          start_location: string
          start_time: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          distance_travelled: number
          end_location: string
          end_time: string
          id?: string
          scooter_id?: string | null
          start_location: string
          start_time: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          distance_travelled?: number
          end_location?: string
          end_time?: string
          id?: string
          scooter_id?: string | null
          start_location?: string
          start_time?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rental_history_scooter_id_fkey"
            columns: ["scooter_id"]
            isOneToOne: false
            referencedRelation: "scooter"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rental_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      scooter: {
        Row: {
          created_at: string
          current_assigned_user: string | null
          current_location: string
          current_partner_station: string | null
          current_station: string | null
          current_status: Database["public"]["Enums"]["scooter_status"]
          id: string
          model: string | null
          reference_number: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_assigned_user?: string | null
          current_location: string
          current_partner_station?: string | null
          current_station?: string | null
          current_status: Database["public"]["Enums"]["scooter_status"]
          id?: string
          model?: string | null
          reference_number?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_assigned_user?: string | null
          current_location?: string
          current_partner_station?: string | null
          current_station?: string | null
          current_status?: Database["public"]["Enums"]["scooter_status"]
          id?: string
          model?: string | null
          reference_number?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "scooter_current_assigned_user_fkey"
            columns: ["current_assigned_user"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scooter_current_partner_station_fkey"
            columns: ["current_partner_station"]
            isOneToOne: false
            referencedRelation: "partner_station"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scooter_current_station_fkey"
            columns: ["current_station"]
            isOneToOne: false
            referencedRelation: "station"
            referencedColumns: ["id"]
          },
        ]
      }
      station: {
        Row: {
          address: string
          created_at: string
          filled_slot: number
          id: string
          is_open: boolean
          max_slots: number
          name: string
          updated_at: string
        }
        Insert: {
          address: string
          created_at: string
          filled_slot: number
          id?: string
          is_open?: boolean
          max_slots: number
          name: string
          updated_at: string
        }
        Update: {
          address?: string
          created_at?: string
          filled_slot?: number
          id?: string
          is_open?: boolean
          max_slots?: number
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          address: string | null
          auth_user_id: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          is_partner: boolean
          last_name: string | null
          phone: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          address?: string | null
          auth_user_id?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          is_partner?: boolean
          last_name?: string | null
          phone?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          address?: string | null
          auth_user_id?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          is_partner?: boolean
          last_name?: string | null
          phone?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      users_role: {
        Row: {
          auth_user_id: string
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_roles"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          auth_user_id: string
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_roles"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          auth_user_id?: string
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_roles"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_role_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_roles: "ADMIN" | "DEFAULT_USER" | "PARTNER"
      scooter_status:
        | "IS_AT_STATION"
        | "IS_UNDER_WAY_TO_STATION"
        | "IS_STORED_IN_DEPOT"
        | "IS_UNDER_MAINTENANCE"
        | "IS_UNDER_RECOVERY"
        | "IS_MISSPLACED"
        | "IS_LOST"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      app_roles: ["ADMIN", "DEFAULT_USER", "PARTNER"],
      scooter_status: [
        "IS_AT_STATION",
        "IS_UNDER_WAY_TO_STATION",
        "IS_STORED_IN_DEPOT",
        "IS_UNDER_MAINTENANCE",
        "IS_UNDER_RECOVERY",
        "IS_MISSPLACED",
        "IS_LOST",
      ],
    },
  },
} as const
