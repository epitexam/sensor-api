const getUserSchema = {
  querystring: {
    type: 'object',
    properties: {
      username: { type: 'string', minLength: 1, maxLength: 50, description: 'Username' },
      take: { type: 'number', default: 20 },
      skip: { type: 'number', default: 0 }
    },
    required: []
  },
  description: 'Get user information by ID or username. Supports pagination with take and skip parameters.',
  summary: 'Retrieve user information',
  tags: ['user']
};

const meUserSchema = {
  querystring: {
    type: 'object',
    properties: {},
    required: []
  },
  security: [
    {
      BearerAuth: []
    }
  ],
  description: 'Retrieve the authenticated user\'s information.',
  summary: 'Get authenticated user information',
  tags: ['user']
};

const updateUserSchema = {
  description: 'Update user information such as username, email, first name, last name, and password.',
  tags: ['user'],
  security: [
    {
      BearerAuth: []
    }
  ],
  summary: 'Update user details',
  body: {
    type: 'object',
    properties: {
      username: { type: 'string', minLength: 3, maxLength: 30, description: 'Username' },
      email: { type: 'string', format: 'email', description: 'Email address' },
      first_name: { type: 'string', minLength: 1, maxLength: 50, description: 'First name' },
      last_name: { type: 'string', minLength: 1, maxLength: 50, description: 'Last name' },
      password: { type: 'string', minLength: 8, maxLength: 100, description: 'Password' }
    },
    required: [],
    additionalProperties: false
  }
};

const deleteUserSchema = {
  description: 'Delete a user by ID.',
  tags: ['user'],
  security: [
    {
      BearerAuth: []
    }
  ],
  summary: 'Delete user',
  body: {
    type: 'object',
    properties: {},
    required: []
  }
};

module.exports = {
  getUserSchema,
  meUserSchema,
  updateUserSchema,
  deleteUserSchema
};
