/** Static nav data for client components — avoids bundling full site.json */
export const SERVICE_NAV = {
  tier1: [
    { slug: 'digital-transformation', title: 'Digital Transformation' },
    { slug: 'ch-deploy', title: 'CH Deploy' },
    { slug: '8d-customer-complaints', title: '8D Customer Complaints' },
    { slug: 'merchandise-ppes', title: 'Merchandise & PPEs' },
    { slug: 'returns-management', title: 'Returns Management' },
  ],
  tier2: [
    { slug: 'digital-advancement', title: 'Digital Advancement' },
    { slug: 'optimization-tools', title: 'Optimization Tools' },
    { slug: 'deploy-cdx-pro', title: 'DEPLOY – CDX Pro' },
    { slug: 'fleet-driver-management', title: 'Fleet & Driver Management' },
    { slug: 'esg-sustainability', title: 'ESG – Sustainability' },
    { slug: 'customer-xperience-management', title: 'Customer Xperience Management' },
  ],
  tier3: [
    { slug: 'it-advanced-technologies', title: 'IT & Advanced Technologies' },
    { slug: 'operational-advancement', title: 'Operational Advancement' },
    { slug: 'fleet-operations', title: 'Fleet Operations' },
    { slug: 'scm-process', title: 'SCM & Process' },
    { slug: 'sustainability-monitoring', title: 'Sustainability & Monitoring' },
    { slug: 'compliance-governance', title: 'Compliance & Governance' },
  ],
} as const;
