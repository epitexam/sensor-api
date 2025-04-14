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
  tags: ['sensor-admin'],
  security: [
    {
      BearerAuth: []
    }
  ],
};

const createSensorSchema = {
  body: {
    type: 'object',
    required: ['friendly_name', 'unit_of_measurement'],
    properties: {
      friendly_name: { type: 'string', minLength: 1, maxLength: 255, description: 'Friendly name of the sensor' },
      unit_of_measurement: { type: 'string', minLength: 1, maxLength: 255, description: 'Unit of measurement for the sensor' },
      room_id: { type: 'number', minimum: 1, description: 'Unique identifier for the room' }
    },
    additionalProperties: false
  },
  description: 'Create a new sensor with a friendly name, unit of measurement, and optional room ID.',
  summary: 'Create sensor',
  tags: ['sensor-admin'],
  security: [
    {
      BearerAuth: []
    }
  ],
};

const updateSensorSchema = {
  body: {
    type: 'object',
    required: ['id', 'friendly_name', 'unit_of_measurement'],
    properties: {
      id: { type: 'number', minimum: 1, description: 'Unique identifier for the sensor' },
      friendly_name: { type: 'string', minLength: 1, maxLength: 255, description: 'Friendly name of the sensor' },
      unit_of_measurement: { type: 'string', minLength: 1, maxLength: 255, description: 'Unit of measurement for the sensor' }
    },
    additionalProperties: false
  },
  description: 'Update sensor information such as friendly name and unit of measurement.',
  summary: 'Update sensor details',
  tags: ['sensor-admin'],
  security: [
    {
      BearerAuth: []
    }
  ],
};

const deleteSensorSchema = {
  body: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'number', minimum: 1, description: 'Unique identifier for the sensor' }
    },
    additionalProperties: false
  },
  description: 'Delete a sensor by its ID.',
  summary: 'Delete sensor',
  tags: ['sensor-admin'],
  security: [
    {
      BearerAuth: []
    }
  ],
};

module.exports = {
  getSensorSchema,
  createSensorSchema,
  updateSensorSchema,
  deleteSensorSchema
};
