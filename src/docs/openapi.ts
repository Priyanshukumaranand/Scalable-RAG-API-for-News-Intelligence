const openapiDocument = {
  openapi: '3.0.1',
  info: {
    title: 'Scalable RAG API',
    version: '1.0.0',
    description: 'RAG API for news intelligence with ingestion, chat, and history.',
  },
  servers: [{ url: 'http://localhost:3000' }],
  paths: {
    '/health': {
      get: {
        summary: 'Health check',
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { status: { type: 'string' } },
                },
              },
            },
          },
        },
      },
    },
    '/ingest': {
      post: {
        summary: 'Trigger ingestion',
        responses: {
          200: { description: 'Ingestion completed inline' },
          202: { description: 'Ingestion queued' },
        },
      },
    },
    '/chat': {
      post: {
        summary: 'Chat with RAG pipeline',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  sessionId: { type: 'string' },
                  query: { type: 'string' },
                },
                required: ['sessionId', 'query'],
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Answer and sources',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    answer: { type: 'string' },
                    sources: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          title: { type: 'string' },
                          url: { type: 'string' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          400: { description: 'Invalid payload' },
        },
      },
    },
    '/history/{sessionId}': {
      get: {
        summary: 'Get history',
        parameters: [
          {
            name: 'sessionId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: { description: 'History returned' },
          400: { description: 'SessionId required' },
        },
      },
      delete: {
        summary: 'Clear history',
        parameters: [
          {
            name: 'sessionId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          204: { description: 'Cleared' },
          400: { description: 'SessionId required' },
        },
      },
    },
  },
};

export default openapiDocument;
