import { Client as WorkFlowClient } from '@upstash/workflow';
import { Client as QStashClient, resend } from "@upstash/qstash";
import config from './config';

export const workFlowClient = new WorkFlowClient({
    baseUrl: config.env.upstash.qstashUrl,
    token: config.env.upstash.qstashToken,
});


const qstashclient = new QStashClient({ token: config.env.upstash.qstashToken });

export const sendEmail = async ({ email, subject, message }: { email: string, subject: string, message: string }) => {
    await qstashclient.publishJSON({
        api: {
            name: "email",
            provider: resend({ token: config.env.resendToken }),
        },
        body: {
            from: "<onboarding@resend.dev>",
            to: [email],
            subject,
            html: message,
        },
    });
}

