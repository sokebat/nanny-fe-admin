export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQCategory {
  category: string;
  items: FAQItem[];
}

export const faqData: FAQCategory[] = [
  {
    category: "General",
    items: [
      {
        question: "What is the NannyPlug?",
        answer:
          "The NannyPlug is a marketplace where families, nannies, and vendors connect, share services, and access resources. We are not an agency—we provide the platform, but all jobs, services, and payments are handled directly between users.",
      },
      {
        question: "How can I post jobs or connect with nannies/families?",
        answer:
          "Create an account, complete your profile, and use our job posting feature to list opportunities. Families can browse caregiver profiles, and caregivers can apply to posted jobs directly through the platform.",
      },
    ],
  },
  {
    category: "Onboarding and Posting Gulliver",
    items: [
      {
        question: "How does Gulliver onboarding work?",
        answer:
          "Gulliver onboarding is our streamlined process to help new caregivers get started quickly. Complete your profile, upload certifications, and verify your identity to start connecting with families.",
      },
      {
        question: "What is required for a caregiver/nanny posting on Gulliver?",
        answer:
          "You'll need to provide basic information, experience details, certifications, availability, and references. A background check is also recommended for increased trust and visibility.",
      },
    ],
  },
  {
    category: "Courses and Training",
    items: [
      {
        question: "What kind of courses does the platform offer?",
        answer:
          "We offer comprehensive courses covering childcare fundamentals, safety, first aid, nutrition, developmental milestones, and professional skills. All courses are designed by industry experts.",
      },
      {
        question: "Are courses free or paid?",
        answer:
          "We offer both free introductory courses and premium paid courses with certifications. Premium courses provide in-depth training and recognized certificates to enhance your professional profile.",
      },
      {
        question: "Do I get a certificate after completing a course?",
        answer:
          "Yes! Upon successful completion of paid courses, you'll receive a digital certificate that you can share on your profile and with potential employers.",
      },
    ],
  },
  {
    category: "Vendors",
    items: [
      {
        question: "What does the vendor do in the NannyPlug?",
        answer:
          "Vendors provide specialized services and products to families and caregivers, such as childcare supplies, educational materials, training programs, and professional services.",
      },
      {
        question: "How do I list my child-related services as a vendor?",
        answer:
          "Register as a vendor, complete your business profile, upload service descriptions and pricing, and start connecting with our community of families and caregivers.",
      },
      {
        question: "How can I connect to a vendor/a connection?",
        answer:
          "Browse our vendor directory, view profiles and services, and use the contact feature to connect directly with vendors that match your needs.",
      },
    ],
  },
  {
    category: "Cancellations and Refunds",
    items: [
      {
        question: "Can I cancel my subscription?",
        answer:
          "Yes, you can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period.",
      },
      {
        question: "How is the refund or cash-back policy?",
        answer:
          "We offer refunds within 14 days of purchase for most services. Course refunds are available within 7 days if less than 25% of content has been accessed. Contact our support team for assistance.",
      },
      {
        question: "What about courses and service/courses?",
        answer:
          "Course purchases are refundable within 7 days with minimal usage. Service subscriptions can be cancelled anytime, with refunds prorated based on unused time.",
      },
      {
        question: "What if I want to work a refund/community?",
        answer:
          "Contact our support team with your request. We'll review your case individually and work to find a fair resolution based on our refund policy.",
      },
    ],
  },
  {
    category: "Job Posting and Responding",
    items: [
      {
        question: "How long does it stay posting after the chat?",
        answer:
          "Job posts remain active for 30 days by default. You can renew, edit, or close them at any time from your dashboard.",
      },
      {
        question: "Can I edit or delete my job posting?",
        answer:
          "Yes, you have full control over your job postings. Edit details anytime or remove postings when positions are filled.",
      },
      {
        question: "Can I see who replied to my posting?",
        answer:
          "Absolutely! You'll receive notifications for all responses and can view applicant profiles, messages, and qualifications in your dashboard.",
      },
    ],
  },
  {
    category: "Secondie and Profile",
    items: [
      {
        question: "How do I sign up?",
        answer:
          "Click 'Get Started,' select your user type (Family, Nanny, or Vendor), and complete the registration form with your email and basic information.",
      },
      {
        question: "Can I edit my profile/secondie?",
        answer:
          "Yes, you can update your profile information, photos, certifications, and preferences anytime from your account settings.",
      },
      {
        question: "How can I upload or update bio?",
        answer:
          "Navigate to your profile settings, find the bio section, and click edit. You can write or update your bio with details about your experience and approach to childcare.",
      },
    ],
  },
  {
    category: "Trust and Safety",
    items: [
      {
        question: "Are background checks required?",
        answer:
          "While not mandatory, we strongly encourage background checks for all caregivers. Verified profiles receive a trust badge and higher visibility to families.",
      },
      {
        question: "How does the NannyPlug validate or trust users?",
        answer:
          "We use identity verification, background checks, reference validation, and community reviews to build trust. Our rating system helps maintain quality standards.",
      },
      {
        question: "What should I do if I feel unsafe/encounter an issue?",
        answer:
          "Report any concerns immediately using our in-platform reporting feature. Our safety team reviews all reports within 24 hours and takes appropriate action.",
      },
    ],
  },
  {
    category: "Requests and Pricing",
    items: [
      {
        question: "How much does the platform cost?",
        answer:
          "We offer free basic accounts with limited features. Premium plans start at $19.99/month with full access to courses, unlimited messaging, and priority support.",
      },
      {
        question: "Do job ads cost money?",
        answer:
          "Basic members can post 2 jobs per month free. Premium members get unlimited job postings with featured placement options.",
      },
      {
        question: "Do the NannyPlug/team charge/rates?",
        answer:
          "We charge subscription fees for platform access but do not take commissions on payments between families and caregivers. All rates are set directly between users.",
      },
    ],
  },
  {
    category: "Legal Engagement",
    items: [
      {
        question: "Does the NannyPlug handle tax or wages for nannies?",
        answer:
          "No, we are a platform only. Families are responsible for employment contracts, wages, taxes, and legal compliance. We provide educational resources to help navigate these requirements.",
      },
      {
        question: "Are there legal templates available?",
        answer:
          "Yes! Premium members have access to contract templates, employment agreements, and other legal documents. These are for guidance only—consult a legal professional for your specific situation.",
      },
    ],
  },
  {
    category: "NI and Employment",
    items: [
      {
        question: "Who manages National Insurance for nannies employed through your platform?",
        answer:
          "The employing family is responsible for managing National Insurance contributions. We provide guidance resources, but families should consult with tax professionals or payroll services.",
      },
      {
        question: "Does the NannyPlug handle or help with contract formation?",
        answer:
          "We provide contract templates and resources to guide you, but we don't create contracts on your behalf. Legal agreements are between families and caregivers.",
      },
    ],
  },
  {
    category: "Technical Help",
    items: [
      {
        question: "What if I'm having trouble logging in/registering/using a feature?",
        answer:
          "Visit our Help Center for step-by-step guides, or contact support at support@nannyplug.com. We respond to all inquiries within 24 hours.",
      },
      {
        question: "Can I change my email/contact info?",
        answer:
          "Yes, you can update your email, phone number, and other contact information in your account settings. Some changes may require email verification.",
      },
      {
        question: "Can I integrate my calendar with the NannyPlug app?",
        answer:
          "Calendar integration is coming soon! You'll be able to sync your availability with Google Calendar and other popular calendar apps.",
      },
    ],
  },
  {
    category: "Location and Availability",
    items: [
      {
        question: "Is the NannyPlug available outside the UK/USA?",
        answer:
          "Currently, we're focused on the UK and USA markets, but we're expanding! Sign up for our newsletter to be notified when we launch in your region.",
      },
      {
        question: "Can I change my location/availability settings?",
        answer:
          "Absolutely! Update your location, service radius, and availability schedule anytime from your profile settings to ensure you're matched with relevant opportunities.",
      },
    ],
  },
];
