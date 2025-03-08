'use strict'

const { test } = require('node:test')
const assert = require('node:assert')
const { build } = require('../helper')
const argon2 = require('argon2');

test('POST /login - should authenticate with valid credentials', async (t) => {
    const app = await build(t)

    await app.prisma.user.create({
        data: {
            email: 'user@example.com',
            username: 'username123',
            password: await argon2.hash('password123'),
            first_name: 'First',
            last_name: 'Last',
        }
    })

    const res = await app.inject({
        method: 'POST',
        url: '/auth/login',
        payload: {
            email: 'user@example.com',
            password: 'password123',
        }
    })


    assert.strictEqual(res.statusCode, 200)
    const responseJson = JSON.parse(res.payload)
    assert.ok(responseJson.token, 'Token should be present')
})

test('POST /login - should return error with invalid credentials', async (t) => {
    const app = await build(t)

    await app.prisma.user.create({
        data: {
            email: 'user969@example.com',
            username: 'username123',
            password: await argon2.hash('password123'),
            first_name: 'First',
            last_name: 'Last',
        }
    })

    const res = await app.inject({
        method: 'POST',
        url: '/auth/login',
        payload: {
            email: 'user969@example.com',
            password: 'wrongpassword',
        }
    })

    assert.strictEqual(res.statusCode, 400)
    const responseJson = JSON.parse(res.payload)
    assert.strictEqual(responseJson.message, 'Invalid credentials.', 'Error message should match')
})

test('POST /register - should register a new user', async (t) => {
    const app = await build(t)

    const res = await app.inject({
        method: 'POST',
        url: '/auth/register',
        payload: {
            email: 'newuser@example.com',
            username: 'newuser',
            password: 'newpassword123',
            first_name: 'New',
            last_name: 'User',
        }
    })

    assert.strictEqual(res.statusCode, 201)
    const user = await app.prisma.user.findUnique({
        where: {
            email: 'newuser@example.com',
        }
    })
    assert.ok(user, 'User should be created in the database')
    assert.strictEqual(user.email, 'newuser@example.com')
})

test('POST /register - should return error for already used email', async (t) => {
    const app = await build(t)

    await app.prisma.user.create({
        data: {
            email: 'existinguser@example.com',
            username: 'existinguser',
            password: await argon2.hash('password123'),
            first_name: 'Existing',
            last_name: 'User',
        }
    })

    const res = await app.inject({
        method: 'POST',
        url: '/auth/register',
        payload: {
            email: 'existinguser@example.com',
            username: 'newuser',
            password: 'newpassword123',
            first_name: 'New',
            last_name: 'User',
        }
    })

    assert.strictEqual(res.statusCode, 400)
    const responseJson = JSON.parse(res.payload)
    assert.strictEqual(responseJson.message, 'This email is already used.')
})
