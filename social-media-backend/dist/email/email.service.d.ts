export declare class EmailService {
    private readonly logger;
    private readonly resend;
    constructor();
    sendPasswordResetCode(email: string, code: string): Promise<boolean>;
    private getPasswordResetEmailTemplate;
}
