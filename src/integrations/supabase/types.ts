export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      agri_contracts: {
        Row: {
          created_at: string
          crop_type: string
          description: string
          duration: string
          id: string
          location: string
          payment_amount: number | null
          posted_by: string
          status: string
          title: string
        }
        Insert: {
          created_at?: string
          crop_type: string
          description: string
          duration: string
          id?: string
          location: string
          payment_amount?: number | null
          posted_by: string
          status?: string
          title: string
        }
        Update: {
          created_at?: string
          crop_type?: string
          description?: string
          duration?: string
          id?: string
          location?: string
          payment_amount?: number | null
          posted_by?: string
          status?: string
          title?: string
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          created_at: string
          id: string
          product_id: string
          quantity: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          quantity?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      contract_applications: {
        Row: {
          applicant_id: string
          contract_id: string
          created_at: string
          id: string
          message: string | null
          status: string
        }
        Insert: {
          applicant_id: string
          contract_id: string
          created_at?: string
          id?: string
          message?: string | null
          status?: string
        }
        Update: {
          applicant_id?: string
          contract_id?: string
          created_at?: string
          id?: string
          message?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "contract_applications_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "agri_contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      drone_alerts: {
        Row: {
          acknowledged_at: string | null
          acknowledged_by: string | null
          action_required: string | null
          alert_type: string
          created_at: string
          detection_id: string | null
          escalated: boolean | null
          escalation_count: number | null
          gps_location: Json | null
          id: string
          message: string
          notification_sent: boolean | null
          priority_level: string
          resolution_notes: string | null
          resolved_at: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          action_required?: string | null
          alert_type: string
          created_at?: string
          detection_id?: string | null
          escalated?: boolean | null
          escalation_count?: number | null
          gps_location?: Json | null
          id?: string
          message: string
          notification_sent?: boolean | null
          priority_level?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          action_required?: string | null
          alert_type?: string
          created_at?: string
          detection_id?: string | null
          escalated?: boolean | null
          escalation_count?: number | null
          gps_location?: Json | null
          id?: string
          message?: string
          notification_sent?: boolean | null
          priority_level?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "drone_alerts_detection_id_fkey"
            columns: ["detection_id"]
            isOneToOne: false
            referencedRelation: "drone_detections"
            referencedColumns: ["id"]
          },
        ]
      }
      drone_detections: {
        Row: {
          ai_model_used: string | null
          confidence_score: number
          created_at: string
          description: string
          detection_type: string
          gps_coordinates: Json | null
          id: string
          location_in_frame: Json | null
          requires_action: boolean | null
          severity_level: string
          timestamp_in_video: number | null
          video_id: string
        }
        Insert: {
          ai_model_used?: string | null
          confidence_score: number
          created_at?: string
          description: string
          detection_type: string
          gps_coordinates?: Json | null
          id?: string
          location_in_frame?: Json | null
          requires_action?: boolean | null
          severity_level?: string
          timestamp_in_video?: number | null
          video_id: string
        }
        Update: {
          ai_model_used?: string | null
          confidence_score?: number
          created_at?: string
          description?: string
          detection_type?: string
          gps_coordinates?: Json | null
          id?: string
          location_in_frame?: Json | null
          requires_action?: boolean | null
          severity_level?: string
          timestamp_in_video?: number | null
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "drone_detections_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "drone_patrol_videos"
            referencedColumns: ["id"]
          },
        ]
      }
      drone_fleet: {
        Row: {
          battery_level: number | null
          created_at: string
          current_location: Json | null
          drone_id: string
          drone_name: string
          flight_hours_total: number | null
          id: string
          is_active: boolean | null
          last_maintenance: string | null
          model: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          battery_level?: number | null
          created_at?: string
          current_location?: Json | null
          drone_id: string
          drone_name: string
          flight_hours_total?: number | null
          id?: string
          is_active?: boolean | null
          last_maintenance?: string | null
          model?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          battery_level?: number | null
          created_at?: string
          current_location?: Json | null
          drone_id?: string
          drone_name?: string
          flight_hours_total?: number | null
          id?: string
          is_active?: boolean | null
          last_maintenance?: string | null
          model?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      drone_patrol_sessions: {
        Row: {
          created_at: string
          end_time: string | null
          high_priority_alerts: number | null
          id: string
          notes: string | null
          patrol_area: Json | null
          planned_duration_minutes: number | null
          session_name: string
          start_time: string
          status: string
          total_detections: number | null
          total_videos_uploaded: number | null
          updated_at: string
          user_id: string
          weather_conditions: Json | null
        }
        Insert: {
          created_at?: string
          end_time?: string | null
          high_priority_alerts?: number | null
          id?: string
          notes?: string | null
          patrol_area?: Json | null
          planned_duration_minutes?: number | null
          session_name: string
          start_time?: string
          status?: string
          total_detections?: number | null
          total_videos_uploaded?: number | null
          updated_at?: string
          user_id: string
          weather_conditions?: Json | null
        }
        Update: {
          created_at?: string
          end_time?: string | null
          high_priority_alerts?: number | null
          id?: string
          notes?: string | null
          patrol_area?: Json | null
          planned_duration_minutes?: number | null
          session_name?: string
          start_time?: string
          status?: string
          total_detections?: number | null
          total_videos_uploaded?: number | null
          updated_at?: string
          user_id?: string
          weather_conditions?: Json | null
        }
        Relationships: []
      }
      drone_patrol_videos: {
        Row: {
          created_at: string
          duration_seconds: number | null
          field_sector: string | null
          file_size: number | null
          file_url: string
          filename: string
          gps_latitude: number | null
          gps_longitude: number | null
          id: string
          processing_status: string
          updated_at: string
          upload_timestamp: string
          user_id: string
          weather_conditions: Json | null
        }
        Insert: {
          created_at?: string
          duration_seconds?: number | null
          field_sector?: string | null
          file_size?: number | null
          file_url: string
          filename: string
          gps_latitude?: number | null
          gps_longitude?: number | null
          id?: string
          processing_status?: string
          updated_at?: string
          upload_timestamp?: string
          user_id: string
          weather_conditions?: Json | null
        }
        Update: {
          created_at?: string
          duration_seconds?: number | null
          field_sector?: string | null
          file_size?: number | null
          file_url?: string
          filename?: string
          gps_latitude?: number | null
          gps_longitude?: number | null
          id?: string
          processing_status?: string
          updated_at?: string
          upload_timestamp?: string
          user_id?: string
          weather_conditions?: Json | null
        }
        Relationships: []
      }
      emergency_reports: {
        Row: {
          created_at: string
          description: string
          id: string
          image_url: string | null
          location: string | null
          priority: string
          report_type: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          image_url?: string | null
          location?: string | null
          priority?: string
          report_type: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          location?: string | null
          priority?: string
          report_type?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          price: number
          product_id: string
          quantity: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          price: number
          product_id: string
          quantity: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          price?: number
          product_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          id: string
          payment_id: string | null
          status: string
          total_amount: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          payment_id?: string | null
          status?: string
          total_amount: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          payment_id?: string | null
          status?: string
          total_amount?: number
          user_id?: string
        }
        Relationships: []
      }
      plant_diseases: {
        Row: {
          created_at: string
          crop_type: string
          disease_name: string
          id: string
          image_url: string | null
          severity: string
          solutions: string[]
          symptoms: string[]
        }
        Insert: {
          created_at?: string
          crop_type: string
          disease_name: string
          id?: string
          image_url?: string | null
          severity: string
          solutions: string[]
          symptoms: string[]
        }
        Update: {
          created_at?: string
          crop_type?: string
          disease_name?: string
          id?: string
          image_url?: string | null
          severity?: string
          solutions?: string[]
          symptoms?: string[]
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          in_stock: boolean | null
          name: string
          price: number
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          in_stock?: boolean | null
          name: string
          price: number
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          in_stock?: boolean | null
          name?: string
          price?: number
        }
        Relationships: []
      }
      soil_test_results: {
        Row: {
          field_location: string | null
          id: string
          moisture_level: number | null
          nitrogen_level: number | null
          ph_level: number | null
          phosphorus_level: number | null
          potassium_level: number | null
          recommendations: string[] | null
          test_date: string
          user_id: string
        }
        Insert: {
          field_location?: string | null
          id?: string
          moisture_level?: number | null
          nitrogen_level?: number | null
          ph_level?: number | null
          phosphorus_level?: number | null
          potassium_level?: number | null
          recommendations?: string[] | null
          test_date?: string
          user_id: string
        }
        Update: {
          field_location?: string | null
          id?: string
          moisture_level?: number | null
          nitrogen_level?: number | null
          ph_level?: number | null
          phosphorus_level?: number | null
          potassium_level?: number | null
          recommendations?: string[] | null
          test_date?: string
          user_id?: string
        }
        Relationships: []
      }
      video_guides: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          duration: string | null
          id: string
          language: string
          thumbnail_url: string | null
          title: string
          video_url: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          duration?: string | null
          id?: string
          language: string
          thumbnail_url?: string | null
          title: string
          video_url: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          duration?: string | null
          id?: string
          language?: string
          thumbnail_url?: string | null
          title?: string
          video_url?: string
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
