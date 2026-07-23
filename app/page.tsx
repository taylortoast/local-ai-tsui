const providers = [
  {
    name: "mac-primary",
    endpoint: "http://<mac-studio-ip>:1234/v1",
    use: "Complex coding, planning, architecture, refactoring, and agent workflows.",
    note: "Shared LAN inference with the largest approved reasoning or coding model.",
  },
  {
    name: "local-fallback",
    endpoint: "http://localhost:1234/v1",
    use: "Continuity during outages, local-only questions, simple code help, and chat.",
    note: "Runs in LM Studio on each developer workstation.",
  },
  {
    name: "local-autocomplete",
    endpoint: "http://localhost:1234/v1",
    use: "Low-latency inline and multiline VS Code completion.",
    note: "Uses the local host plus the exact autocomplete model ID.",
  },
  {
    name: "cloud-openrouter",
    endpoint: "https://openrouter.ai/api/v1",
    use: "Free cloud models or approved frontier models when local quality is insufficient.",
    note: "Requires named developer access, approved policy, and correct data handling.",
  },
];

const modelRows = [
  ["Mac Studio primary", "TBD after benchmark", "Architecture, code agents, difficult reasoning", "Approved"],
  ["Mac Studio utility", "TBD after benchmark", "Summaries, routing, lightweight code tasks", "Candidate"],
  ["Workstation fallback", "TBD after benchmark", "Local chat and simple code generation", "Approved"],
  ["Workstation autocomplete", "TBD after benchmark", "Fast editor completion", "Approved"],
  ["OpenRouter free", "TBD by policy", "Optional free cloud model access", "Restricted"],
  ["OpenRouter frontier", "TBD by policy", "Escalation for high-value difficult tasks", "Approval required"],
];

const rollout = [
  "Validate Mac Studio LM Studio API over the LAN.",
  "Install LM Studio and approved local models on the pilot workstation.",
  "Configure VS Code, one CLI agent, and provider switching.",
  "Publish exact model IDs, endpoint names, and setup screenshots.",
  "Roll out by developer or team and record validation results.",
];

const checks = [
  "Mac Studio API connectivity",
  "Local fallback inference",
  "Local autocomplete response",
  "Agent connection to Mac and local models",
  "OpenRouter authentication",
  "Provider switching and outage fallback",
];

const troubleshooting = [
  ["Endpoint unreachable", "Confirm host, port, LAN binding, and firewall access."],
  ["Wrong model identifier", "Copy the exact served model ID from LM Studio or OpenRouter."],
  ["Client requires API key", "Use a placeholder for local LM Studio if the client requires one."],
  ["Local model not loaded", "Load the fallback or autocomplete model before starting the local API."],
  ["Autocomplete is slow", "Switch to the approved autocomplete model and keep it workstation-local."],
  ["Cloud model unavailable", "Check OpenRouter auth, rate limits, model status, and approval rules."],
];

