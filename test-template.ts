import { createClient } from '@supabase/supabase-js'
import { decrypt } from './src/lib/whatsapp/encryption'

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error('Missing Supabase env variables')
  }

  const supabase = createClient(url, key)

  const { data: config, error } = await supabase
    .from('whatsapp_config')
    .select('waba_id, access_token')
    .limit(1)
    .single()

  if (error || !config) {
    throw new Error('CONFIG ERROR: ' + JSON.stringify(error))
  }

  const accessToken = decrypt(config.access_token)

  const payload = {
    name: 'order_update_' + Date.now(),
    language: 'en_US',
    category: 'UTILITY',
    components: [
      {
        type: 'BODY',
        text: 'Hello {{1}}, your order {{2}} has been confirmed.',
        example: {
          body_text: [
            ['Vijender', 'NDB1001']
          ]
        }
      }
    ]
  }

  console.log('===== PAYLOAD =====')
  console.log(JSON.stringify(payload, null, 2))

  const response = await fetch(
    `https://graph.facebook.com/v23.0/${config.waba_id}/message_templates`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }
  )

  const text = await response.text()

  console.log('\n===== META STATUS =====')
  console.log(response.status)

  console.log('\n===== META RESPONSE =====')
  console.log(text)

  if (!response.ok) process.exit(1)
}

main().catch((err) => {
  console.error('\n===== SCRIPT ERROR =====')
  console.error(err)
  process.exit(1)
})
