export default function Footer() {
  return (
    <footer
      className="w-full"
      style={{
        borderTop: '1px solid var(--border-light)',
        backgroundColor: 'var(--bg-page)',
      }}
    >
      <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>
            Maintained by the community. If you find it useful,{' '}
            <a
              href="https://github.com/Just-Agent/hackathon-ddl"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-150 hover:underline"
              style={{ color: 'var(--accent-blue)' }}
            >
              star or follow on GitHub
            </a>
          </p>
          <div className="flex items-center gap-6 text-xs" style={{ color: 'var(--text-muted)' }}>
            <a
              href="https://github.com/Just-Agent/hackathon-ddl"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-150 hover:underline"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              GitHub Repo
            </a>
            <a
              href="#/contribute"
              className="transition-colors duration-150 hover:underline"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              Contribute
            </a>
            <span>Data is manually collected and for reference purposes only.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
