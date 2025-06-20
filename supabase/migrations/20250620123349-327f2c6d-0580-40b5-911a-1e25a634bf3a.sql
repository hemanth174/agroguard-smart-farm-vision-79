
-- Create drone patrol videos table
CREATE TABLE public.drone_patrol_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  filename TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT,
  duration_seconds INTEGER,
  upload_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processing_status TEXT NOT NULL DEFAULT 'pending',
  gps_latitude DECIMAL(10, 8),
  gps_longitude DECIMAL(11, 8),
  field_sector TEXT,
  weather_conditions JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create drone detections table for AI analysis results
CREATE TABLE public.drone_detections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id UUID NOT NULL REFERENCES public.drone_patrol_videos(id) ON DELETE CASCADE,
  detection_type TEXT NOT NULL,
  confidence_score DECIMAL(5, 4) NOT NULL,
  timestamp_in_video INTEGER,
  description TEXT NOT NULL,
  severity_level TEXT NOT NULL DEFAULT 'low',
  location_in_frame JSONB,
  gps_coordinates JSONB,
  ai_model_used TEXT,
  requires_action BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create drone patrol sessions table
CREATE TABLE public.drone_patrol_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_name TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_time TIMESTAMP WITH TIME ZONE,
  patrol_area JSONB,
  planned_duration_minutes INTEGER,
  status TEXT NOT NULL DEFAULT 'active',
  total_videos_uploaded INTEGER DEFAULT 0,
  total_detections INTEGER DEFAULT 0,
  high_priority_alerts INTEGER DEFAULT 0,
  weather_conditions JSONB,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create drone alerts table for critical notifications
CREATE TABLE public.drone_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  detection_id UUID REFERENCES public.drone_detections(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  alert_type TEXT NOT NULL,
  priority_level TEXT NOT NULL DEFAULT 'medium',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  acknowledged_by UUID,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolution_notes TEXT,
  notification_sent BOOLEAN DEFAULT false,
  escalated BOOLEAN DEFAULT false,
  escalation_count INTEGER DEFAULT 0,
  gps_location JSONB,
  action_required TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create drone fleet management table
CREATE TABLE public.drone_fleet (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  drone_id TEXT NOT NULL UNIQUE,
  drone_name TEXT NOT NULL,
  model TEXT,
  battery_level INTEGER,
  status TEXT NOT NULL DEFAULT 'idle',
  current_location JSONB,
  last_maintenance TIMESTAMP WITH TIME ZONE,
  flight_hours_total DECIMAL(8, 2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for drone_patrol_videos
ALTER TABLE public.drone_patrol_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own videos" 
  ON public.drone_patrol_videos 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can upload their own videos" 
  ON public.drone_patrol_videos 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own videos" 
  ON public.drone_patrol_videos 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own videos" 
  ON public.drone_patrol_videos 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add RLS policies for drone_detections
ALTER TABLE public.drone_detections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view detections for their videos" 
  ON public.drone_detections 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.drone_patrol_videos 
    WHERE id = drone_detections.video_id 
    AND user_id = auth.uid()
  ));

CREATE POLICY "System can create detections for user videos" 
  ON public.drone_detections 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.drone_patrol_videos 
    WHERE id = drone_detections.video_id 
    AND user_id = auth.uid()
  ));

-- Add RLS policies for drone_patrol_sessions
ALTER TABLE public.drone_patrol_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own patrol sessions" 
  ON public.drone_patrol_sessions 
  FOR ALL 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add RLS policies for drone_alerts
ALTER TABLE public.drone_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own alerts" 
  ON public.drone_alerts 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "System can create alerts for users" 
  ON public.drone_alerts 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own alerts" 
  ON public.drone_alerts 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Add RLS policies for drone_fleet
ALTER TABLE public.drone_fleet ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own drone fleet" 
  ON public.drone_fleet 
  FOR ALL 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_drone_videos_user_timestamp ON public.drone_patrol_videos(user_id, upload_timestamp DESC);
CREATE INDEX idx_drone_detections_video_severity ON public.drone_detections(video_id, severity_level);
CREATE INDEX idx_drone_alerts_user_priority ON public.drone_alerts(user_id, priority_level, status);
CREATE INDEX idx_drone_sessions_user_status ON public.drone_patrol_sessions(user_id, status, start_time DESC);

-- Create storage bucket for drone videos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'drone-videos',
  'drone-videos',
  true,
  524288000,
  ARRAY['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm']
);

-- Create storage policies for drone videos
CREATE POLICY "Users can upload drone videos"
ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'drone-videos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view drone videos"
ON storage.objects FOR SELECT USING (
  bucket_id = 'drone-videos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their drone videos"
ON storage.objects FOR UPDATE USING (
  bucket_id = 'drone-videos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their drone videos"
ON storage.objects FOR DELETE USING (
  bucket_id = 'drone-videos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
