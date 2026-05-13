import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ExternalLink,
  GitFork,
  FilePlus,
  GitPullRequest,
  Copy,
  Check,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

const yamlExample = `- title: "Hackathon Name 2026"
  platform: "devpost"
  url: "https://hackathon2026.devpost.com"
  location: "City, Country"
  is_online: false
  is_hybrid: true
  themes: ["AI/ML", "Open Innovation"]
  prize_pool: "$50,000+"
  currency: "USD"
  phases:
    - name: "Registration Deadline"
      deadline: "2026-09-01T23:59:00-04:00"
    - name: "Project Submission"
      deadline: "2026-09-15T09:00:00-04:00"
    - name: "Demo Day"
      deadline: "2026-09-16T14:00:00-04:00"
  sponsors: ["Sponsor1", "Sponsor2"]
  eligibility: "Open to all university students"
  status: "upcoming"`;

const fieldData = [
  { name: 'title', type: 'string', required: 'Yes', desc: 'Hackathon name with year' },
  { name: 'platform', type: 'enum', required: 'Yes', desc: 'devpost / mlh / dorahacks / devfolio / unstop / hackerearth / other' },
  { name: 'url', type: 'string', required: 'Yes', desc: 'Official hackathon URL' },
  { name: 'location', type: 'string', required: 'No', desc: 'City and country' },
  { name: 'is_online', type: 'boolean', required: 'Yes', desc: 'true if fully online' },
  { name: 'is_hybrid', type: 'boolean', required: 'No', desc: 'true if hybrid format' },
  { name: 'themes', type: 'string[]', required: 'No', desc: 'Tags: AI/ML, Web3, IoT, Climate, etc.' },
  { name: 'prize_pool', type: 'string', required: 'No', desc: 'Display text like "$50,000+"' },
  { name: 'currency', type: 'enum', required: 'No', desc: 'USD, EUR, GBP, CAD, SGD' },
  { name: 'phases', type: 'array', required: 'Yes', desc: 'At least registration + submission deadlines' },
  { name: 'sponsors', type: 'string[]', required: 'No', desc: 'List of sponsor company names' },
  { name: 'eligibility', type: 'string', required: 'No', desc: 'Who can participate' },
  { name: 'status', type: 'enum', required: 'Yes', desc: 'upcoming, ongoing, ended' },
];

const faqs = [
  {
    q: 'What types of hackathons can I add?',
    a: 'Any in-person, online, or hybrid hackathon worldwide. From student hackathons to professional competitions, all are welcome.',
  },
  {
    q: 'How do I format the deadline timestamps?',
    a: 'Use ISO 8601 format: YYYY-MM-DDTHH:MM:SS\u00b1HH:00. Include timezone offset when possible.',
  },
  {
    q: 'Can I update an existing hackathon\u2019s information?',
    a: 'Yes! Submit a PR with your changes. Updates are reviewed and merged within 24\u201348 hours.',
  },
  {
    q: 'What if a hackathon gets cancelled?',
    a: 'Submit a PR changing the status to \u2018cancelled\u2019 or removing the entry. We review promptly.',
  },
  {
    q: 'Do I need to provide all fields?',
    a: 'Only title, platform, url, is_online, phases, and status are required. Optional fields help provide richer information.',
  },
  {
    q: 'How are the deadlines displayed in my timezone?',
    a: 'All deadlines are stored with timezone info and displayed in your browser\u2019s local timezone automatically.',
  },
];

const themeTags = [
  'AI/ML', 'Web3', 'IoT', 'Climate', 'Open Source', 'Healthcare',
  'FinTech', 'EdTech', 'DeFi', 'Blockchain', 'Open Innovation', 'Beginner Friendly',
];

