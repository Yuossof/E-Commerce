export interface ISendEmailParams {
    to: string[];
    subject: string;
    html: string;
    from?: string
}