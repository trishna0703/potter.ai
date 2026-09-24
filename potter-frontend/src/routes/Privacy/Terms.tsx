

const Terms = () => {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12 md:py-16">
      <div className="mb-12">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-[#789078]">
          Legal
        </p>

        <h1 className="text-4xl font-semibold tracking-tight text-[#263626] md:text-5xl">
          Terms of Service
        </h1>

        <p className="mt-4 text-sm text-[#788178]">
          Last updated: September 13, 2026
        </p>
      </div>

      <div className="space-y-10 text-[16px] leading-8 text-[#4d584d]">
        <TermsSection title="1. Acceptance of These Terms">
          <p>
            By creating an account, accessing, or using Potter.ai
            (&quot;Potter&quot;, &quot;we&quot;, &quot;us&quot;, or
            &quot;our&quot;), you agree to these Terms of Service
            (&quot;Terms&quot;).
          </p>

          <p className="mt-4">
            If you do not agree with these Terms, you should not use Potter.ai.
          </p>
        </TermsSection>

        <TermsSection title="2. About Potter.ai">
          <p>
            Potter.ai is a plant-care application designed to help you organize
            your plants, record plant-care activities, document plant-health
            concerns, identify plants, and receive AI-powered plant-care
            information and recommendations.
          </p>

          <p className="mt-4">
            Features may change, be added, or be removed as Potter.ai develops.
          </p>
        </TermsSection>

        <TermsSection title="3. Your Account">
          <p>
            You may create an account using the authentication methods made
            available by Potter.ai, including Google Sign-In.
          </p>

          <p className="mt-4">
            You are responsible for maintaining the security of your account and
            for activity performed through your account.
          </p>

          <p className="mt-4">
            You agree to provide accurate information and not to impersonate
            another person or create an account using information that you do
            not have the right to use.
          </p>
        </TermsSection>

        <TermsSection title="4. Acceptable Use">
          <p>You agree not to:</p>

          <TermsList
            items={[
              "Use Potter.ai for unlawful, fraudulent, or abusive purposes",
              "Attempt to gain unauthorized access to Potter.ai, its infrastructure, or another user's account",
              "Interfere with or disrupt the operation or security of the service",
              "Upload malicious software, harmful code, or files intended to compromise the service",
              "Scrape, copy, or systematically extract Potter.ai content or data without permission",
              "Reverse engineer or attempt to circumvent technical restrictions of the service except where permitted by applicable law",
              "Use Potter.ai in a way that violates the rights of another person or organization",
            ]}
          />
        </TermsSection>

        <TermsSection title="5. Your Content">
          <p>
            You may upload or provide content through Potter.ai, including plant
            photographs, plant information, care records, descriptions, and
            observations (&quot;User Content&quot;).
          </p>

          <p className="mt-4">
            You retain ownership of the User Content you submit to Potter.ai.
          </p>

          <p className="mt-4">
            By submitting User Content, you grant Potter.ai a limited,
            non-exclusive right to store, process, display, and analyze that
            content as reasonably necessary to provide and operate the service.
          </p>

          <p className="mt-4">
            You are responsible for ensuring that you have the necessary rights
            to upload and use any content you submit.
          </p>
        </TermsSection>

        <TermsSection title="6. AI-Generated Information">
          <p>
            Potter.ai uses artificial intelligence to provide features such as
            plant identification, plant-health assessment, and plant-care
            recommendations.
          </p>

          <p className="mt-4">
            AI-generated information may be incomplete, inaccurate, outdated, or
            incorrect. Plant identification and health assessments are not
            guaranteed to be accurate.
          </p>

          <p className="mt-4">
            Information provided by Potter.ai should not be treated as a
            substitute for professional horticultural, agricultural, veterinary,
            medical, or other expert advice.
          </p>

          <p className="mt-4">
            You are responsible for deciding whether and how to act on
            recommendations provided by Potter.ai.
          </p>
        </TermsSection>

        <TermsSection title="7. Third-Party Services">
          <p>
            Potter.ai may use third-party services for functionality such as
            authentication, cloud storage, hosting, analytics, security, and AI
            processing.
          </p>

          <p className="mt-4">
            Your use of third-party services may also be subject to their
            respective terms and policies.
          </p>

          <p className="mt-4">
            Potter.ai is not responsible for the availability, accuracy, or
            actions of third-party services that are outside our control.
          </p>
        </TermsSection>

        <TermsSection title="8. Intellectual Property">
          <p>
            Potter.ai and its associated software, design, branding, logos,
            interfaces, and original content are owned by Potter.ai or its
            licensors and are protected by applicable intellectual property
            laws.
          </p>

          <p className="mt-4">
            These Terms do not grant you ownership of Potter.ai or its
            underlying technology.
          </p>
        </TermsSection>

        <TermsSection title="9. Service Availability">
          <p>
            We work to keep Potter.ai available and reliable, but we do not
            guarantee that the service will always be available, uninterrupted,
            secure, or error-free.
          </p>

          <p className="mt-4">
            Potter.ai may occasionally be unavailable because of maintenance,
            updates, infrastructure issues, security incidents, or circumstances
            outside our reasonable control.
          </p>
        </TermsSection>

        <TermsSection title="10. Disclaimer of Warranties">
          <p>
            To the maximum extent permitted by applicable law, Potter.ai is
            provided &quot;as is&quot; and &quot;as available&quot; without
            warranties of any kind, whether express or implied.
          </p>

          <p className="mt-4">
            We do not guarantee the accuracy, reliability, completeness, or
            suitability of information provided through Potter.ai.
          </p>
        </TermsSection>

        <TermsSection title="11. Limitation of Liability">
          <p>
            To the maximum extent permitted by applicable law, Potter.ai and its
            operators will not be liable for indirect, incidental, special,
            consequential, or similar damages arising from your use of or
            inability to use the service.
          </p>

          <p className="mt-4">
            Nothing in these Terms excludes or limits liability that cannot
            legally be excluded or limited under applicable law.
          </p>
        </TermsSection>

        <TermsSection title="12. Suspension and Termination">
          <p>You may stop using Potter.ai at any time.</p>

          <p className="mt-4">
            We may suspend or terminate access to Potter.ai where reasonably
            necessary to address violations of these Terms, security risks,
            misuse of the service, or other circumstances that make continued
            access inappropriate.
          </p>

          <p className="mt-4">
            Provisions that by their nature should survive termination may
            continue to apply after your use of the service ends.
          </p>
        </TermsSection>

        <TermsSection title="13. Changes to These Terms">
          <p>
            We may update these Terms from time to time as Potter.ai evolves or
            as legal or regulatory requirements change.
          </p>

          <p className="mt-4">
            When we make material changes, we will update the &quot;Last
            updated&quot; date at the top of this page.
          </p>

          <p className="mt-4">
            Your continued use of Potter.ai after updated Terms become effective
            constitutes acceptance of the updated Terms, to the extent permitted
            by applicable law.
          </p>
        </TermsSection>

        <TermsSection title="14. Governing Law">
          <p>
            These Terms will be governed by and interpreted in accordance with
            the laws applicable to Potter.ai, without regard to conflict-of-law
            principles.
          </p>

          <p className="mt-4">
            Any specific jurisdiction or dispute-resolution provisions will be
            determined in accordance with applicable law.
          </p>
        </TermsSection>

        <TermsSection title="15. Contact Us">
          <p>If you have questions about these Terms, please contact us at:</p>

          <div className="mt-5 rounded-2xl border border-[#e5e2da] bg-white px-6 py-5">
            <p className="font-semibold text-[#354435]">Potter.ai</p>
            <p className="mt-1">trishna0703@gmail.com</p>
            <p className="mt-1">https://potterai.in</p>
          </div>
        </TermsSection>
      </div>
    </main>
  );
};

const TermsSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <section>
      <h2 className="mb-4 text-2xl font-semibold tracking-tight text-[#354435]">
        {title}
      </h2>

      {children}
    </section>
  );
};

const TermsList = ({ items }: { items: string[] }) => {
  return (
    <ul className="mt-3 list-disc space-y-2 pl-6">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
};

export default Terms;