function SyntaxHighlightedYaml({ code }: { code: string }) {
  const lines = code.split('\n');

  return (
    <div className="overflow-x-auto">
      {lines.map((line, i) => {
        const trimmed = line;
        let content: React.ReactNode[] = [];

        if (trimmed.startsWith('#')) {
          content = [<span key="c" style={{ color: '#6A9955' }}>{trimmed}</span>];
        } else {
          const keyMatch = trimmed.match(/^\s*(-\s+)?([\w_]+)(\s*:)?(.*)/);
          if (keyMatch) {
            const prefix = keyMatch[1] || '';
            const key = keyMatch[2];
            const colon = keyMatch[3] || '';
            const rest = keyMatch[4];
            content = [
              <span key="pre" style={{ color: '#D4D4D4' }}>{prefix}</span>,
              <span key="key" style={{ color: '#9CDCFE' }}>{key}</span>,
              <span key="colon" style={{ color: '#D4D4D4' }}>{colon}</span>,
            ];
            if (rest) {
              const processed = rest.replace(/^\s+/, '');
              if (processed) {
                const leadingSpace = rest.match(/^\s*/)?.[0] || '';
                if (/^"/.test(processed)) {
                  content.push(
                    <span key="sp" style={{ color: '#D4D4D4' }}>{leadingSpace}</span>,
                    <span key="val" style={{ color: '#CE9178' }}>{processed}</span>
                  );
                } else if (/^\[/.test(processed)) {
                  const bracketMatch = processed.match(/^(\[)(.*)(\])$/);
                  if (bracketMatch) {
                    content.push(
                      <span key="sp" style={{ color: '#D4D4D4' }}>{leadingSpace}</span>,
                      <span key="b1" style={{ color: '#D4D4D4' }}>[</span>
                    );
                    const inner = bracketMatch[2];
                    const parts = inner.split(/("[^"]+")/).filter(Boolean);
                    parts.forEach((part, idx) => {
                      if (/^"/.test(part)) {
                        content.push(<span key={`v${idx}`} style={{ color: '#CE9178' }}>{part}</span>);
                      } else {
                        content.push(<span key={`v${idx}`} style={{ color: '#D4D4D4' }}>{part}</span>);
                      }
                    });
                    content.push(<span key="b2" style={{ color: '#D4D4D4' }}>]</span>);
                  } else {
                    content.push(
                      <span key="sp" style={{ color: '#D4D4D4' }}>{leadingSpace}</span>,
                      <span key="val" style={{ color: '#B5CEA8' }}>{processed}</span>
                    );
                  }
                } else if (/^(true|false|null|\d)/.test(processed)) {
                  content.push(
                    <span key="sp" style={{ color: '#D4D4D4' }}>{leadingSpace}</span>,
                    <span key="val" style={{ color: '#B5CEA8' }}>{processed}</span>
                  );
                } else {
                  content.push(
                    <span key="sp" style={{ color: '#D4D4D4' }}>{leadingSpace}</span>,
                    <span key="val" style={{ color: '#CE9178' }}>{processed}</span>
                  );
                }
              }
            }
          } else {
            content = [<span key="f" style={{ color: '#D4D4D4' }}>{trimmed}</span>];
          }
        }

        return (
          <div key={i} className="leading-relaxed" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px' }}>
            {content.length > 0 ? content : <span style={{ color: '#D4D4D4' }}>{trimmed}</span>}
          </div>
        );
      })}
    </div>
  );
}

export default function Contribute() {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(yamlExample).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--bg-page)' }}>
      {/* Section 1: Page Header */}
      <section className="mx-auto max-w-[1200px] px-4 pt-[80px] pb-6 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={staggerItem}>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-[13px] font-normal transition-all duration-150 hover:underline"
              style={{ color: 'var(--accent-blue)' }}
            >
              <ArrowLeft size={14} />
              Back to Home
            </Link>
          </motion.div>

          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-4 text-[28px] font-bold leading-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Contribute to Hackathon-DDL
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-2 max-w-[720px] text-[15px] font-normal leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            Help the community by adding new hackathons. All data is community-driven via GitHub Pull Requests.
          </motion.p>

          <motion.a
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            href="https://github.com/Just-Agent/hackathon-ddl"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex h-10 items-center gap-1.5 rounded-lg px-5 text-[14px] font-medium text-white transition-colors duration-150"
            style={{ backgroundColor: 'var(--accent-blue)' }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = 'var(--accent-blue-hover)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = 'var(--accent-blue)')
            }
          >
            <ExternalLink size={14} />
            Go to GitHub Repo
          </motion.a>
        </motion.div>
      </section>

      {/* Section 2: Quick Start Guide */}
      <section className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
        >
          <motion.h2
            variants={staggerItem}
            className="mb-4 text-[20px] font-semibold"
            style={{ color: 'var(--text-primary)' }}
          >
            Quick Start
          </motion.h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Step 1 */}
            <motion.div
              variants={staggerItem}
              className="relative rounded-xl border p-5 transition-all duration-200"
              style={{
                borderColor: 'var(--border-light)',
                backgroundColor: 'var(--bg-card)',
              }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[14px] font-semibold text-white"
                  style={{ backgroundColor: 'var(--accent-blue)' }}
                >
                  1
                </span>
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: 'var(--accent-blue-light)' }}
                >
                  <GitFork size={20} style={{ color: 'var(--accent-blue)' }} />
                </div>
                <h3
                  className="text-[16px] font-semibold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Fork
                </h3>
              </div>
              <p
                className="mt-3 text-[13px] leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
              >
                Fork the repository on GitHub to create your own copy.
              </p>
              <a
                href="https://github.com/Just-Agent/hackathon-ddl"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-[13px] font-medium transition-colors duration-150 hover:underline"
                style={{ color: 'var(--accent-blue)' }}
              >
                <ExternalLink size={12} />
                github.com/Just-Agent/hackathon-ddl
              </a>
            </motion.div>

            {/* Connecting line - desktop only */}
            <div
              className="absolute top-1/2 -right-2 hidden h-px w-4 -translate-y-1/2 md:block"
              style={{ backgroundColor: 'var(--border-medium)' }}
            />

            {/* Step 2 */}
            <motion.div
              variants={staggerItem}
              className="relative rounded-xl border p-5 transition-all duration-200"
              style={{
                borderColor: 'var(--border-light)',
                backgroundColor: 'var(--bg-card)',
              }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[14px] font-semibold text-white"
                  style={{ backgroundColor: 'var(--accent-blue)' }}
                >
                  2
                </span>
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: 'var(--accent-green-light)' }}
                >
                  <FilePlus size={20} style={{ color: 'var(--accent-green)' }} />
                </div>
                <h3
                  className="text-[16px] font-semibold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Add Data
                </h3>
              </div>
              <p
                className="mt-3 text-[13px] leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
              >
                Add your hackathon YAML file to the{' '}
                <code
                  className="rounded px-1.5 py-0.5 text-[12px]"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    backgroundColor: 'var(--bg-hover)',
                    color: 'var(--text-primary)',
                  }}
                >
                  data/2026/
                </code>{' '}
                directory. Follow the schema reference below.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              variants={staggerItem}
              className="rounded-xl border p-5 transition-all duration-200"
              style={{
                borderColor: 'var(--border-light)',
                backgroundColor: 'var(--bg-card)',
              }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[14px] font-semibold text-white"
                  style={{ backgroundColor: 'var(--accent-blue)' }}
                >
                  3
                </span>
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: 'var(--accent-purple-light)' }}
                >
                  <GitPullRequest size={20} style={{ color: 'var(--accent-purple)' }} />
                </div>
                <h3
                  className="text-[16px] font-semibold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Submit PR
                </h3>
              </div>
              <p
                className="mt-3 text-[13px] leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
              >
                Submit a Pull Request for review. Our maintainers will review and merge it within 24-48 hours.
              </p>
              <a
                href="https://github.com/Just-Agent/hackathon-ddl/pulls"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-[13px] font-medium transition-colors duration-150 hover:underline"
                style={{ color: 'var(--accent-blue)' }}
              >
                <GitPullRequest size={12} />
                View open PRs
              </a>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Section 3: YAML Schema Reference */}
      <section className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
        >
          <motion.h2
            variants={staggerItem}
            className="text-[20px] font-semibold"
            style={{ color: 'var(--text-primary)' }}
          >
            YAML Data Format
          </motion.h2>

          <motion.p
            variants={staggerItem}
            className="mt-2 text-[14px] leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            Each hackathon is defined in a YAML file. Here is the complete schema with all supported fields.
          </motion.p>

          <motion.div
            variants={staggerItem}
            className="mt-4 rounded-xl p-6"
            style={{ backgroundColor: '#1E1E1E' }}
          >
            <div className="flex items-center justify-between mb-4">
              <span
                className="text-[12px] font-medium"
                style={{ color: '#9CA3AF', fontFamily: "'JetBrains Mono', monospace" }}
              >
                data/2026/hackathon-name.yml
              </span>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors duration-150"
                style={{ color: '#9CA3AF', backgroundColor: '#2D2D2D' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#3D3D3D';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#2D2D2D';
                }}
              >
                {copied ? <Check size={14} style={{ color: '#22C55E' }} /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <SyntaxHighlightedYaml code={yamlExample} />
          </motion.div>

          {/* Field Reference Table */}
          <motion.div variants={staggerItem} className="mt-8">
            <h3
              className="mb-3 text-[16px] font-semibold"
              style={{ color: 'var(--text-primary)' }}
            >
              Field Reference
            </h3>
            <div
              className="overflow-hidden rounded-lg border"
              style={{ borderColor: 'var(--border-light)' }}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr style={{ backgroundColor: 'var(--bg-hover)' }}>
                      <th
                        className="px-4 py-3 text-[13px] font-semibold"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        Field
                      </th>
                      <th
                        className="px-4 py-3 text-[13px] font-semibold"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        Type
                      </th>
                      <th
                        className="px-4 py-3 text-[13px] font-semibold"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        Required
                      </th>
                      <th
                        className="px-4 py-3 text-[13px] font-semibold"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {fieldData.map((field, i) => (
                      <tr
                        key={field.name}
                        style={{
                          backgroundColor:
                            i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-page)',
                        }}
                      >
                        <td
                          className="px-4 py-3 text-[13px] font-medium"
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            color: 'var(--text-primary)',
                          }}
                        >
                          {field.name}
                        </td>
                        <td
                          className="px-4 py-3 text-[13px]"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          {field.type}
                        </td>
                        <td className="px-4 py-3 text-[13px]">
                          <span
                            className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium"
                            style={{
                              backgroundColor:
                                field.required === 'Yes'
                                  ? 'var(--accent-green-light)'
                                  : field.required === 'No'
                                  ? 'var(--accent-orange-light)'
                                  : 'var(--accent-blue-light)',
                              color:
                                field.required === 'Yes'
                                  ? 'var(--accent-green)'
                                  : field.required === 'No'
                                  ? 'var(--accent-orange)'
                                  : 'var(--accent-blue)',
                            }}
                          >
                            {field.required}
                          </span>
                        </td>
                        <td
                          className="px-4 py-3 text-[13px]"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          {field.desc}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          {/* Allowed Theme Tags */}
          <motion.div variants={staggerItem} className="mt-6">
            <p
              className="mb-3 text-[14px] font-medium"
              style={{ color: 'var(--text-primary)' }}
            >
              Allowed values for the <code style={{ fontFamily: "'JetBrains Mono', monospace" }}>themes</code> field:
            </p>
            <div className="flex flex-wrap gap-2">
              {themeTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium"
                  style={{
                    backgroundColor: 'var(--accent-blue-light)',
                    color: 'var(--accent-blue)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Section 4: FAQ */}
      <section className="mx-auto max-w-[800px] px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
        >
          <motion.h2
            variants={staggerItem}
            className="mb-4 text-center text-[20px] font-semibold"
            style={{ color: 'var(--text-primary)' }}
          >
            Frequently Asked Questions
          </motion.h2>

          <motion.div variants={staggerItem}>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  style={{ borderColor: 'var(--border-light)' }}
                >
                  <AccordionTrigger
                    className="py-4 text-[14px] font-medium"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent
                    className="pb-4 text-[14px] leading-relaxed"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </motion.div>
      </section>

      {/* Section 5: CTA */}
      <section className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
          className="flex flex-col items-center text-center"
        >
          <motion.h2
            variants={staggerItem}
            className="text-[20px] font-semibold"
            style={{ color: 'var(--text-primary)' }}
          >
            Ready to contribute?
          </motion.h2>

          <motion.p
            variants={staggerItem}
            className="mt-2 text-[14px]"
            style={{ color: 'var(--text-secondary)' }}
          >
            Join the community and help keep hackathon deadlines up to date.
          </motion.p>

          <motion.div
            variants={staggerItem}
            className="mt-6 flex flex-col gap-3 sm:flex-row"
          >
            <a
              href="https://github.com/Just-Agent/hackathon-ddl"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-lg px-5 text-[13px] font-medium text-white transition-colors duration-150"
              style={{ backgroundColor: 'var(--accent-blue)' }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = 'var(--accent-blue-hover)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = 'var(--accent-blue)')
              }
            >
              <GitFork size={16} />
              Fork on GitHub
            </a>

            <a
              href="https://github.com/Just-Agent/hackathon-ddl/pulls"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-lg border px-5 text-[13px] font-medium transition-colors duration-150"
              style={{
                borderColor: 'var(--border-medium)',
                color: 'var(--text-primary)',
                backgroundColor: 'var(--bg-card)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-card)';
              }}
            >
              <GitPullRequest size={16} />
              View Open PRs
            </a>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
