# Security Policy

Base-3 was engineered to be a deterministic leash for generative AI. By definition, our core mission is safety, predictability, and systemic coherence. In the context of Base-3, a security vulnerability is not just a standard software bug—it is an architectural failure that allows the AI to slip its leash, hallucinate physical reality, or trigger unbounded compute loops.

We take the integrity of the epistemic triad (Synthetic Intent, Symbolic Law, Empirical Observation) with the utmost seriousness.

## Supported Versions

Currently, only the latest active branch is supported for security updates. 

| Version | Supported          |
| ------- | ------------------ |
| `main`  | :white_check_mark: |
| `< 1.0` | :x:                |

## What Constitutes a Security Vulnerability in Base-3?

Standard software vulnerabilities (injection, XSS in eventual dashboards, dependency vulnerabilities) apply, but we are particularly focused on **Domain-Specific Architectural Threats**:

1. **Epistemic Bypass:** Any exploit that successfully forces the Base-3 engine to accept a probabilistic or hallucinated output by bypassing the deterministic topological arbitration.
2. **Triad Poisoning:** Vulnerabilities that allow malicious injection of contradictory "Empirical Observation" data or altered "Symbolic Law" constraints intended to deliberately corrupt the engine's course-correction logic.
3. **Compute Exhaustion Attacks:** Exploits designed to trap the arbitration engine in an infinite verification loop, thereby violating our strict "low-compute" mandate and intentionally causing resource bloat.

## Reporting a Vulnerability

**Do not report security vulnerabilities in the public issue tracker.** 

If you discover a vulnerability that allows the deterministic boundaries of Base-3 to be breached, please report it privately.

1. **GitHub Security Advisories:** Use the "Security" tab in this repository and click "Report a vulnerability" to open a private advisory directly with the maintainers.
2. **Direct Contact:** Alternatively, you can reach out directly to the core maintainers (ensure you encrypt sensitive payloads if communicating via email).

### What to Include in Your Report
* A clear description of the vulnerability and its impact on the epistemic triad.
* A reproducible proof-of-concept (PoC) demonstrating how the deterministic arbitration is bypassed.
* Any relevant environment details or specific configurations required to trigger the exploit.

## Response and Remediation

* We will acknowledge receipt of your vulnerability report within **48 hours**.
* We will investigate and provide a status update or a proposed mitigation timeline within **5 business days**.
* If the vulnerability is confirmed, we will patch the core engine, release an update, and publish a coordinated security advisory crediting you for the responsible disclosure.

Help us keep the sandbox closed. Make the world safe.
