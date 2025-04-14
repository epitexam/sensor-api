const getSensorHistorySchema = {
  querystring: {
    type: 'object',
    required: ['friendly_name'],
    properties: {
      friendly_name: { type: 'string', minLength: 1, maxLength: 255, description: 'Friendly name of the sensor' },
      sensor_id: { type: 'number', description: 'Unique identifier for the sensor' },
      start_date: { type: 'string', format: 'date-time', description: 'Start date for the history range' },
      end_date: { type: 'string', format: 'date-time', description: 'End date for the history range' },
      take: { type: 'number', default: 20, minimum: 0, maximum: 100, description: 'Number of records to retrieve' },
      skip: { type: 'number', default: 0, minimum: 0, description: 'Number of records to skip' }
    },
    additionalProperties: false
  },
  description: 'Retrieve sensor history within a specified date range. Supports pagination with take and skip parameters.',
  summary: 'Get sensor history',
  tags: ['history-admin'],
  security: [
    {
      BearerAuth: []
    }
  ],
};

const createSensorHistorySchema = {
  body: {
    type: 'object',
    required: ['friendly_name', 'state'],
    properties: {
      friendly_name: { type: 'string', minLength: 1, maxLength: 255, description: 'Friendly name of the sensor' },
      state: { type: 'number', description: 'State of the sensor' },
      recorded_at: { type: 'string', format: 'date-time', description: 'Timestamp when the state was recorded' }
    },
    additionalProperties: false
  },
  description: 'Create a new sensor history record with sensor ID, state, and recorded timestamp.',
  summary: 'Create sensor history',
  tags: ['history-admin'],
  security: [
    {
      BearerAuth: []
    }
  ],
};

const deleteSensorHistorySchema = {
  body: {
    type: 'object',
    required: ['history_ids'],
    properties: {
      history_ids: {
        type: 'array',
        items: { type: 'number', description: 'Unique identifier for the sensor history' },
        description: 'Array of sensor history IDs to delete'
      }
    },
    additionalProperties: false
  },
  description: 'Delete sensor history records by their IDs.',
  summary: 'Delete sensor history',
  tags: ['history-admin'],
  security: [
    {
      BearerAuth: []
    }
  ],
};

module.exports = {
  getSensorHistorySchema,
  createSensorHistorySchema,
  deleteSensorHistorySchema
};
