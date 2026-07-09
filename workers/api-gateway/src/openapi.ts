export const OPENAPI_SPEC = {
  openapi: '3.0.3',
  info: {
    title: 'ChaseHorse API',
    version: '1.0.0',
    description: 'Enterprise logistics platform API',
    contact: { email: 'vineshmon@thestackly.com' },
  },
  servers: [{ url: 'https://chasehorse-api.vineshjm.workers.dev' }],
  paths: {
    '/api/v1/shipments': {
      get: {
        summary: 'List shipments',
        security: [{ ApiKeyAuth: [] }],
        responses: { '200': { description: 'Shipment list' } },
      },
    },
    '/api/shipments/track/{awb}': {
      get: {
        summary: 'Track shipment by AWB',
        parameters: [{ name: 'awb', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Tracking data' } },
      },
    },
    '/health': {
      get: { summary: 'Health check', responses: { '200': { description: 'OK' } } },
    },
  },
  components: {
    securitySchemes: {
      ApiKeyAuth: { type: 'apiKey', in: 'header', name: 'X-API-Key' },
      BearerAuth: { type: 'http', scheme: 'bearer' },
    },
  },
};
