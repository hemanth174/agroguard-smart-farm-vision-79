
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { videoId, videoUrl } = await req.json()

    if (!videoId || !videoUrl) {
      throw new Error('Missing required parameters')
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log(`Starting AI analysis for video: ${videoId}`)

    // Simulate AI analysis with realistic detection scenarios
    const detectionScenarios = [
      {
        type: 'fire_detection',
        confidence: 0.85 + Math.random() * 0.14,
        description: 'Fire outbreak detected in field sector',
        severity: 'critical',
        requiresAction: true
      },
      {
        type: 'pest_infestation',
        confidence: 0.75 + Math.random() * 0.2,
        description: 'Pest activity detected on crops',
        severity: 'medium',
        requiresAction: true
      },
      {
        type: 'crop_damage',
        confidence: 0.7 + Math.random() * 0.25,
        description: 'Crop damage visible in monitored area',
        severity: 'medium',
        requiresAction: false
      },
      {
        type: 'animal_intrusion',
        confidence: 0.8 + Math.random() * 0.15,
        description: 'Wild animal intrusion detected',
        severity: 'high',
        requiresAction: true
      },
      {
        type: 'pipeline_damage',
        confidence: 0.9 + Math.random() * 0.09,
        description: 'Irrigation pipeline damage identified',
        severity: 'high',
        requiresAction: true
      },
      {
        type: 'equipment_malfunction',
        confidence: 0.65 + Math.random() * 0.3,
        description: 'Farm equipment malfunction detected',
        severity: 'low',
        requiresAction: false
      }
    ]

    // Randomly select 0-3 detections for this video
    const numDetections = Math.floor(Math.random() * 4)
    const selectedDetections = []
    
    for (let i = 0; i < numDetections; i++) {
      const scenario = detectionScenarios[Math.floor(Math.random() * detectionScenarios.length)]
      if (!selectedDetections.find(d => d.type === scenario.type)) {
        selectedDetections.push(scenario)
      }
    }

    console.log(`Generated ${selectedDetections.length} detections`)

    // Insert detections into database
    for (const detection of selectedDetections) {
      const { data: detectionData, error: detectionError } = await supabase
        .from('drone_detections')
        .insert({
          video_id: videoId,
          detection_type: detection.type,
          confidence_score: detection.confidence,
          description: detection.description,
          severity_level: detection.severity,
          timestamp_in_video: Math.floor(Math.random() * 300), // Random timestamp
          ai_model_used: 'DroneVision-AI-v2.1',
          requires_action: detection.requiresAction,
          gps_coordinates: {
            lat: 17.385 + (Math.random() - 0.5) * 0.01,
            lng: 78.486 + (Math.random() - 0.5) * 0.01
          }
        })
        .select()
        .single()

      if (detectionError) {
        console.error('Error inserting detection:', detectionError)
        continue
      }

      // Create alert for high-priority detections
      if (detection.severity === 'critical' || detection.severity === 'high') {
        const { data: videoData } = await supabase
          .from('drone_patrol_videos')
          .select('user_id')
          .eq('id', videoId)
          .single()

        if (videoData) {
          await supabase
            .from('drone_alerts')
            .insert({
              detection_id: detectionData.id,
              user_id: videoData.user_id,
              alert_type: detection.type,
              priority_level: detection.severity,
              title: `${detection.severity.toUpperCase()}: ${detection.type.replace('_', ' ')}`,
              message: `AI Detection: ${detection.description} (Confidence: ${(detection.confidence * 100).toFixed(1)}%)`,
              status: 'active',
              gps_location: {
                lat: 17.385 + (Math.random() - 0.5) * 0.01,
                lng: 78.486 + (Math.random() - 0.5) * 0.01
              },
              action_required: detection.requiresAction ? 'Immediate field inspection required' : null
            })
        }
      }
    }

    console.log('AI analysis completed successfully')

    return new Response(
      JSON.stringify({ 
        success: true, 
        detectionsCount: selectedDetections.length,
        detections: selectedDetections
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in AI analysis:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
