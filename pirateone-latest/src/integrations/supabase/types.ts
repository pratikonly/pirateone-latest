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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      chat_bans: {
        Row: {
          banned_at: string
          banned_by: string | null
          expires_at: string | null
          id: string
          is_active: boolean
          reason: string | null
          user_id: string
        }
        Insert: {
          banned_at?: string
          banned_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          reason?: string | null
          user_id: string
        }
        Update: {
          banned_at?: string
          banned_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          reason?: string | null
          user_id?: string
        }
        Relationships: []
      }
      chat_settings: {
        Row: {
          id: string
          setting_key: string
          setting_value: boolean
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          id?: string
          setting_key: string
          setting_value?: boolean
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          id?: string
          setting_key?: string
          setting_value?: boolean
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      comments: {
        Row: {
          content: string
          created_at: string
          id: string
          media_id: number
          media_type: string
          rating: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          media_id: number
          media_type: string
          rating?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          media_id?: number
          media_type?: string
          rating?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      feedback: {
        Row: {
          created_at: string
          email: string | null
          feedback: string
          id: string
          rating: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          feedback: string
          id?: string
          rating: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          feedback?: string
          id?: string
          rating?: number
          user_id?: string | null
        }
        Relationships: []
      }
      global_chat: {
        Row: {
          content: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          gender: string | null
          id: string
          updated_at: string
          user_id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          gender?: string | null
          id?: string
          updated_at?: string
          user_id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          gender?: string | null
          id?: string
          updated_at?: string
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          browser: string | null
          city: string | null
          country: string | null
          created_at: string
          current_episode: number | null
          current_media_id: number | null
          current_media_title: string | null
          current_media_type: string | null
          current_page: string | null
          current_season: number | null
          device_info: Json | null
          id: string
          is_anonymous: boolean | null
          is_online: boolean | null
          last_activity: string | null
          os: string | null
          session_id: string
          session_token: string | null
          user_id: string | null
        }
        Insert: {
          browser?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          current_episode?: number | null
          current_media_id?: number | null
          current_media_title?: string | null
          current_media_type?: string | null
          current_page?: string | null
          current_season?: number | null
          device_info?: Json | null
          id?: string
          is_anonymous?: boolean | null
          is_online?: boolean | null
          last_activity?: string | null
          os?: string | null
          session_id: string
          session_token?: string | null
          user_id?: string | null
        }
        Update: {
          browser?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          current_episode?: number | null
          current_media_id?: number | null
          current_media_title?: string | null
          current_media_type?: string | null
          current_page?: string | null
          current_season?: number | null
          device_info?: Json | null
          id?: string
          is_anonymous?: boolean | null
          is_online?: boolean | null
          last_activity?: string | null
          os?: string | null
          session_id?: string
          session_token?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_tags: {
        Row: {
          created_at: string
          given_by: string | null
          id: string
          tag_color: string
          tag_name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          given_by?: string | null
          id?: string
          tag_color?: string
          tag_name: string
          user_id: string
        }
        Update: {
          created_at?: string
          given_by?: string | null
          id?: string
          tag_color?: string
          tag_name?: string
          user_id?: string
        }
        Relationships: []
      }
      watch_history: {
        Row: {
          episode: number | null
          id: string
          is_completed: boolean | null
          media_id: number
          media_title: string
          media_type: string
          poster_path: string | null
          progress_seconds: number | null
          season: number | null
          total_duration_seconds: number | null
          user_id: string
          watch_duration_seconds: number | null
          watched_at: string
        }
        Insert: {
          episode?: number | null
          id?: string
          is_completed?: boolean | null
          media_id: number
          media_title: string
          media_type: string
          poster_path?: string | null
          progress_seconds?: number | null
          season?: number | null
          total_duration_seconds?: number | null
          user_id: string
          watch_duration_seconds?: number | null
          watched_at?: string
        }
        Update: {
          episode?: number | null
          id?: string
          is_completed?: boolean | null
          media_id?: number
          media_title?: string
          media_type?: string
          poster_path?: string | null
          progress_seconds?: number | null
          season?: number | null
          total_duration_seconds?: number | null
          user_id?: string
          watch_duration_seconds?: number | null
          watched_at?: string
        }
        Relationships: []
      }
      watchlist: {
        Row: {
          added_at: string
          backdrop_path: string | null
          first_air_date: string | null
          id: string
          media_id: number
          media_type: string
          overview: string | null
          poster_path: string | null
          release_date: string | null
          title: string
          user_id: string
          vote_average: number | null
        }
        Insert: {
          added_at?: string
          backdrop_path?: string | null
          first_air_date?: string | null
          id?: string
          media_id: number
          media_type: string
          overview?: string | null
          poster_path?: string | null
          release_date?: string | null
          title: string
          user_id: string
          vote_average?: number | null
        }
        Update: {
          added_at?: string
          backdrop_path?: string | null
          first_air_date?: string | null
          id?: string
          media_id?: number
          media_type?: string
          overview?: string | null
          poster_path?: string | null
          release_date?: string | null
          title?: string
          user_id?: string
          vote_average?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
