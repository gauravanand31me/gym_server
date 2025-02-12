const twilio = require('twilio');

const accountSid = '<<AACC_SID>>';
const authToken = '<<ACC_SDDIS>>';
const client = new twilio(accountSid, authToken);

exports.sendSMS = (to, body) => {
  client.messages.create({
    body,
    to,
    from: '+19033267775'
  }).then(message => console.log(message.sid))
    .catch(error => console.error(error));
};
