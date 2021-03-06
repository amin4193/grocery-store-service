const supertest = require('supertest')
const config = require('../src/configs')
const server = require('../src/app')
const create_user_body = require('./body_samples/create.users.json')
const login_admin_body = require('./body_samples/login.admin.json')

jest.setTimeout(60000)
// jest.mock('../__mocks__/users.js')

const {
  SERVER_PROTOCOL,
  SERVER_HOST,
  SERVER_PORT,
  DB_HOST,
  DB_PORT
} = config.default.env
const url = `${SERVER_PROTOCOL}://${SERVER_HOST}:${SERVER_PORT}/api/v1/admin`

// ---------------------------------- MongoDB ----------------------------------------
// const mongoose = require('mongoose')
// const mongoDB = {
//   mongoose,
//   connect: function() {
//     mongoose.Promise = Promise
//     mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/testDB`, { useNewUrlParser: true })
//   },
//   disconnect: function(done) { mongoose.disconnect(done) },
// }

let userId = '', token = ''
const request = supertest(url)

describe('User Worker', function() {
  // beforeAll(function() { mongoDB.connect() })
  // afterAll(function(done) { mongoDB.disconnect(done) })

  // Admin Login
  test('should login to admin account', async function(done) {
    const res = await request.post('/login').send(login_admin_body)
    token = res.headers['authorization']
    const response = JSON.parse(res.text)
    expect(response.statusCode).toBe(200)
    expect(response.success).toBe(true)
    expect(response.result).toBeTruthy()
    expect(response.result).toMatchSnapshot()
    done()
  })

  // Create Users
  test('should create a user', async function(done) {
    const res = await request.post('/users').send(create_user_body).set('authorization', token)
    const response = JSON.parse(res.text)
    userId = response.result._id
    expect(response.statusCode).toBe(200)
    expect(response.success).toBe(true)
    expect(response.result).toBeTruthy()
    expect(response.result).toMatchSnapshot()
    done()
  })

  // List of Users
  test('should get list of users', async function(done) {
    const res = await request.get('/users').set('authorization', token)
    const response = JSON.parse(res.text)
    expect(response.statusCode).toBe(200)
    expect(response.success).toBe(true)
    expect(response.result).toBeTruthy()
    expect(response.result).toMatchSnapshot()
    done()
  })

  // User Details
  test('should get user details', async function(done) {
    const res = await request.get('/users/' + userId).set('authorization', token)
    const response = JSON.parse(res.text)
    expect(response.statusCode).toBe(200)
    expect(response.success).toBe(true)
    expect(response.result).toBeTruthy()
    expect(response.result).toMatchSnapshot()
    done()
  })

  // Update User
  const updateData = { fullName: 'Changed Name' } // Some data to update
  test('should get user details', async function(done) {
    const res = await request.put('/users/' + userId).send(updateData).set('authorization', token)
    const response = JSON.parse(res.text)
    expect(response.statusCode).toBe(200)
    expect(response.success).toBe(true)
    expect(response.result).toBeTruthy()
    expect(response.result.fullName).toBe(updateData.fullName)
    expect(response.result).toMatchSnapshot()
    done()
  })

  // Delete a User
  test('should delete a user', async function(done) {
    const res = await request.del('/users/' + userId).set('authorization', token)
    const response = JSON.parse(res.text)
    expect(response.statusCode).toBe(200)
    expect(response.success).toBe(true)
    expect(response.result).toBeTruthy()
    expect(response.result).toMatchSnapshot()
    done()
  })

  // Admin Logout
  test('should logout from admin account', async function(done) {
    const res = await request.get('/logout').set('authorization', token)
    const response = JSON.parse(res.text)
    expect(response.statusCode).toBe(200)
    expect(response.success).toBe(true)
    expect(response.result).toBeTruthy()
    expect(response.result).toMatchSnapshot()
    done()
  })

})