export default function Home() {
  return (
    <main>
      <nav className="topbar" aria-label="Primary navigation">
        <a className="brand" href="#top">
          <img src="/favicon.svg" alt="" />
          <span>Local AI Platform</span>
        </a>
        <div className="navlinks">
          <a href="#architecture">Architecture</a>
          <a href="#setup">Setup</a>
          <a href="#security">Security</a>
        </div>
      </nav>

      <section className="hero" id="top">
        <img
          src="/platform-guide-hero.png"
          alt="Local AI Platform Guide architecture showing Mac Studio, workstation, and OpenRouter connected to developer tools."
        />
        <div className="heroSummary">
          <div>
            <p className="eyebrow">Department developer guide</p>
            <h1>Use the right AI provider for the job.</h1>
          </div>
          <p>
            A practical internal guide for connecting developer tools to shared
            Mac Studio inference, workstation-local models, and approved cloud
            access without guessing at endpoints or model IDs.
          </p>
          <div className="heroActions" aria-label="Quick links">
            <a href="#choose">Choose provider</a>
            <a href="#setup">Start setup</a>
          </div>
        </div>
      </section>

      <section className="section" id="architecture">
        <div className="sectionHeader">
          <p className="eyebrow">Architecture</p>
          <h2>Three layers, one OpenAI-compatible workflow.</h2>
          <p>
            The complete endpoint identity is host plus port plus model ID. The
            Mac Studio and local workstation can both use port 1234 because
            they live at different host addresses.
          </p>
        </div>
        <div className="codePanel" aria-label="Example endpoints">
          <code>Mac Studio: http://&lt;mac-studio-ip&gt;:1234/v1</code>
          <code>Local workstation: http://localhost:1234/v1</code>
          <code>OpenRouter: https://openrouter.ai/api/v1</code>
        </div>
      </section>

      <section className="section" id="choose">
        <div className="sectionHeader">
          <p className="eyebrow">Provider profiles</p>
          <h2>Pick the smallest approved provider that fits the work.</h2>
        </div>
        <div className="providerGrid">
          {providers.map((provider) => (
            <article className="providerCard" key={provider.name}>
              <div>
                <h3>{provider.name}</h3>
                <code>{provider.endpoint}</code>
              </div>
              <p>{provider.use}</p>
              <small>{provider.note}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="catalog">
        <div className="sectionHeader">
          <p className="eyebrow">Model catalog</p>
          <h2>Track model facts outside setup prose.</h2>
          <p>
            Populate exact identifiers after benchmarking. Each approved row
            should also record context length, quantization, memory need,
            expected speed, supported tools, and last tested date.
          </p>
        </div>
        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Model ID</th>
                <th>Primary use</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {modelRows.map(([category, model, purpose, status]) => (
                <tr key={category}>
                  <td>{category}</td>
                  <td>{model}</td>
                  <td>{purpose}</td>
                  <td>{status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="splitSection" id="setup">
        <div>
          <p className="eyebrow">Workstation setup</p>
          <h2>Developer onboarding flow</h2>
          <ol className="steps">
            <li>Confirm Mac Studio endpoint access from the workstation.</li>
            <li>Install LM Studio and download approved local models.</li>
            <li>Start the local LM Studio API on localhost port 1234.</li>
            <li>Add Mac, local fallback, autocomplete, and cloud profiles.</li>
            <li>Configure VS Code autocomplete and one approved CLI agent.</li>
            <li>Run validation prompts and confirm fallback behavior.</li>
          </ol>
        </div>
        <div className="checkPanel">
          <h3>Validation checks</h3>
          <ul>
            {checks.map((check) => (
              <li key={check}>{check}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="sectionHeader">
          <p className="eyebrow">Rollout</p>
          <h2>Move from Mac Studio validation to department adoption.</h2>
        </div>
        <ol className="timeline">
          {rollout.map((item, index) => (
            <li key={item}>
              <span>{index + 1}</span>
              <p>{item}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="splitSection" id="security">
        <div>
          <p className="eyebrow">Security and governance</p>
          <h2>Local and cloud providers do not have the same data rules.</h2>
          <p>
            Secrets must stay out of project files, documentation, and model
            memory. Use environment variables or approved credential storage.
            Cloud model use may require explicit approval, named developer
            attribution, spend controls, and logging for high-risk agent work.
          </p>
        </div>
        <div className="callout">
          <strong>Default posture</strong>
          <p>
            Use local or shared LAN inference first. Escalate to cloud only
            when quality requires it and the data is cleared for cloud use.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="sectionHeader">
          <p className="eyebrow">Troubleshooting</p>
          <h2>Fast checks for common failures.</h2>
        </div>
        <div className="troubleGrid">
          {troubleshooting.map(([title, fix]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{fix}</p>
            </article>
          ))}
        </div>
      </section>

      <footer>
        <strong>Content still needed:</strong> exact model names, Mac Studio
        hostname or IP, final port, client versions, OpenRouter policy,
        screenshots, benchmarks, support contacts, and department branding.
      </footer>
    </main>
  );
}
