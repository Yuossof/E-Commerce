import { BaseError } from "../../../common/errors/base.error";
import { verifyEmailTemplate } from "../../../emails/templates/verify-email";
import { sendMail } from "../../../lib/email/email";

export class EmailService {
    async sendVerificationEmail(email: string, verificationLink: string) {
        const { error } = await sendMail({
            to: [email],
            subject: "hello",
            from: "onboarding@resend.dev",
            html: verifyEmailTemplate(verificationLink)
        })

        if (error) {
            throw new BaseError(
                error.name,
                error.statusCode as number,
                true,
                error.message
            )
        }
    }

}