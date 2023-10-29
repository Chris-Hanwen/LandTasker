import AWS from 'aws-sdk';

const emailSender = (email: string, activationCode: string) => {
  // Set the region
  AWS.config.update({
    region: process.env.REGION,
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  });

  const params = {
    Destination: {
      ToAddresses: [email],
    },
    Source: 'landtaskerdevlop@gmail.com',
    Message: {
      Subject: {
        Charset: 'UTF-8',
        Data: 'Land Task - Email Verification',
      },
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data:
            '<p>Thanks for registering your Land Tasker account.</p>' +
            `<p>Please verify your email address by clicking on the link below to complete your registration.</p>
          <a href = 'http://landtasker.link/activateUser/${activationCode}'>Verify your email address</a>
          <p>If you have any question, please contact us on admin@landtasker.com</p>
          <p>Land Tasker Team</p>`,
        },
      },
    },
  };

  return new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise();
};
export { emailSender };
