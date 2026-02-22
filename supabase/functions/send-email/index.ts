console.log("Email Function: Service started");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { type, email, name, ...details } = await req.json()
    console.log(`Processing email type: ${type} for: ${email}`);

    let subject = ''
    let html = ''

    switch (type) {
      case 'NAT_SUBMISSION':
        subject = 'NAT Application Received'
        html = `
          <h2>Application Received</h2>
          <p>Dear ${name},</p>
          <p>Your application for the NORSU Admission Test has been received.</p>
          <p><strong>Test Date:</strong> ${details.testDate}</p>
          <p><strong>Venue:</strong> NORSU Main Campus</p>
          <hr />
          <h3>Your Portal Credentials</h3>
          <p><strong>Username:</strong> ${details.username}</p>
          <p><strong>Password:</strong> ${details.password}</p>
          <p>Please save these credentials to login to the portal.</p>
        `
        break;
      case 'NAT_RESULT':
        subject = `NAT Result Update: ${details.status}`
        html = `
          <h2>NAT Result Update</h2>
          <p>Dear ${name},</p>
          <p>Your admission test status has been updated to: <strong>${details.status}</strong>.</p>
          <p>Please login to the NAT Portal to view more details.</p>
        `
        break;
      case 'STUDENT_ACTIVATION':
        subject = 'Student Account Activated - Login Instructions';
        html = `
          <h2>Welcome to NORSU Student Portal</h2>
          <p>Dear ${name},</p>
          <p>Your student account has been successfully activated.</p>
          <p>You can now access the Student Portal to view your grades, schedule, and profile.</p>
          <hr />
          <h3>Your Login Credentials</h3>
          <p><strong>Login Email:</strong> ${email}</p>
          <p><strong>Temporary Password:</strong> ${details.password}</p>
          <p><strong>Student ID (Reference):</strong> ${details.studentId}</p>
          <br />
          <p><a href="http://localhost:5173/student/login">Login to Student Portal</a></p>
        `;
        break;
    }

    if (subject && html && email) {
      const GMAIL_USER = Deno.env.get('GMAIL_USER')
      const GMAIL_APP_PASSWORD = Deno.env.get('GMAIL_APP_PASSWORD')

      if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
        console.error("Missing Secrets: GMAIL_USER or GMAIL_APP_PASSWORD");
        throw new Error("Server misconfiguration: Missing email credentials.");
      }

      // Use Gmail SMTP directly with fetch
      const emailBody = [
        `From: "NORSU Admission" <${GMAIL_USER}>`,
        `To: ${email}`,
        `Subject: ${subject}`,
        `MIME-Version: 1.0`,
        `Content-Type: text/html; charset=utf-8`,
        '',
        html
      ].join('\r\n');

      // Send via Gmail SMTP API
      const response = await fetch('https://www.googleapis.com/gmail/v1/users/me/messages/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GMAIL_APP_PASSWORD}`, // This won't work with app password
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          raw: btoa(emailBody)
        })
      });

      // Alternative: Use a service like Resend, SendGrid, or Postmark
      // For now, let's use a simpler SMTP approach with deno-smtp

      const { SMTPClient } = await import("https://deno.land/x/denomailer@1.6.0/mod.ts");

      const client = new SMTPClient({
        connection: {
          hostname: "smtp.gmail.com",
          port: 465,
          tls: true,
          auth: {
            username: GMAIL_USER,
            password: GMAIL_APP_PASSWORD,
          },
        },
      });

      await client.send({
        from: `NORSU Admission <${GMAIL_USER}>`,
        to: email,
        subject: subject,
        content: html,
        html: html,
      });

      await client.close();

      return new Response(
        JSON.stringify({ success: true, message: 'Email sent successfully' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    return new Response(
      JSON.stringify({ message: 'No action taken' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  } catch (error) {
    console.error("Handler Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
