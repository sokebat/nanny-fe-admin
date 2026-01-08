export interface TermSection {
  id: string;
  title: string;
  content: string[];
}

export const getTermsTitle = (region: string) => {
  return region === "canada"
    ? "The Nanny Plug – Canadian Terms & Conditions & Disclaimer"
    : "NannyCare Plus LLC (d/b/a The Nanny Plug) – U.S. Terms & Conditions & Disclaimer";
};

export const getLegalResources = (region: string) => {
  return region === "canada"
    ? [
        "For official information on nanny and caregiver laws in Canada, visit: Government of Canada – Labour Standards: https://www.canada.ca/en/services/jobs/workplace/federallabourstandards.html",
        "Employment Standards by Province: https://www.canada.ca/en/employment-social-development/services/employment-standards.html",
        "Canadian Centre for Occupational Health and Safety: https://www.ccohs.ca",
      ]
    : [
        "For official information on nanny and caregiver laws in the United States, visit:",
        "U.S. Department of Labor – Wage and Hour Division: https://www.dol.gov/agencies/whd",
        "Internal Revenue Service (IRS) – Household Employers: https://www.irs.gov/businesses/small-businesses-self-employed/hiring-household-employees",
        "State Labor Departments: Visit your state's labor department website for local employment standards.",
      ];
};

export const getTermsSections = (region: string): TermSection[] => {
  return [
    {
      id: "section-01",
      title: "01. Disclaimer of Agency & Employment Relationship",
      content: [
        "NannyCare Plus LLC ('the Platform') is not an agency, employer, or representative of caregivers, families, or vendors. All caregivers and families use the Platform as independent parties. The Platform does not employ, supervise, or control caregivers, nor guarantee that families will offer work.",
      ],
    },
    {
      id: "section-02",
      title: "02. User Responsibilities",
      content: [
        "Families may only post job requirements. Caregivers may only post personal caregiver profiles. Vendors may post events, services, or resources. Each party is solely responsible for conducting background checks, negotiating payments directly, and complying with Canadian labor and tax laws.",
      ],
    },
    {
      id: "section-03",
      title: "03. Limitation of Liability",
      content: [
        "The Platform is not liable for the quality, safety, or outcome of caregiver services, payment disputes, or misrepresentation of credentials. Users agree to hold the Platform harmless from claims or losses.",
      ],
    },
    {
      id: "section-04",
      title: "04. No Endorsement or Guarantee",
      content: [
        "The Platform does not endorse or verify the qualifications, suitability, or background of caregivers, families, or vendors.",
      ],
    },
    {
      id: "section-05",
      title: "05. Acceptable Use & Content Guidelines",
      content: [
        "Users agree not to post unlawful, false, or harmful content. Violations may result in suspension or termination of accounts.",
      ],
    },
    {
      id: "section-06",
      title: "06. Dispute Resolution & Arbitration",
      content: [
        "Users agree to resolve disputes directly. Claims against NannyCare Plus LLC will be resolved under binding arbitration in Ontario, unless prohibited. Users may opt out within 30 days of accepting by emailing admin@thenannyplug.com.",
      ],
    },
    {
      id: "section-07",
      title: "07. Memberships, Payments & Refunds",
      content: [
        "Memberships and subscriptions are billed as described at purchase. Unless otherwise specified, fees are non-refundable. Pricing and plans may change with notice.",
      ],
    },
    {
      id: "section-08",
      title: "08. Course, Resource & Kit Perks",
      content: [
        "Optional perks may include temporary posting of caregiver profiles or family job listings. Perks are time-limited (1–3 months). Users must use perks within 15 days of purchase or course completion, or the perk is forfeited. New purchases may grant new perks, requiring a new or updated post. Vendor postings are not tied to perks.",
      ],
    },
    {
      id: "section-09",
      title: "09. Account Suspension & Violations",
      content: [
        "The Platform may suspend or terminate accounts for violations of these Terms, unlawful content, or harmful activity.",
      ],
    },
    {
      id: "section-10",
      title: "10. Website Use & Intellectual Property",
      content: [
        "All content is owned by NannyCare Plus LLC / The Nanny Plug. Users may not copy or misuse site content.",
      ],
    },
    {
      id: "section-11",
      title: "11. Background Checks (Optional)",
      content: [
        "Background checks may be available through third-party services. The Platform does not conduct or guarantee results.",
      ],
    },
    {
      id: "section-12",
      title: "12. Changes to Terms",
      content: [
        "These Terms may be updated at any time. Material changes will be communicated with notice. Non-material changes take effect immediately.",
      ],
    },
    {
      id: "section-13",
      title: "13. Governing Law",
      content: [
        region === "canada"
          ? "These Terms are governed by the laws of Canada, excluding Quebec. Disputes are subject to Ontario jurisdiction."
          : "These Terms are governed by the laws of the United States. Disputes are subject to jurisdiction in the state where NannyCare Plus LLC is registered.",
      ],
    },
    {
      id: "section-14",
      title: "14. Educational Materials Disclaimer",
      content: [
        "Courses, resources, and kits are for informational and professional development purposes only. They are non-accredited, not legal advice, and do not replace certifications or licenses.",
      ],
    },
    {
      id: "section-15",
      title: "15. Legal Guidance Resources",
      content: getLegalResources(region),
    },
  ];
};
