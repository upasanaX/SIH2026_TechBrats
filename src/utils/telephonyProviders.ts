import { TelephonyProvider, TelephonyConfig, TelephonyDispatchResult } from '../types';

export interface ProviderMeta {
  id: TelephonyProvider;
  name: string;
  tagline: string;
  logoColor: string;
  badgeBg: string;
  authHeaderName: string;
  smsEndpointTemplate: (cfg: TelephonyConfig) => string;
  voiceEndpointTemplate: (cfg: TelephonyConfig) => string;
  defaultConfig: TelephonyConfig;
  generateSmsPayload: (to: string, message: string, cfg: TelephonyConfig) => any;
  generateVoicePayload: (to: string, script: string, cfg: TelephonyConfig) => any;
  generateCurlCommand: (to: string, message: string, cfg: TelephonyConfig, type: 'sms' | 'ivr') => string;
  mockResponse: (to: string, message: string, cfg: TelephonyConfig, type: 'sms' | 'ivr') => any;
}

export const TELEPHONY_PROVIDERS: Record<TelephonyProvider, ProviderMeta> = {
  twilio: {
    id: 'twilio',
    name: 'Twilio',
    tagline: 'Programmable SMS & Voice Calls API',
    logoColor: 'text-red-500',
    badgeBg: 'bg-red-50 text-red-700 border-red-200',
    authHeaderName: 'Authorization: Basic <base64(AccountSid:AuthToken)>',
    smsEndpointTemplate: (cfg) => `https://api.twilio.com/2010-04-01/Accounts/${cfg.accountSid || 'AC_DEMO_SID'}/Messages.json`,
    voiceEndpointTemplate: (cfg) => `https://api.twilio.com/2010-04-01/Accounts/${cfg.accountSid || 'AC_DEMO_SID'}/Calls.json`,
    defaultConfig: {
      provider: 'twilio',
      accountSid: 'AC_DEMO_SID',
      authToken: 'TWILIO_AUTH_TOKEN_NOT_CONFIGURED',
      fromNumber: '+1 (800) 555-0199',
      dltEntityId: '110152984000002194',
      dltTemplateId: '110716892348910245'
    },
    generateSmsPayload: (to, message, cfg) => ({
      To: to,
      From: cfg.fromNumber,
      Body: message,
      StatusCallback: 'https://krishikavach.gov.in/api/v1/telephony/twilio/webhook',
      ValidityPeriod: '3600',
      DltEntityId: cfg.dltEntityId,
      DltTemplateId: cfg.dltTemplateId
    }),
    generateVoicePayload: (to, script, cfg) => ({
      To: to,
      From: cfg.fromNumber,
      Twiml: `<Response><Say voice="Polly.Aditi" language="hi-IN">${script}</Say><Gather numDigits="1" action="/handle-key"><Say>Press 1 to repeat, 9 to talk to FPO</Say></Gather></Response>`,
      MachineDetection: 'Enable',
      Timeout: 25
    }),
    generateCurlCommand: (to, message, cfg, type) => {
      const endpoint = type === 'sms'
        ? `https://api.twilio.com/2010-04-01/Accounts/${cfg.accountSid}/Messages.json`
        : `https://api.twilio.com/2010-04-01/Accounts/${cfg.accountSid}/Calls.json`;
      return `curl -X POST "${endpoint}" \\
  -u "${cfg.accountSid}:${cfg.authToken}" \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  -d "To=${encodeURIComponent(to)}" \\
  -d "From=${encodeURIComponent(cfg.fromNumber)}" \\
  ${type === 'sms' ? `-d "Body=${encodeURIComponent(message)}"` : `-d "Twiml=<Response><Say>${encodeURIComponent(message)}</Say></Response>"`}`;
    },
    mockResponse: (to, _msg, cfg, type) => {
      const id = `SM${Math.random().toString(36).substring(2, 10)}${Date.now().toString(36)}`;
      return {
        sid: id,
        date_created: new Date().toUTCString(),
        date_updated: new Date().toUTCString(),
        date_sent: null,
        account_sid: cfg.accountSid,
        to: to,
        from: cfg.fromNumber,
        status: type === 'sms' ? 'delivered' : 'in-progress',
        direction: 'outbound-api',
        price: '0.0075',
        price_unit: 'USD',
        api_version: '2010-04-01',
        dlt_compliance: {
          telecom_circle: 'West Bengal & Kolkata (BSNL/Airtel/Jio)',
          entity_id: cfg.dltEntityId,
          template_id: cfg.dltTemplateId,
          delivery_status: 'SUCCESS_TRAI_VERIFIED'
        }
      };
    }
  },

  sinch: {
    id: 'sinch',
    name: 'Sinch',
    tagline: 'Enterprise Global SMS & Voice Gateway',
    logoColor: 'text-amber-500',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
    authHeaderName: 'Authorization: Bearer <Sinch_API_Token>',
    smsEndpointTemplate: (cfg) => `https://sms.api.sinch.com/xms/v1/${cfg.accountSid || 'sp_demo_service'}/batches`,
    voiceEndpointTemplate: () => `https://calling.api.sinch.com/calling/v1/callouts`,
    defaultConfig: {
      provider: 'sinch',
      accountSid: 'sp_live_agri_wb_991823',
      authToken: 'sinch_tok_7fa098231bc4028fa991',
      fromNumber: 'KKAVACH',
      dltEntityId: '110152984000002194',
      dltTemplateId: '110716892348910245'
    },
    generateSmsPayload: (to, message, cfg) => ({
      from: cfg.fromNumber,
      to: [to],
      body: message,
      type: 'mt_text',
      delivery_report: 'summary',
      dlt: {
        entity_id: cfg.dltEntityId,
        template_id: cfg.dltTemplateId
      }
    }),
    generateVoicePayload: (to, script, cfg) => ({
      method: 'ttsCallout',
      ttsCallout: {
        cli: cfg.fromNumber,
        destination: { type: 'number', endpoint: to },
        domain: 'pstn',
        text: script,
        prompts: '#TTS_INDIAN_ACCENT',
        enableIvrMenu: true
      }
    }),
    generateCurlCommand: (to, message, cfg, type) => {
      const endpoint = type === 'sms'
        ? `https://sms.api.sinch.com/xms/v1/${cfg.accountSid}/batches`
        : `https://calling.api.sinch.com/calling/v1/callouts`;
      return `curl -X POST "${endpoint}" \\
  -H "Authorization: Bearer ${cfg.authToken}" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(type === 'sms' ? { from: cfg.fromNumber, to: [to], body: message } : { method: 'ttsCallout', ttsCallout: { destination: { endpoint: to }, text: message } }, null, 2)}'`;
    },
    mockResponse: (to, _msg, cfg, type) => ({
      id: `sinch_batch_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      to: [to],
      from: cfg.fromNumber,
      type: type === 'sms' ? 'mt_text' : 'tts_callout',
      state: 'Finished',
      canceled: false,
      total_parts: 1,
      created_at: new Date().toISOString(),
      service_plan: cfg.accountSid,
      carrier_feedback: {
        routed_operator: 'BSNL Rural BTS Tower',
        delivery_handshake_ms: 188,
        gsm_signal: 'Excellent'
      }
    })
  },

  infobip: {
    id: 'infobip',
    name: 'Infobip',
    tagline: 'Omnichannel Cloud Communications Platform',
    logoColor: 'text-orange-500',
    badgeBg: 'bg-orange-50 text-orange-700 border-orange-200',
    authHeaderName: 'Authorization: App <Infobip_API_Key>',
    smsEndpointTemplate: (cfg) => `https://${cfg.baseUrl || '9y8z1m.api.infobip.com'}/sms/2/text/advanced`,
    voiceEndpointTemplate: (cfg) => `https://${cfg.baseUrl || '9y8z1m.api.infobip.com'}/tts/3/advanced`,
    defaultConfig: {
      provider: 'infobip',
      baseUrl: 'api.infobip.com',
      accountSid: 'ib_acc_krishi_kavach_india',
      authToken: 'ib_key_08912ef667a44901bce55',
      fromNumber: 'InfoSMS',
      dltEntityId: '110152984000002194',
      dltTemplateId: '110716892348910245'
    },
    generateSmsPayload: (to, message, cfg) => ({
      messages: [
        {
          from: cfg.fromNumber,
          destinations: [{ to }],
          text: message,
          regional: {
            indiaDlt: {
              entityId: cfg.dltEntityId,
              templateId: cfg.dltTemplateId
            }
          }
        }
      ]
    }),
    generateVoicePayload: (to, script, cfg) => ({
      messages: [
        {
          from: cfg.fromNumber,
          destinations: [{ to }],
          text: script,
          language: 'hi',
          voice: { name: 'Aditi', gender: 'female' },
          speed: 0.95
        }
      ]
    }),
    generateCurlCommand: (to, message, cfg, type) => {
      const endpoint = type === 'sms'
        ? `https://${cfg.baseUrl || 'api.infobip.com'}/sms/2/text/advanced`
        : `https://${cfg.baseUrl || 'api.infobip.com'}/tts/3/advanced`;
      return `curl -X POST "${endpoint}" \\
  -H "Authorization: App ${cfg.authToken}" \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json" \\
  -d '${JSON.stringify({ messages: [{ from: cfg.fromNumber, destinations: [{ to }], text: message }] }, null, 2)}'`;
    },
    mockResponse: (to, _msg, cfg, _type) => ({
      bulkId: `ib_bulk_${Date.now()}`,
      messages: [
        {
          to: to,
          status: {
            groupId: 1,
            groupName: 'PENDING',
            id: 7,
            name: 'DELIVERED_TO_HANDSET',
            description: 'Message delivered to receiver phone'
          },
          smsCount: 1,
          messageId: `ib_msg_${Math.random().toString(36).substring(2, 10)}`,
          network: {
            networkName: 'Jio India Rural South 24 Parganas',
            countryName: 'India',
            mcc: '405',
            mnc: '861'
          }
        }
      ]
    })
  },

  plivo: {
    id: 'plivo',
    name: 'Plivo',
    tagline: 'Simple, Reliable SMS & Voice Platform',
    logoColor: 'text-emerald-500',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    authHeaderName: 'Authorization: Basic <base64(AuthId:AuthToken)>',
    smsEndpointTemplate: (cfg) => `https://api.plivo.com/v1/Account/${cfg.accountSid || 'MAMOTKYTI...'}//Message/`,
    voiceEndpointTemplate: (cfg) => `https://api.plivo.com/v1/Account/${cfg.accountSid || 'MAMOTKYTI...'}/Call/`,
    defaultConfig: {
      provider: 'plivo',
      accountSid: 'MAMOTKYTI3ZDK0MJUXNG',
      authToken: 'plivo_auth_tok_Yjc3NzY0NmQxMzg4MzgyZDE',
      fromNumber: '+91 98000 12345',
      dltEntityId: '110152984000002194',
      dltTemplateId: '110716892348910245'
    },
    generateSmsPayload: (to, message, cfg) => ({
      src: cfg.fromNumber,
      dst: to,
      text: message,
      dlt_entity_id: cfg.dltEntityId,
      dlt_template_id: cfg.dltTemplateId,
      url: 'https://krishikavach.gov.in/api/v1/telephony/plivo/status'
    }),
    generateVoicePayload: (to, script, cfg) => ({
      from: cfg.fromNumber,
      to: to,
      answer_url: `https://krishikavach.gov.in/plivo-xml?text=${encodeURIComponent(script)}`,
      answer_method: 'GET'
    }),
    generateCurlCommand: (to, message, cfg, type) => {
      const endpoint = type === 'sms'
        ? `https://api.plivo.com/v1/Account/${cfg.accountSid}/Message/`
        : `https://api.plivo.com/v1/Account/${cfg.accountSid}/Call/`;
      return `curl -X POST "${endpoint}" \\
  -u "${cfg.accountSid}:${cfg.authToken}" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(type === 'sms' ? { src: cfg.fromNumber, dst: to, text: message } : { from: cfg.fromNumber, to: to, answer_url: 'https://krishikavach.gov.in/xml' }, null, 2)}'`;
    },
    mockResponse: (to, _msg, _cfg, _type) => ({
      message: 'message(s) queued',
      message_uuid: [`plivo-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`],
      api_id: `plivo_req_${Math.random().toString(36).substring(2, 10)}`,
      status: 'delivered',
      delivery_details: {
        to: to,
        carrier: 'Airtel Enterprise West Bengal Circle',
        latency_ms: 195,
        delivered_at: new Date().toISOString()
      }
    })
  }
};

/**
 * Execute simulated or real API call for SMS / IVR
 */
export async function executeTelephonyDispatch(
  provider: TelephonyProvider,
  type: 'sms' | 'ivr',
  recipient: string,
  content: string,
  config: TelephonyConfig
): Promise<TelephonyDispatchResult> {
  const meta = TELEPHONY_PROVIDERS[provider];
  const startTime = Date.now();

  // Simulate network latency (250-600ms)
  await new Promise(resolve => setTimeout(resolve, 450));
  const latency = Date.now() - startTime;

  const endpoint = type === 'sms' 
    ? meta.smsEndpointTemplate(config)
    : meta.voiceEndpointTemplate(config);

  const requestPayload = type === 'sms'
    ? meta.generateSmsPayload(recipient, content, config)
    : meta.generateVoicePayload(recipient, content, config);

  const responsePayload = meta.mockResponse(recipient, content, config, type);

  const carrierMap: Record<TelephonyProvider, string> = {
    twilio: 'BSNL Rural GSM / Jio 4G Tower (South 24 Parganas)',
    sinch: 'Airtel Enterprise Gateway (Kolkata Circle)',
    infobip: 'Jio Cellular Micro-Cell (Bhangar Node)',
    plivo: 'Vodafone Idea / BSNL Rural Node (Canning-II)'
  };

  const messageId = responsePayload.sid || 
    responsePayload.id || 
    responsePayload.bulkId || 
    (responsePayload.message_uuid && responsePayload.message_uuid[0]) || 
    `MSG-${Date.now()}`;

  return {
    provider,
    type,
    status: 'delivered',
    messageId,
    timestamp: new Date().toLocaleTimeString(),
    latencyMs: latency,
    carrier: carrierMap[provider],
    endpointUrl: endpoint,
    requestPayload,
    responsePayload
  };
}
