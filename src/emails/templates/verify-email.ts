export function verifyEmailTemplate(verificationUrl: string) {
    return `
     <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Verify your email</title>
      </head>

      <body style="
        margin: 0;
        padding: 0;
        background-color: #09090b;
        font-family: Arial, Helvetica, sans-serif;
        color: #ffffff;
      ">
        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="background-color: #09090b; padding: 50px 20px;"
        >
          <tr>
            <td align="center">

              <!-- Container -->
              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                  max-width: 520px;
                  background-color: #111113;
                  border: 1px solid #27272a;
                  border-radius: 16px;
                  overflow: hidden;
                "
              >

                <!-- Header -->
                <tr>
                  <td style="padding: 32px 40px 20px;">
                    <div style="
                      font-size: 24px;
                      font-weight: 700;
                      letter-spacing: -0.5px;
                      color: #ffffff;
                    ">
                      YourApp<span style="color: #8b5cf6;">.</span>
                    </div>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 20px 40px 40px;">

                    <div style="
                      width: 48px;
                      height: 48px;
                      line-height: 48px;
                      text-align: center;
                      background-color: #1e1633;
                      border-radius: 12px;
                      font-size: 22px;
                      margin-bottom: 24px;
                    ">
                      ✉
                    </div>

                    <h1 style="
                      margin: 0 0 14px;
                      font-size: 28px;
                      line-height: 36px;
                      color: #ffffff;
                      letter-spacing: -0.7px;
                    ">
                      Verify your email
                    </h1>

                    <p style="
                      margin: 0 0 28px;
                      font-size: 15px;
                      line-height: 24px;
                      color: #a1a1aa;
                    ">
                      Thanks for signing up. Please verify your email
                      address to activate your account and continue.
                    </p>

                    <!-- Button -->
                    <table
                      cellpadding="0"
                      cellspacing="0"
                      border="0"
                      style="margin-bottom: 28px;"
                    >
                      <tr>
                        <td
                          align="center"
                          style="
                            border-radius: 10px;
                            background-color: #8b5cf6;
                          "
                        >
                          <a
                            href="${verificationUrl}"
                            target="_blank"
                            style="
                              display: inline-block;
                              padding: 14px 24px;
                              font-size: 14px;
                              font-weight: 700;
                              color: #ffffff;
                              text-decoration: none;
                              border-radius: 10px;
                            "
                          >
                            Verify email →
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p style="
                      margin: 0 0 8px;
                      font-size: 13px;
                      line-height: 20px;
                      color: #71717a;
                    ">
                      If the button doesn't work, copy and paste this link
                      into your browser:
                    </p>

                    <p style="
                      margin: 0;
                      font-size: 12px;
                      line-height: 20px;
                      word-break: break-all;
                    ">
                      <a
                        href="${verificationUrl}"
                        style="
                          color: #a78bfa;
                          text-decoration: none;
                        "
                      >
                        ${verificationUrl}
                      </a>
                    </p>

                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="
                    padding: 20px 40px;
                    border-top: 1px solid #27272a;
                  ">
                    <p style="
                      margin: 0;
                      font-size: 12px;
                      line-height: 18px;
                      color: #52525b;
                      text-align: center;
                    ">
                      If you didn't create an account, you can safely ignore
                      this email.
                    </p>
                  </td>
                </tr>

              </table>

              <!-- Bottom -->
              <p style="
                margin: 20px 0 0;
                font-size: 11px;
                color: #52525b;
                text-align: center;
              ">
                © 2026 YourApp. All rights reserved.
              </p>

            </td>
          </tr>
        </table>
      </body>
    </html>
    `
}