const addAdminSchema = {
    body: {
        type: 'object',
        required: ['email'],
        properties: {
            email: { type: 'string', format: 'email', description: 'Email address' },
        },
        additionalProperties: false
    },
    description: 'Promote a user to admin by their email address. The user must exist in the system.',
    summary: 'Add admin',
    tags: ['admin'],
    security: [
        {
            BearerAuth: []
        }
    ],
};

module.exports = {
    addAdminSchema
};
