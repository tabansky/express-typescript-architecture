import { MAILER_HOST } from '@config';
import { SentMessageInfo } from 'nodemailer';
import { ConfirmationTokenActions } from 'src/constants/enums/confirmation-tokens.enum';
import { mailer } from 'src/tools/mailer';

import { AbstractTemplate, MailTemplate } from './templates/abstract.template';
import { UserEmailConfirmTemplate } from './templates/user-created.template';

const templates: Record<ConfirmationTokenActions, AbstractTemplate> = {
  [ConfirmationTokenActions.CONFIRM_EMAIL]: new UserEmailConfirmTemplate(),
  [ConfirmationTokenActions.RESET_PASSWORD]: new UserEmailConfirmTemplate(),
};

export class MailSender {
  public static getTemplate(template: string, replacements: Record<string, string>): MailTemplate {
    return templates[template].generate(replacements);
  }

  public static send(
    email: string,
    template: keyof typeof templates,
    replacements: Record<string, string>,
  ): Promise<SentMessageInfo> {
    const { subject, html } = this.getTemplate(template, replacements);

    return mailer.sendMail({
      from: MAILER_HOST,
      to: email,
      subject,
      html,
    });
  }
}
