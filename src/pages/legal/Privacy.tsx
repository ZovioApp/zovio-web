import { LegalPage } from './Terms';

export default function Privacy() {
  return (
    <LegalPage title="Privacy Policy" updated="17 August 2026">
      <h2>1. What we collect</h2>
      <p>
        <strong>Account data:</strong> name, email address, password (stored
        as a salted hash), avatar colour, and country. Signing in with Google
        or Apple shares your name and email from that provider.
        <br />
        <strong>Activity data:</strong> organisation memberships, session
        enrolments, attendance, event registrations, and support tickets.
        <br />
        <strong>Payment data:</strong> card details are collected and stored
        by Stripe, our payment processor — Zovio never sees or stores full
        card numbers. We keep records of charges, refunds, and payout
        configuration.
        <br />
        <strong>Device data:</strong> a push-notification token if you
        enable notifications.
      </p>

      <h2>2. How we use it</h2>
      <p>
        To run the service: scheduling, attendance, charging fees you have
        authorised, sending transactional email (verification, receipts,
        session reminders) and push notifications, and providing support. We
        do not sell personal data or use it for third-party advertising.
      </p>

      <h2>3. Who we share it with</h2>
      <p>
        Organisations you join can see your name, email, attendance, and
        payment status for their sessions and events. Service providers we
        rely on: Stripe (payments), Amazon Web Services (hosting and email
        delivery), and Expo (push notifications). Each processes data only
        to provide their service to us.
      </p>

      <h2>4. Retention and deletion</h2>
      <p>
        You can delete your account in the mobile app (Profile &rarr; Delete
        Account). Deletion anonymises your personal data immediately — name,
        email, and sign-in credentials are scrubbed and your device token is
        removed. Financial records (charges and refunds) are retained in
        anonymised form as required for accounting and dispute handling.
      </p>

      <h2>5. Security</h2>
      <p>
        Data is encrypted in transit, passwords are hashed, and card data
        never touches our servers. No system is perfectly secure; if a
        breach affects your data we will notify you as required by law.
      </p>

      <h2>6. Your rights</h2>
      <p>
        You can access and correct your profile in the app, and delete your
        account at any time. For access, correction, or deletion requests we
        cannot satisfy in-app, contact us and we will respond within a
        reasonable period.
      </p>

      <h2>7. Children</h2>
      <p>
        Athlete accounts are intended for users aged 13 and over. Athletes
        under the age of majority should join organisations with the consent
        of a parent or guardian.
      </p>

      <h2>8. Contact</h2>
      <p>
        Privacy questions: <strong>support@zovio.app</strong>.
      </p>
    </LegalPage>
  );
}
