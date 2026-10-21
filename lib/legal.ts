// Version of the privacy policy a candidate accepts when applying. Hiro stores
// it with the application, so bump it whenever app/privacy/page.tsx changes.
// TODO(gilad): the privacy page still says "עודכן לאחרונה: [תאריך להשלמה]";
// set the real publication date there and here.
export const PRIVACY_POLICY_VERSION = process.env.PRIVACY_POLICY_VERSION ?? 'unversioned'
export const PRIVACY_POLICY_URL = 'https://hiro.co.il/privacy'
