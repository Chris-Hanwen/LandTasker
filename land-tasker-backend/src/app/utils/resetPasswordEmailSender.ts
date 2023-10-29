import AWS from 'aws-sdk';

const resetPasswordEmail = (email: string, fullName: string, token: string) => {
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
        Data: 'Land Task - Password Reset',
      },
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data:
            '<p>Here is your password reset request.</p>' +
            `<p>Hi ${fullName}.</p>
            <p>Please verify your email address by clicking on the link below to complete your request.</p>
          <a href = 'http://landtasker.link/setNewPassword/${token}'>Verify your email address</a>
          <p>If you have any question, please contact us on admin@landtasker.com</p>
          <p>Land Tasker Team</p>`,
        },
      },
    },
  };

  return new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise();
};
export { resetPasswordEmail };
