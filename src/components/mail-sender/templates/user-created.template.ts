import { FRONT_HOST } from '@config';

import { AbstractTemplate, MailTemplate } from './abstract.template';

export class UserEmailConfirmTemplate extends AbstractTemplate {
  public generate(replacements: Record<string, string>): MailTemplate {
    const html = this.populateTemplate(replacements);
    const subject = this.getSubject();

    return { subject, html };
  }

  private getSubject() {
    return 'New user registered';
  }

  private populateTemplate(replacements: Record<string, string>) {
    return `<h1>New user registered: ${FRONT_HOST}/confirm?email=${replacements.email}&token=${replacements.token}</h1>`;
  }
}
