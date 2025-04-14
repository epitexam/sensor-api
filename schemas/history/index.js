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
  tags: ['history'],
};

module.exports = {
  getSensorHistorySchema
};
