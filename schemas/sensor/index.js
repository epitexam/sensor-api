const getSensorSchema = {
  querystring: {
    type: 'object',
    properties: {
      id: { type: 'number', minimum: 1, description: 'Unique identifier for the sensor' },
      friendly_name: { type: 'string', minLength: 1, maxLength: 255, description: 'Friendly name of the sensor' },
      room_id: { type: 'number', minimum: 1, description: 'Unique identifier for the room' },
      take: { type: 'number', minimum: 0, maximum: 100, default: 20, description: 'Number of sensors to retrieve' },
      skip: { type: 'number', minimum: 0, default: 0, description: 'Number of sensors to skip' }
    },
    additionalProperties: false
  },
  description: 'Retrieve sensor information by ID, friendly name, or room ID. Supports pagination with take and skip parameters.',
  summary: 'Get sensor information',
  tags: ['sensor'],
  security: [
    {
      BearerAuth: []
    }
  ],
};

module.exports = {
  getSensorSchema
};
