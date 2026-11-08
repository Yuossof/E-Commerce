import { Resend } from "resend";
import config from "../../config/env";

export const resend = new Resend(config.resendApiKey);
