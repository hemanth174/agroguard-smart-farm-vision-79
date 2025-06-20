
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useApp } from '@/contexts/AppContext';

export interface DroneVideo {
  id: string;
  filename: string;
  file_url: string;
  file_size: number;
  duration_seconds?: number;
  upload_timestamp: string;
  processing_status: 'pending' | 'processing' | 'completed' | 'failed';
  gps_latitude?: number;
  gps_longitude?: number;
  field_sector?: string;
  weather_conditions?: any;
}

export interface DroneDetection {
  id: string;
  video_id: string;
  detection_type: string;
  confidence_score: number;
  timestamp_in_video?: number;
  description: string;
  severity_level: 'low' | 'medium' | 'high' | 'critical';
  location_in_frame?: any;
  gps_coordinates?: any;
  ai_model_used?: string;
  requires_action: boolean;
  created_at: string;
}

export interface DroneAlert {
  id: string;
  detection_id?: string;
  alert_type: string;
  priority_level: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  status: 'active' | 'acknowledged' | 'resolved';
  acknowledged_at?: string;
  resolved_at?: string;
  gps_location?: any;
  action_required?: string;
  created_at: string;
}

export const useDronePatrol = () => {
  const [videos, setVideos] = useState<DroneVideo[]>([]);
  const [detections, setDetections] = useState<DroneDetection[]>([]);
  const [alerts, setAlerts] = useState<DroneAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const { addAlert } = useApp();

  // Fetch videos from database
  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('drone_patrol_videos')
        .select('*')
        .order('upload_timestamp', { ascending: false });

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
      addAlert({
        type: 'error',
        title: 'Database Error',
        message: 'Failed to fetch drone videos',
        resolved: false
      });
    }
  };

  // Fetch detections for all videos
  const fetchDetections = async () => {
    try {
      const { data, error } = await supabase
        .from('drone_detections')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setDetections(data || []);
    } catch (error) {
      console.error('Error fetching detections:', error);
    }
  };

  // Fetch active alerts
  const fetchAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('drone_alerts')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAlerts(data || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  // Upload video to storage and database
  const uploadVideo = async (file: File, metadata?: Partial<DroneVideo>) => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      // Upload to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('drone-videos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('drone-videos')
        .getPublicUrl(fileName);

      // Insert video record
      const { data: videoData, error: dbError } = await supabase
        .from('drone_patrol_videos')
        .insert({
          user_id: user.id,
          filename: file.name,
          file_url: publicUrl,
          file_size: file.size,
          processing_status: 'pending',
          ...metadata
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Trigger AI analysis
      await triggerAIAnalysis(videoData.id, publicUrl);

      // Refresh videos list
      await fetchVideos();

      addAlert({
        type: 'info',
        title: 'Video Uploaded',
        message: `${file.name} uploaded successfully. AI analysis starting...`,
        resolved: false
      });

      return videoData;
    } catch (error) {
      console.error('Error uploading video:', error);
      addAlert({
        type: 'error',
        title: 'Upload Failed',
        message: 'Failed to upload video. Please try again.',
        resolved: false
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Trigger AI analysis for uploaded video
  const triggerAIAnalysis = async (videoId: string, videoUrl: string) => {
    try {
      // Update status to processing
      await supabase
        .from('drone_patrol_videos')
        .update({ processing_status: 'processing' })
        .eq('id', videoId);

      // Call AI analysis edge function
      const { data, error } = await supabase.functions.invoke('analyze-drone-video', {
        body: { videoId, videoUrl }
      });

      if (error) throw error;

      // Update status to completed
      await supabase
        .from('drone_patrol_videos')
        .update({ processing_status: 'completed' })
        .eq('id', videoId);

      // Refresh data
      await fetchDetections();
      await fetchAlerts();

    } catch (error) {
      console.error('Error in AI analysis:', error);
      
      // Update status to failed
      await supabase
        .from('drone_patrol_videos')
        .update({ processing_status: 'failed' })
        .eq('id', videoId);
    }
  };

  // Acknowledge alert
  const acknowledgeAlert = async (alertId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      await supabase
        .from('drone_alerts')
        .update({
          status: 'acknowledged',
          acknowledged_at: new Date().toISOString(),
          acknowledged_by: user.id
        })
        .eq('id', alertId);

      await fetchAlerts();
    } catch (error) {
      console.error('Error acknowledging alert:', error);
    }
  };

  // Resolve alert
  const resolveAlert = async (alertId: string, notes?: string) => {
    try {
      await supabase
        .from('drone_alerts')
        .update({
          status: 'resolved',
          resolved_at: new Date().toISOString(),
          resolution_notes: notes
        })
        .eq('id', alertId);

      await fetchAlerts();
    } catch (error) {
      console.error('Error resolving alert:', error);
    }
  };

  // Set up real-time subscriptions
  useEffect(() => {
    fetchVideos();
    fetchDetections();
    fetchAlerts();

    // Subscribe to real-time updates
    const alertsSubscription = supabase
      .channel('drone_alerts')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'drone_alerts' },
        (payload) => {
          console.log('Alert update:', payload);
          fetchAlerts();
        }
      )
      .subscribe();

    const detectionsSubscription = supabase
      .channel('drone_detections')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'drone_detections' },
        (payload) => {
          console.log('Detection update:', payload);
          fetchDetections();
        }
      )
      .subscribe();

    setLoading(false);

    return () => {
      alertsSubscription.unsubscribe();
      detectionsSubscription.unsubscribe();
    };
  }, []);

  return {
    videos,
    detections,
    alerts,
    loading,
    uploadVideo,
    acknowledgeAlert,
    resolveAlert,
    refreshData: () => {
      fetchVideos();
      fetchDetections();
      fetchAlerts();
    }
  };
};
