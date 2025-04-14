const getUserSchema = {
  description: 'Get user information by ID or username. Supports pagination with take and skip parameters.',
  tags: ['user-admin'],
  security: [
    {
      BearerAuth: []
    }
  ],
  summary: 'Retrieve user information',
  querystring: {
    type: 'object',
    properties: {
      user_id: { type: 'number', minimum: 1, default: 1, description: 'User id' },
      username: { type: 'string', minLength: 3, maxLength: 30, description: 'Username' },
      take: { type: 'number', minimum: 1, maximum: 100, default: 20, description: 'Number of users to retrieve' },
      skip: { type: 'number', minimum: 0, default: 0, description: 'Number of users to skip' }
    },
    required: [],
    additionalProperties: false
  }
};

const updateUserSchema = {
  description: 'Update user information such as username, email, first name, last name, and password.',
  tags: ['user-admin'],
  security: [
    {
      BearerAuth: []
    }
  ],
  summary: 'Update user details',
  body: {
    type: 'object',
    properties: {
      user_id: { type: 'number', minimum: 1, description: 'User ID' },
      username: { type: 'string', minLength: 3, maxLength: 30, description: 'Username' },
      email: { type: 'string', format: 'email', description: 'Email address' },
      first_name: { type: 'string', minLength: 1, maxLength: 50, description: 'First name' },
      last_name: { type: 'string', minLength: 1, maxLength: 50, description: 'Last name' },
      password: { type: 'string', minLength: 8, maxLength: 100, description: 'Password' }
    },
    required: ['user_id'],
    additionalProperties: false
  }
};

const deleteUserSchema = {
  description: 'Delete a user by ID.',
  tags: ['user-admin'],
  security: [
    {
      BearerAuth: []
    }
  ],
  summary: 'Delete user',
  body: {
    type: 'object',
    properties: {
      user_id: { type: 'number', minimum: 1, description: 'User ID' },
    },
    required: ['user_id'],
    additionalProperties: false
  }
};

module.exports = {
  getUserSchema,
  updateUserSchema,
  deleteUserSchema
};
