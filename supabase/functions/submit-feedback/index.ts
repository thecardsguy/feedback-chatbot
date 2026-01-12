import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }

  try {
    const payload = await req.json()
    
    if (!payload.raw_text || payload.raw_text.length < 5) {
      return new Response(JSON.stringify({ error: 'Feedback text is required (min 5 chars)' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

    const { data: feedback, error } = await supabase
      .from('feedback')
      .insert({
        raw_text: payload.raw_text.slice(0, 5000),
        category: payload.category || 'other',
        severity: payload.severity || 'medium',
        page_url: payload.page_url,
        target_element: payload.target_element,
        device_type: payload.device_type,
        status: 'pending',
      })
      .select('id, created_at')
      .single()

    if (error) throw error

    return new Response(JSON.stringify({ success: true, id: feedback.id }), { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: 'Failed to submit feedback' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})