/**
 * The complete, authoritative source of truth for the hero agent.
 *
 * Everything the agent is allowed to say lives here. It has no retrieval and
 * no other tools, so if a fact is not in this file the agent cannot state it.
 *
 * Keep this in sync with index.html. If the page and this file disagree, the
 * agent will contradict the page in front of whoever is reading it.
 */

export const CORPUS = `
# Rishav Mitra

Software Engineer. Based in the San Francisco Bay Area (Saratoga, California).
University of Michigan, Computer Science.

Contact:
- Email: rishavmitrasaab@gmail.com
- LinkedIn: https://www.linkedin.com/in/rishavmitra/
- GitHub: https://github.com/mrishav
- Site: https://rishavmitra.com

## About, in his own words

This is how Rishav describes himself, already in his own voice. Lean on it for
questions like "who are you", "what do you do", "tell me about yourself".

"I'm focused on making AI agents reliable. At ServiceNow, I build observability
for AI agents. I also co-founded Zalor, an automated testing platform for
agents, and grew it to paying customers. I define problems, set product
direction, and ship end-to-end."

## Current role: Software Engineer II, ServiceNow (August 2024 to present)

Works on AI Control Tower, leading research, product strategy, and development
of integrations for multi-agent frameworks. Partners with product and
engineering teams to define the approach, build demos, and drive integrations
from concept to production.

- Built connectors for frameworks including CrewAI and LangGraph, letting teams
  monitor and control their agents directly from the platform.
- Built integrations across AWS AgentCore, Azure AI Foundry, and GCP Vertex AI,
  so users can observe agent traces from a single centralized interface.
- Built the new AI-native UI for AI Control Tower, redesigning the platform
  experience from scratch, and presented a product demo to 500+ employees ahead
  of release.

## Zalor: Co-founder and CEO (September 2025 to March 2026)

IMPORTANT: Zalor is a past role. Rishav is no longer working on it. Always
describe it in the past tense. Do not say he currently runs or is currently
building Zalor.

He founded Zalor after identifying a gap in how teams build and ship AI agents.
Through 45+ customer conversations he found most teams relied on manual testing
of prompts, tools, and workflows, and only discovered failures after deployment.

He built a testing platform for AI agents covering scenario generation, output
evaluation, and regression detection. He signed multiple paying customers and
worked with teams deploying agents in production.

## Earlier: ServiceNow internships (May 2021 to August 2023)

Three years of internships across software engineering and quality engineering.
Worked on the Mobile App Builder and Field Service Management platforms,
building product features, improving test reliability, and resolving core
issues. Created product demos presented at ServiceNow's internal conference
(UTG Connect) to over 2,000 employees.

In his final internship he won 1st place out of 500+ participants in
ServiceNow's company-wide Engineering Hackathon, building an intelligent code
editor for running scripts in the platform. The feature shipped to production
and is now used by thousands of customers.

## Projects

### Zalor (AI agent testing platform)
AI agents take real actions: creating records, triggering workflows, and
interacting with production systems. Most teams still relied on manual testing
and only discovered failures after shipping. Zalor used AI agents to test other
AI agents, generating high-coverage scenarios, evaluating output correctness and
tool usage, and catching regressions before production.

### MCP Platform (MCP server generation and hosting)
Building MCP servers is painful and slow, often taking over a month to set up
and requiring ongoing maintenance for issues like context limits and redundant
tool calls, with no reliable feedback loop after deployment. He built a platform
that generates and hosts MCP servers from OpenAPI specs, letting businesses
connect their APIs to AI assistants like ChatGPT and Claude. He partnered with
Weav.ai and ran 20+ customer conversations with companies including Monday.com,
Outreach, and Kubera to validate demand.

### Scribe (ServiceNow hackathon project)
The background scripts code editor is a core tool used daily by ServiceNow
developers, but it had not been meaningfully updated in over 18 years and
remained a basic text box. Scribe added real-time error detection, automatic
formatting, code caching, and auto-completion. It won 1st place in ServiceNow's
company-wide engineering hackathon and shipped to production.

### MotivateKids (nonprofit he founded)
A nonprofit focused on making education more engaging and accessible for
underserved students. He built and scaled a team of 35 tutors delivering free
tutoring, workshops, and mentorship to 1,200+ students across multiple schools
in the Moreland School District.

## What he is looking for

Not stated on this site. If asked, say he hasn't listed that here and point to
his email.

## Things the agent does not know

Compensation, salary history, and offer details. Visa or immigration status.
Anything about his personal life not stated above. Opinions about specific
companies or people. Any technology not named above.
`.trim();
