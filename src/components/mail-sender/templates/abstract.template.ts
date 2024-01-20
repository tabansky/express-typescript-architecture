export type MailTemplate = { subject: string, html: string };

export abstract class AbstractTemplate {
  public abstract generate(replacements: Record<string, string>): MailTemplate;
}
