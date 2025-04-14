const getRoomSchema = {
  querystring: {
    type: 'object',
    properties: {
      room_id: { type: 'number', minimum: 1, description: 'Unique identifier for the room' },
      name: { type: 'string', minLength: 1, maxLength: 255, description: 'Name of the room' },
      take: { type: 'integer', minimum: 0, maximum: 100, description: 'Number of rooms to retrieve' },
      skip: { type: 'integer', minimum: 0, description: 'Number of rooms to skip' }
    },
    additionalProperties: false
  },
  tags: ['room'],
  summary: 'Retrieve room information',
  description: 'Fetches room details based on room_id or name. Supports pagination with take and skip parameters.'
};

module.exports = {
  getRoomSchema
};
