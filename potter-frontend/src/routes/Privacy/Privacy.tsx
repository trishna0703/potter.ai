const Privacy = () => {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12 md:py-16">
      <div className="mb-12">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-[#789078]">
          Legal
        </p>

        <h1 className="text-4xl font-semibold tracking-tight text-[#263626] md:text-5xl">
          Privacy Policy
        </h1>

        <p className="mt-4 text-sm text-[#788178]">
          Last updated: September 13, 2026
        </p>
      </div>

      <div className="space-y-10 text-[16px] leading-8 text-[#4d584d]">
        <section>
          <p>
            Potter.ai ("Potter", "we", "us", or "our") is a plant-care
            application that helps you keep track of your plants, record care
            activities, document plant health concerns, and use AI-powered
            features to identify plants and provide plant-care information.
          </p>

          <p className="mt-4">
            This Privacy Policy explains what information we collect, how we use
            it, where it is stored, and the choices you have regarding your
            information.
          </p>
        </section>

        <PolicySection title="1. Information We Collect">
          <PolicySubsection title="Information you provide through Google Sign-In">
            <p>
              When you sign in to Potter.ai using Google, we receive information
              provided by Google that is necessary to create and manage your
              Potter.ai account. This may include:
            </p>

            <PolicyList
              items={[
                "Your name",
                "Your email address",
                "Your Google account identifier",
                "Your profile picture, where provided",
              ]}
            />

            <p className="mt-4">
              We use this information to authenticate you, create your Potter.ai
              account, maintain your session, and associate your plants and
              other application data with your account.
            </p>

            <p className="mt-4">
              We do not use Google account information for advertising or sell
              it to third parties.
            </p>
          </PolicySubsection>

          <PolicySubsection title="Plant and application information">
            <p>When you use Potter.ai, you may provide information such as:</p>

            <PolicyList
              items={[
                "Plant names and species",
                "Plant photographs",
                "Plant location information such as indoor/outdoor status",
                "Plant measurements and other plant details",
                "Shelves or collections you create",
                "Watering, fertilizing, repotting, and other care events",
                "Plant health concerns and observations",
                "Information you provide when asking Potter.ai to assess a plant concern",
              ]}
            />
          </PolicySubsection>

          <PolicySubsection title="Photos and uploaded files">
            <p>
              When you upload a plant photograph, we store the photograph so
              that Potter.ai can provide features such as plant identification,
              health assessment, and plant-history tracking.
            </p>
          </PolicySubsection>

          <PolicySubsection title="Technical information">
            <p>
              We may collect limited technical information needed to operate,
              secure, and troubleshoot the service, such as:
            </p>

            <PolicyList
              items={[
                "IP address",
                "Browser and device information",
                "Request and error information",
                "Authentication and session information",
              ]}
            />
          </PolicySubsection>
        </PolicySection>

        <PolicySection title="2. How We Use Your Information">
          <p>We use your information to:</p>

          <PolicyList
            items={[
              "Provide and operate Potter.ai",
              "Authenticate your account",
              "Store and manage your plants and care history",
              "Store and display plant photographs",
              "Identify plants and analyze plant-health concerns",
              "Generate plant-care recommendations",
              "Maintain and improve the reliability and security of the application",
              "Diagnose technical problems and prevent abuse",
              "Communicate with you about the service when necessary",
            ]}
          />
        </PolicySection>

        <PolicySection title="3. AI Features">
          <p>
            Potter.ai uses AI-based functionality to help identify plants and
            analyze plant-health concerns.
          </p>

          <p className="mt-4">
            When you use an AI feature, information you provide to that feature,
            such as plant photographs, plant details, and descriptions of a
            plant concern, may be processed by the AI systems used to provide
            that feature.
          </p>

          <p className="mt-4">
            We will not use your personal information or Google account
            information to train or improve general-purpose AI models unless we
            separately disclose that use and obtain any consent required by
            applicable law or the relevant service policies.
          </p>
        </PolicySection>

        <PolicySection title="4. How We Share Your Information">
          <p>We do not sell your personal information.</p>

          <p className="mt-4">
            We may share or transfer information to service providers that help
            us operate Potter.ai, including providers for:
          </p>

          <PolicyList
            items={[
              "Cloud infrastructure and data storage",
              "Authentication",
              "AI processing",
              "Application hosting and security",
            ]}
          />

          <p className="mt-4">
            These providers receive only the information necessary to provide
            their services to Potter.ai.
          </p>

          <p className="mt-4">
            We may also disclose information when required by law, legal
            process, or to protect the rights, security, and integrity of
            Potter.ai and its users.
          </p>
        </PolicySection>

        <PolicySection title="5. Data Storage and Security">
          <p>
            Potter.ai uses technical and organizational measures intended to
            protect your information against unauthorized access, alteration,
            disclosure, or destruction.
          </p>

          <p className="mt-4">
            Information is transmitted using HTTPS/TLS where supported.
          </p>

          <p className="mt-4">
            However, no method of transmitting or storing information can be
            guaranteed to be completely secure.
          </p>
        </PolicySection>

        <PolicySection title="6. Data Retention">
          <p>
            We retain your account and application data for as long as necessary
            to provide Potter.ai and maintain your account, unless you request
            deletion or a longer retention period is required by law.
          </p>

          <p className="mt-4">
            We may retain limited information where necessary for security,
            fraud prevention, dispute resolution, or legal compliance.
          </p>
        </PolicySection>

        <PolicySection title="7. Your Choices and Rights">
          <p>
            Depending on applicable law, you may have rights regarding your
            personal information, including the ability to:
          </p>

          <PolicyList
            items={[
              "Request access to information associated with your account",
              "Request correction of inaccurate information",
              "Request deletion of your account and associated personal information",
              "Withdraw consent where processing is based on consent",
              "Ask questions about how your information is processed",
            ]}
          />

          <p className="mt-4">
            To make a privacy request, contact us using the email address below.
            We may take reasonable steps to verify your identity before
            fulfilling requests involving your personal information.
          </p>
        </PolicySection>

        <PolicySection title="8. Account and Data Deletion">
          <p>
            You may contact us to request deletion of your Potter.ai account and
            associated personal information.
          </p>

          <p className="mt-4">
            When we receive a valid deletion request, we will delete or
            anonymize the applicable information unless we are required to
            retain certain information for legal, security, or legitimate
            operational purposes.
          </p>

          <p className="mt-4">
            <strong className="font-semibold text-[#354435]">Contact:</strong>{" "}
            trishna0703@gmail.com
          </p>
        </PolicySection>

        <PolicySection title="9. Children's Privacy">
          <p>
            Potter.ai is not intended for children under the age permitted to
            independently consent to the processing of personal data under
            applicable law.
          </p>

          <p className="mt-4">
            We do not knowingly collect personal information from children in
            violation of applicable law.
          </p>
        </PolicySection>

        <PolicySection title="10. Third-Party Services">
          <p>
            Potter.ai may rely on third-party services to provide functionality
            such as authentication, cloud storage, hosting, and AI processing.
          </p>

          <p className="mt-4">
            Those services may process information on our behalf and are subject
            to their own terms and privacy policies.
          </p>

          <p className="mt-4">
            Google's processing of information through Google Sign-In is also
            subject to Google's applicable policies and privacy practices.
          </p>
        </PolicySection>

        <PolicySection title="11. Changes to This Privacy Policy">
          <p>
            We may update this Privacy Policy as Potter.ai evolves or as legal
            or regulatory requirements change.
          </p>

          <p className="mt-4">
            When we make changes, we will update the "Last updated" date at the
            top of this page.
          </p>
        </PolicySection>

        <PolicySection title="12. Contact Us">
          <p>
            If you have questions about this Privacy Policy, your personal
            information, or a data-deletion request, contact:
          </p>

          <div className="mt-5 rounded-2xl border border-[#e5e2da] bg-white px-6 py-5">
            <p className="font-semibold text-[#354435]">Potter.ai</p>
            <p className="mt-1">trishna0703@gmail.com</p>
            <p className="mt-1">https://potterai.in</p>
          </div>
        </PolicySection>
      </div>
    </main>
  );
};

const PolicySection = ({
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

const PolicySubsection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="mt-6">
      <h3 className="mb-2 text-lg font-semibold text-[#445344]">{title}</h3>
      {children}
    </div>
  );
};

const PolicyList = ({ items }: { items: string[] }) => {
  return (
    <ul className="mt-3 list-disc space-y-2 pl-6">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
};

export default Privacy;
