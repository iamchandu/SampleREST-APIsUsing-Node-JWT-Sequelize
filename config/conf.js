const crypto = require('crypto').randomBytes(256).toString('hex'); 

// Export config object
module.exports = {
  secret: crypto,
}