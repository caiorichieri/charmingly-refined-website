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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      access_log: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          id: string
          metadata: Json | null
          resource: string
          subject_id: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          resource: string
          subject_id?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          resource?: string
          subject_id?: string | null
        }
        Relationships: []
      }
      account_deletion_requests: {
        Row: {
          id: string
          processed_at: string | null
          reason: string | null
          requested_at: string
          status: string
          user_id: string
        }
        Insert: {
          id?: string
          processed_at?: string | null
          reason?: string | null
          requested_at?: string
          status?: string
          user_id: string
        }
        Update: {
          id?: string
          processed_at?: string | null
          reason?: string | null
          requested_at?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      ambassadors: {
        Row: {
          bio: string | null
          cover_url: string | null
          created_at: string
          display_order: number
          full_name: string
          honors: Json
          id: string
          location: string | null
          organizations: Json
          photo_url: string | null
          published: boolean
          quote_text: string | null
          roles: Json
          slug: string
          social_links: Json
          stats: Json
          tagline: string | null
          updated_at: string
          values: Json
          website_url: string | null
        }
        Insert: {
          bio?: string | null
          cover_url?: string | null
          created_at?: string
          display_order?: number
          full_name: string
          honors?: Json
          id?: string
          location?: string | null
          organizations?: Json
          photo_url?: string | null
          published?: boolean
          quote_text?: string | null
          roles?: Json
          slug: string
          social_links?: Json
          stats?: Json
          tagline?: string | null
          updated_at?: string
          values?: Json
          website_url?: string | null
        }
        Update: {
          bio?: string | null
          cover_url?: string | null
          created_at?: string
          display_order?: number
          full_name?: string
          honors?: Json
          id?: string
          location?: string | null
          organizations?: Json
          photo_url?: string | null
          published?: boolean
          quote_text?: string | null
          roles?: Json
          slug?: string
          social_links?: Json
          stats?: Json
          tagline?: string | null
          updated_at?: string
          values?: Json
          website_url?: string | null
        }
        Relationships: []
      }
      athlete_assignments: {
        Row: {
          active: boolean
          assigned_at: string
          athlete_id: string
          created_at: string
          ended_at: string | null
          id: string
          notes: string | null
          therapist_id: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          assigned_at?: string
          athlete_id: string
          created_at?: string
          ended_at?: string | null
          id?: string
          notes?: string | null
          therapist_id: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          assigned_at?: string
          athlete_id?: string
          created_at?: string
          ended_at?: string | null
          id?: string
          notes?: string | null
          therapist_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_id: string | null
          content: string
          cover_url: string
          created_at: string
          display_order: number
          excerpt: string
          id: string
          published: boolean
          published_at: string
          reading_time: string
          slug: string
          tag: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          content?: string
          cover_url?: string
          created_at?: string
          display_order?: number
          excerpt?: string
          id?: string
          published?: boolean
          published_at?: string
          reading_time?: string
          slug: string
          tag?: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          content?: string
          cover_url?: string
          created_at?: string
          display_order?: number
          excerpt?: string
          id?: string
          published?: boolean
          published_at?: string
          reading_time?: string
          slug?: string
          tag?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      cookie_consents: {
        Row: {
          analytics: boolean
          anonymous_id: string | null
          created_at: string
          id: string
          ip_address: string | null
          marketing: boolean
          necessary: boolean
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          analytics?: boolean
          anonymous_id?: string | null
          created_at?: string
          id?: string
          ip_address?: string | null
          marketing?: boolean
          necessary?: boolean
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          analytics?: boolean
          anonymous_id?: string | null
          created_at?: string
          id?: string
          ip_address?: string | null
          marketing?: boolean
          necessary?: boolean
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          cover_url: string
          created_at: string
          description: string
          display_order: number
          event_date: string
          id: string
          info: string
          location: string
          price: string
          price_detail: string
          published: boolean
          sold_out: boolean
          subtitle: string
          title: string
          updated_at: string
        }
        Insert: {
          cover_url?: string
          created_at?: string
          description?: string
          display_order?: number
          event_date: string
          id?: string
          info?: string
          location?: string
          price?: string
          price_detail?: string
          published?: boolean
          sold_out?: boolean
          subtitle?: string
          title: string
          updated_at?: string
        }
        Update: {
          cover_url?: string
          created_at?: string
          description?: string
          display_order?: number
          event_date?: string
          id?: string
          info?: string
          location?: string
          price?: string
          price_detail?: string
          published?: boolean
          sold_out?: boolean
          subtitle?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          created_at: string
          display_order: number
          id: string
          published: boolean
          question: string
          updated_at: string
        }
        Insert: {
          answer: string
          created_at?: string
          display_order?: number
          id?: string
          published?: boolean
          question: string
          updated_at?: string
        }
        Update: {
          answer?: string
          created_at?: string
          display_order?: number
          id?: string
          published?: boolean
          question?: string
          updated_at?: string
        }
        Relationships: []
      }
      media_assets: {
        Row: {
          alt: string
          created_at: string
          id: string
          key: string
          updated_at: string
          url: string
        }
        Insert: {
          alt?: string
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          url: string
        }
        Update: {
          alt?: string
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          athlete_id: string
          body: string
          created_at: string
          id: string
          read_at: string | null
          sender_id: string
          therapist_id: string
        }
        Insert: {
          athlete_id: string
          body: string
          created_at?: string
          id?: string
          read_at?: string | null
          sender_id: string
          therapist_id: string
        }
        Update: {
          athlete_id?: string
          body?: string
          created_at?: string
          id?: string
          read_at?: string | null
          sender_id?: string
          therapist_id?: string
        }
        Relationships: []
      }
      paths: {
        Row: {
          created_at: string
          description: string
          display_order: number
          icon: string | null
          id: string
          published: boolean
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          display_order?: number
          icon?: string | null
          id?: string
          published?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          display_order?: number
          icon?: string | null
          id?: string
          published?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      plans: {
        Row: {
          amount: string
          amount_accent: string | null
          created_at: string
          description: string
          detail: string
          display_order: number
          id: string
          is_deductible: boolean
          is_featured: boolean
          label: string
          published: boolean
          updated_at: string
        }
        Insert: {
          amount: string
          amount_accent?: string | null
          created_at?: string
          description?: string
          detail?: string
          display_order?: number
          id?: string
          is_deductible?: boolean
          is_featured?: boolean
          label: string
          published?: boolean
          updated_at?: string
        }
        Update: {
          amount?: string
          amount_accent?: string | null
          created_at?: string
          description?: string
          detail?: string
          display_order?: number
          id?: string
          is_deductible?: boolean
          is_featured?: boolean
          label?: string
          published?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      quiz_leads: {
        Row: {
          created_at: string
          email: string
          email_sent: boolean
          id: string
          name: string
          phone: string
          result_summary: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          email_sent?: boolean
          id?: string
          name: string
          phone: string
          result_summary?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          email_sent?: boolean
          id?: string
          name?: string
          phone?: string
          result_summary?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      quiz_options: {
        Row: {
          created_at: string
          display_order: number
          id: string
          profile_tag: string
          question_id: string
          text: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          profile_tag?: string
          question_id: string
          text: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          profile_tag?: string
          question_id?: string
          text?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "quiz_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_questions: {
        Row: {
          created_at: string
          display_order: number
          id: string
          published: boolean
          text: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          published?: boolean
          text: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          published?: boolean
          text?: string
          updated_at?: string
        }
        Relationships: []
      }
      quiz_responses: {
        Row: {
          created_at: string
          id: string
          lead_id: string
          option_id: string
          question_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          lead_id: string
          option_id: string
          question_id: string
        }
        Update: {
          created_at?: string
          id?: string
          lead_id?: string
          option_id?: string
          question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_responses_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "quiz_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_responses_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "quiz_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "quiz_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      shared_materials: {
        Row: {
          athlete_id: string
          created_at: string
          description: string | null
          file_path: string
          file_size: number | null
          file_type: string | null
          id: string
          therapist_id: string
          title: string
        }
        Insert: {
          athlete_id: string
          created_at?: string
          description?: string | null
          file_path: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          therapist_id: string
          title: string
        }
        Update: {
          athlete_id?: string
          created_at?: string
          description?: string | null
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          therapist_id?: string
          title?: string
        }
        Relationships: []
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          approved: boolean
          author_name: string
          author_role: string
          content: string
          created_at: string
          display_order: number
          id: string
          photo_url: string | null
          rating: number
          updated_at: string
        }
        Insert: {
          approved?: boolean
          author_name: string
          author_role?: string
          content: string
          created_at?: string
          display_order?: number
          id?: string
          photo_url?: string | null
          rating?: number
          updated_at?: string
        }
        Update: {
          approved?: boolean
          author_name?: string
          author_role?: string
          content?: string
          created_at?: string
          display_order?: number
          id?: string
          photo_url?: string | null
          rating?: number
          updated_at?: string
        }
        Relationships: []
      }
      therapist_profiles: {
        Row: {
          anni_esperienza: number | null
          bio: string | null
          citta: string | null
          codice_fiscale: string | null
          completed_at: string | null
          created_at: string
          formazione: string | null
          full_name: string
          numero_albo: string | null
          ordine_regionale: string | null
          paese: string | null
          phone: string | null
          specializzazioni: string[] | null
          titolo_studio: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          anni_esperienza?: number | null
          bio?: string | null
          citta?: string | null
          codice_fiscale?: string | null
          completed_at?: string | null
          created_at?: string
          formazione?: string | null
          full_name: string
          numero_albo?: string | null
          ordine_regionale?: string | null
          paese?: string | null
          phone?: string | null
          specializzazioni?: string[] | null
          titolo_studio?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          anni_esperienza?: number | null
          bio?: string | null
          citta?: string | null
          codice_fiscale?: string | null
          completed_at?: string | null
          created_at?: string
          formazione?: string | null
          full_name?: string
          numero_albo?: string | null
          ordine_regionale?: string | null
          paese?: string | null
          phone?: string | null
          specializzazioni?: string[] | null
          titolo_studio?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_consents: {
        Row: {
          created_at: string
          document: string
          granted: boolean
          id: string
          ip_address: string | null
          user_agent: string | null
          user_id: string
          version: string
        }
        Insert: {
          created_at?: string
          document: string
          granted?: boolean
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id: string
          version: string
        }
        Update: {
          created_at?: string
          document?: string
          granted?: boolean
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string
          version?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      get_my_therapist: { Args: { _athlete_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "therapist" | "athlete"
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
      app_role: ["admin", "therapist", "athlete"],
    },
  },
} as const
