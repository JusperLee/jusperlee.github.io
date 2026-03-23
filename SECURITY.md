# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it responsibly.

**Email:** limyoonaxi@gmail.com

Please include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact

I will acknowledge receipt within 48 hours and aim to release a fix promptly.

## Scope

This is a static site template. Security concerns are primarily:
- XSS through user-provided data in `src/data/` files
- Dependency vulnerabilities in `node_modules/`
- Exposed secrets in `.env` or source files

## Best Practices for Users

- Do not commit secrets or API keys to `.env` (use `.env.local` for sensitive values)
- Keep dependencies updated: `npm audit` regularly
- Review third-party links in your data files before deploying
