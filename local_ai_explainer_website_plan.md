# Local AI Platform Explainer Website Planning Document

## 1. Website Purpose

Create a developer-facing internal website that explains the department’s local AI platform, how each component works, which models and providers are available, and how developers should configure their preferred tools.

The primary rollout objective is standardized AI tooling adoption across a department-specific developer group.

## 2. Primary Audience

The primary audience is software developers who will use AI through:

- VS Code extensions
- CLI agents
- Hermes
- OpenClaw
- Desktop chat clients
- Other OpenAI-compatible tools

The website should assume technical competence but should not assume prior experience with local model hosting, LM Studio, model routing, or API configuration.

## 3. Core Message

The department provides a flexible three-layer AI system:

1. **Mac Studio shared inference**
   - Primary LAN-hosted LLM service
   - Larger reasoning and coding models
   - Used for complex coding, architecture, planning, and agent workflows

2. **Developer workstation inference**
   - Local fallback chat/code model
   - Local fast autocomplete model
   - Continues working when the Mac Studio is unavailable
   - Keeps autocomplete low-latency and workstation-local

3. **Cloud model access**
   - OpenRouter account for free or approved paid models
   - Optional access to frontier models
   - Used when local models are insufficient or cloud access is explicitly allowed

## 4. System Architecture

```text
Developer Tool
├── Mac Studio LM Studio API
│   └── Primary shared reasoning/code model
│
├── Local Workstation LM Studio API
│   ├── Local fallback inference model
│   └── Fast autocomplete model
│
└── OpenRouter API
    ├── Free cloud models
    └── Approved frontier models
```

Both the Mac Studio and developer workstations may use the same LM Studio port because they use different host addresses.

Example:

```text
Mac Studio:          http://<mac-studio-ip>:1234/v1
Local workstation:   http://localhost:1234/v1
OpenRouter:          https://openrouter.ai/api/v1
```

The complete endpoint identity is:

```text
Host + Port + Model ID
```

## 5. Deployment Boundary

The primary LLM deployment is considered complete when:

- LM Studio is installed on the Mac Studio
- The approved primary model is loaded
- The OpenAI-compatible API is enabled
- The server is reachable over the LAN
- Firewall rules are configured
- A developer workstation successfully sends a test request
- Model name, endpoint, and usage instructions are documented

After this validation, implementation work moves to the developer workstations.

## 6. Developer Workstation Rollout

Each workstation should receive a standard baseline:

### Required software

- LM Studio
- Approved local fallback model
- Approved autocomplete model
- At least one approved OpenAI-compatible client or agent
- Configuration instructions for Mac, local, and cloud providers

### Provider profiles

```text
mac-primary
  Base URL: http://<mac-studio-ip>:1234/v1
  Use: complex coding, planning, architecture, agent workflows

local-fallback
  Base URL: http://localhost:1234/v1
  Use: outage fallback, simple questions, local-only work

local-autocomplete
  Base URL: http://localhost:1234/v1
  Use: VS Code inline and multiline completion

cloud-openrouter
  Base URL: https://openrouter.ai/api/v1
  Use: free cloud models or approved frontier models
```

## 7. Model Catalog Structure

The website should maintain a model catalog rather than hard-coding model assumptions into setup instructions.

Each model entry should include:

- Display name
- Exact model identifier
- Host location
- Purpose
- Context length
- Quantization
- Memory requirement
- Expected speed
- Strengths
- Limitations
- Supported tools
- Approval status
- Last tested date

### Initial model categories

#### Mac Studio primary model
A larger code/reasoning model optimized for:

- Architecture
- Refactoring
- Multi-file reasoning
- Planning
- Agent workflows
- Complex code generation

#### Mac Studio utility model
A faster model for:

- General questions
- Lightweight code tasks
- Summaries
- Routing or utility operations

#### Workstation fallback model
A medium or small model for:

- Basic code generation
- Code explanation
- Chat
- Emergency continuity

#### Workstation autocomplete model
A small, fast code model for:

- Inline completion
- Multiline completion
- Low-latency editor assistance

#### OpenRouter free models
Optional cloud-hosted models selected through:

- Explicit free model variants
- A free-model router
- Department-approved account or organization policy

#### OpenRouter frontier models
Optional approved paid models for:

- Difficult reasoning
- High-value code tasks
- Cases where local model quality is insufficient

Exact model names remain a deployment decision and should be populated after benchmarking.

## 8. Account and Access Strategy

Preferred OpenRouter account structure:

- Individual developer identities under a department or team organization
- Separate API keys per developer
- Centralized policy and spend controls
- Easier offboarding and auditing

A shared team credential should be avoided unless organizational limitations require it.

The website should explain:

- How to request access
- Where API keys are stored
- Which models are approved
- Whether paid usage is allowed
- How usage is attributed
- What data may or may not be sent to cloud providers

## 9. Tool Compatibility

