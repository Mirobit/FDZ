const crypto = require('crypto')

// TODO: make class
const algorithm = 'aes-256-cbc'
const iv = process.env.SALT_SCERET

const generateKey = password => {
  return hash(password).substr(0, 32)
}

const hash = text => {
  return crypto
    .createHash('sha256')
    .update(text)
    .digest('hex')
}

const encrypt = (text, password) => {
  const key = generateKey(password)
  console.log('crypter2', key)
  const cipher = crypto.createCipheriv(algorithm, key, iv)
  let encrypted = cipher.update(text)
  encrypted = Buffer.concat([encrypted, cipher.final()])

  return encrypted.toString('hex')
}

const decrypt = (encryptedText, password) => {
  const key = generateKey(password)
  const decipher = crypto.createDecipheriv(algorithm, key, iv)
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}

module.exports = { hash, encrypt, decrypt }
