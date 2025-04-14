const getRoomSchema = {
  querystring: {
    type: 'object',
    properties: {
      room_id: { type: 'number', minimum: 1, description: 'Unique identifier for the room' },
      name: { type: 'string', minLength: 1, maxLength: 255, description: 'Name of the room' },
      take: { type: 'number', minimum: 0, maximum: 100, description: 'Number of rooms to retrieve' },
      skip: { type: 'number', minimum: 0, description: 'Number of rooms to skip' }
    },
    additionalProperties: false
  },
  description: 'Retrieve room information by ID or name. Supports pagination with take and skip parameters.',
  summary: 'Get room information',
  tags: ['room-admin'],
  security: [
    {
      BearerAuth: []
    }
  ],
};

const createRoomSchema = {
  body: {
    type: 'object',
    required: ['name', 'volume'],
    properties: {
      name: { type: 'string', minLength: 1, maxLength: 255, description: 'Name of the room' },
      volume: { type: 'number', minimum: 0, maximum: 10000, description: 'Volume of the room' }
    },
    additionalProperties: false
  },
  description: 'Create a new room with a name and volume.',
  summary: 'Create room',
  tags: ['room-admin'],
  security: [
    {
      BearerAuth: []
    }
  ],
};

const updateRoomSchema = {
  body: {
    type: 'object',
    required: ['room_id', 'name', 'volume'],
    properties: {
      room_id: { type: 'number', minimum: 1, description: 'Unique identifier for the room' },
      name: { type: 'string', minLength: 1, maxLength: 255, description: 'Name of the room' },
      volume: { type: 'number', minimum: 0, maximum: 10000, description: 'Volume of the room' }
    },
    additionalProperties: false
  },
  description: 'Update room information such as name and volume.',
  summary: 'Update room details',
  tags: ['room-admin'],
  security: [
    {
      BearerAuth: []
    }
  ],
};

const deleteRoomSchema = {
  body: {
    type: 'object',
    required: ['room_id'],
    properties: {
      room_id: { type: 'number', minimum: 1, description: 'Unique identifier for the room' }
    },
    additionalProperties: false
  },
  description: 'Delete a room by its ID.',
  summary: 'Delete room',
  tags: ['room-admin'],
  security: [
    {
      BearerAuth: []
    }
  ],
};

module.exports = {
  getRoomSchema,
  createRoomSchema,
  updateRoomSchema,
  deleteRoomSchema
};