The website should include setup guides for supported clients.

Suggested categories:

### VS Code
- Autocomplete extension
- Chat extension
- Model endpoint configuration
- Local autocomplete model assignment

### CLI agents
- Hermes
- OpenClaw
- Other OpenAI-compatible CLI tools
- Environment variable configuration
- Provider switching

### Desktop clients
- LM Studio chat
- Other approved OpenAI-compatible chat clients

Each guide should show how to configure:

- Base URL
- API key behavior
- Model identifier
- Timeout
- Context settings
- Provider selection
- Local versus cloud mode

## 10. Recommended Website Information Architecture

```text
Home
├── What This Platform Is
├── Architecture Overview
├── Choose Your AI Provider
│   ├── Mac Studio
│   ├── Local Workstation
│   └── OpenRouter
├── Model Catalog
├── Workstation Setup
├── Tool Setup Guides
│   ├── VS Code
│   ├── Hermes
│   ├── OpenClaw
│   └── Generic OpenAI Client
├── Rollout Procedure
├── Troubleshooting
├── Security and Data Rules
├── Performance Expectations
├── FAQ
└── Change Log
```

## 11. Rollout Procedure

### Phase 1: Mac Studio

1. Install and validate LM Studio.
2. Load the approved primary model.
3. Enable the OpenAI-compatible API.
4. Bind the server to the LAN.
5. Configure firewall access.
6. Record hostname, IP address, port, and model ID.
7. Test from a Windows workstation.
8. Document baseline performance.

### Phase 2: Pilot workstation

1. Install LM Studio.
2. Load the fallback model.
3. Load the autocomplete model.
4. Configure one approved VS Code tool.
5. Configure one approved CLI agent.
6. Add Mac Studio provider profile.
7. Add local provider profile.
8. Add OpenRouter provider profile.
9. Validate provider switching.
10. Record setup steps and issues.

### Phase 3: Department rollout

1. Publish standardized workstation instructions.
2. Provide approved configuration templates.
3. Assign OpenRouter access.
4. Roll out by developer or team.
5. Validate each workstation.
6. Track completion and issues.
7. Update documentation based on field feedback.

## 12. Developer Onboarding Flow

The website should guide each developer through this sequence:

1. Confirm access to the Mac Studio endpoint.
2. Install LM Studio locally.
3. Download approved local models.
4. Start the local LM Studio API.
5. Install a preferred agent or client.
6. Add Mac, local, and cloud provider profiles.
7. Configure VS Code autocomplete.
8. Run validation prompts.
9. Confirm fallback behavior.
10. Review security and cloud-use rules.

## 13. Validation Tests

Each workstation should pass:

- Mac Studio API connectivity
- Local fallback inference
- Local autocomplete response
- Agent connection to Mac model
- Agent connection to local model
- OpenRouter authentication
- Manual provider switching
- Mac Studio outage fallback
- Model identifier visibility
- Acceptable latency and quality

## 14. Security and Governance

The website must clearly state:

- Secret values must not be stored in project memory or documentation
- API keys should use environment variables or approved credential storage
- Local and cloud providers have different data-handling implications
- Cloud use may require explicit approval
- Model and routing changes are centrally governed
- High-risk agent actions should be logged
- Shared credentials should be minimized
- Named developer identities are preferred for attribution

## 15. Troubleshooting Topics

Include solutions for:

- Mac Studio endpoint unreachable
- Firewall blocking LM Studio
- Wrong base URL
- Wrong model identifier
- Client expects an API key for a local server
- Local model not loaded
- Multiple models consuming excessive memory
- Autocomplete latency
- OpenRouter authentication failures
- Free cloud model unavailable or rate-limited
- Agent tool works with one provider but not another

## 16. Success Criteria

The website and rollout are successful when a developer can:

- Understand the three provider layers
- Connect to the Mac Studio model
- Run a local fallback model
- Use a local autocomplete model
- Configure an OpenAI-compatible agent
- Switch between Mac, local, and cloud providers
- Understand which provider to use for each task
- Complete setup without direct administrator assistance
- Troubleshoot common failures using the website

## 17. Content Still Needed

Before final website production, collect:

- Exact approved Mac Studio model names
- Exact fallback model name
- Exact autocomplete model name
- Mac Studio hostname and IP
- Final port
- Supported clients and versions
- OpenRouter organization policy
- Cloud usage restrictions
- API key storage standard
- Screenshots of configuration screens
- Benchmark results
- Named support contacts
- Department branding requirements

## 18. Recommended First Website Deliverable

Build a simple static documentation site first.

Recommended first-release pages:

1. Overview
2. Architecture
3. Model Catalog
4. Workstation Setup
5. Provider Configuration
6. VS Code Setup
7. CLI Agent Setup
8. Troubleshooting
9. Security Rules
10. Rollout Checklist

The first version should prioritize clarity, repeatability, and easy maintenance over visual complexity.
