import Logger from '../helpers/logger';

const nodemailer = require('nodemailer');

export interface EmailOptions {
    host: string;
    port: number;
    userName: string;
    password: string;
}

export class EmailService {
    private _transporter: any;
    private logger: Logger;

    constructor(logger: Logger, emailOptions: EmailOptions) {
        this.logger = logger;
        const options: any = {
            secure: false,
            host: emailOptions.host,
            port: emailOptions.port,
            auth: {
                user: emailOptions.userName,
                pass: emailOptions.password,
            },
        };

        this._transporter = nodemailer.createTransport(options);
    }

    public async sendEmail(sender: string, recipientEmail: string, subject: string, messageBody: any, attachments?: any[]) {
        // setup e-mail data with unicode symbols
        const mailOptions = {
            from: sender, // sender address
            to: recipientEmail, // list of receivers
            subject: subject, // Subject line
            html: messageBody,
            attachments,
        };
        // send mail with defined transport object
        this.logger.info(`sending email ${JSON.stringify(mailOptions)}`);
        try {
            await this._transporter.sendMail(mailOptions);
            this.logger.debug(`Email sent successfully`);
        } catch (e: any) {
            this.logger.error(`Failed to send email, description: ${e.message}`);
            throw new Error('Failed to send email');
        }
    }

    async isConnected(): Promise<boolean> {
        try {
            await this._transporter.verify();
            return true;
        } catch (e) {
            return false;
        }
    }

    async verifyConnection() {
        try {
            await this._transporter.verify();
        } catch (e: any) {
            this.logger.error(`could not connect to smtp mail server: ${e.message}`);
            throw new Error(`smtp mail server is not connected: ${e.message}`);
        }
    }
}
