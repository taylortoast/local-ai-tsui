import Link from "next/link";
import { CopyButton } from "../CopyButton";

const config = `name: Main Config
version: 1.0.0
schema: v1

models:
  - name: Local Autocomplete
    provider: openai
    model: local-autocomplete
    apiBase: http://localhost:1234/v1
    apiKey: lm-studio
    roles:
      - autocomplete`;

const loadCommand = `lms load qwen2.5-coder-3b-instruct \
  --identifier local-autocomplete \
  --context-length 4096 \
  --gpu max \
  --ttl 3600`;

const prerequisites = ["code --version", "dotnet --version", "lms --version"].join("\n");

const steps = [
  {
    title: "Install and verify prerequisites",
    purpose: "Confirm the Windows workstation has the editor, C# tooling, LM Studio CLI, and PowerShell needed for the setup.",
    command: prerequisites,
    expected: "Each command returns a version number without an error.",
    validation: "If a command is missing, install the corresponding tool and open a new PowerShell window.",
  },
  {
    title: "Install Continue in VS Code",
    purpose: "Add the Continue extension that provides inline autocomplete inside the editor.",
    command: `code --list-extensions | Select-String -Pattern "^Continue\\.continue$"\n\ncode --install-extension Continue.continue`,
    expected: "Continue.continue appears in the extension list. After restarting VS Code, the Continue icon appears in the activity sidebar.",
    validation: "Run the install command only when the first command does not return Continue.continue.",
  },
  {
    title: "Load the approved 3B model in LM Studio",
    purpose: "Replace the rejected 1.5B autocomplete baseline with the stronger local model and stable server identifier.",
    command: `${loadCommand}\n\nlms ps`,
    expected: "local-autocomplete is loaded from qwen2.5-coder-3b-instruct with context 4096, parallel requests 4, device Local, and TTL 1 hour.",
    validation: "The exact spacing in lms ps may vary; confirm the identifier, model, context, and loaded state.",
  },
  {
    title: "Open Continue Main Config",
    purpose: "Open the local Continue configuration that VS Code will use for autocomplete.",
    command: "Open Continue → gear icon → Configs → Main Config → gear icon",
    expected: "The local file C:\\Users\\<username>\\.continue\\config.yaml opens.",
    validation: "The username is workstation-specific; keep the .continue\\config.yaml location unchanged.",
  },
  {
    title: "Configure the autocomplete model",
    purpose: "Connect Continue to LM Studio’s OpenAI-compatible localhost endpoint and restrict the model to autocomplete.",
    command: config,
    expected: "Ctrl+S saves without YAML or model configuration errors.",
    validation: "Confirm apiBase ends in /v1, model is local-autocomplete, and roles contains only autocomplete for this profile.",
  },
  {
    title: "Reload VS Code",
    purpose: "Clear cached Continue autocomplete state after changing the model configuration.",
    command: "Ctrl+Shift+P → Developer: Reload Window",
    expected: "VS Code reloads and Continue is available again.",
    validation: "If completions remain stale, reload once more after confirming LM Studio still shows local-autocomplete loaded.",
  },
  {
    title: "Create a real C# validation workspace",
    purpose: "Give the C# extension a project context instead of loose files that produce solution warnings.",
    command: "mkdir ContinueAutocompleteTest\ncd ContinueAutocompleteTest\ndotnet new console\ncode .",
    expected: "Program.cs, ContinueAutocompleteTest.csproj, and obj/ appear. The C# extension finishes loading.",
    validation: "Wait for C# tooling to finish before testing autocomplete.",
  },
];

function Step({ step, index }: { step: (typeof steps)[number]; index: number }) {
  return (
    <li>
      <details open={index === 0}>
        <summary>
          <span>{index + 1}</span>
          <div>
            <strong>{step.title}</strong>
            <p>{step.purpose}</p>
          </div>
        </summary>
        <div className="stepBody">
          <div className="commandBlock">
            <div className="snippetHeader"><h4>Command or action</h4><CopyButton text={step.command} /></div>
            <pre><code>{step.command}</code></pre>
          </div>
          <div className="expectedBlock">
            <h4>Expected result</h4>
            <pre><code>{step.expected}</code></pre>
          </div>
          <p><strong>Validation:</strong> {step.validation}</p>
        </div>
      </details>
    </li>
  );
}

export default function ContinueAutocompletePage() {
  return (
    <main>
      <nav className="topbar" aria-label="Primary navigation">
        <Link className="brand" href="/"><img src="/favicon.svg" alt="" /><span>Local AI Platform</span></Link>
        <div className="navlinks">
          <a href="#setup">Setup</a>
          <a href="#validation">Validation</a>
          <a href="#troubleshooting">Troubleshooting</a>
          <Link href="/">Main guide</Link>
        </div>
      </nav>

      <section className="hero" id="top">
        <div className="heroCopy">
          <p className="eyebrow">VS Code workstation guide</p>
          <h1>Local autocomplete, upgraded.</h1>
          <p>The approved 3B autocomplete baseline replaces the weaker 1.5B model while keeping inference local to each Windows developer workstation.</p>
          <div className="heroActions"><a href="#setup">Start setup</a><a href="#validation">Run validation</a></div>
        </div>
        <div className="codePanel"><code>VS Code → Continue → LM Studio</code><code>http://localhost:1234/v1</code><code>local-autocomplete → qwen2.5-coder-3b-instruct</code></div>
      </section>

      <section className="section" id="setup">
        <div className="sectionHeader"><p className="eyebrow">Install and configure</p><h2>Follow the workstation setup in order.</h2><p>Each block names the change, its purpose, the exact action, the expected result, and the checkpoint that proves it worked.</p></div>
        <ol className="steps expandableSteps">{steps.map((step, index) => <Step key={step.title} step={step} index={index} />)}</ol>
      </section>

      <section className="section" id="validation">
        <div className="sectionHeader"><p className="eyebrow">Validation tests</p><h2>Check context, intent, and the server request.</h2></div>
        <div className="testGrid">
          <article className="providerCard"><h3>Test 1: Existing variable context</h3><pre><code>{`string message = "Hello from local AI";\nConsole.WriteLine(`}</code></pre><p>Pause 3–5 seconds. Continue should suggest <code>message</code> or <code>message);</code>. Press Tab to accept.</p><small>Passed with the 3B model: it reused the nearby variable.</small></article>
          <article className="providerCard"><h3>Test 2: Comment-guided loop</h3><pre><code>{`// Print numbers 1 through 5, one per line`}</code></pre><p>Pause 3–5 seconds. The suggestion should begin a loop such as <code>for (int i = 1; i &lt;= 5; i++)</code>.</p><small>Longer completions may arrive as several Tab-accepted chunks.</small></article>
          <article className="providerCard"><h3>Test 3: LM Studio request</h3><p>Confirm the LM Studio log receives <code>POST /v1/completions</code> for <code>local-autocomplete</code>.</p><small>Fill-in-the-middle markers such as &lt;fim_prefix&gt; and &lt;fim_suffix&gt; are healthy. Client disconnected is normal when Continue replaces stale typing context.</small></article>
        </div>
      </section>

      <section className="splitSection" id="troubleshooting">
        <div><p className="eyebrow">Troubleshooting</p><h2>Fix the common failures quickly.</h2><div className="troubleGrid"><article><h3>No autocomplete</h3><p>Run <code>lms ps</code>, confirm local-autocomplete is loaded, then run Developer: Reload Window.</p></article><article><h3>Weak suggestion</h3><p>Pause after typing, use the real .csproj workspace, and add nearby context or a concise intent comment.</p></article><article><h3>No solution file</h3><p>Run <code>dotnet new console</code> in a test folder and reopen it with <code>code .</code>.</p></article><article><h3>Continue Output missing</h3><p>Use Developer: Toggle Developer Tools and inspect the Console for continue, autocomplete, completion, or error.</p></article><article><h3>Client disconnected</h3><p>This can be normal when Continue cancels an outdated completion after the editor changes.</p></article><article><h3>Wrong configuration</h3><p>Check the endpoint is localhost, the model is local-autocomplete, and the role is autocomplete.</p></article></div></div>
        <div className="callout"><strong>Network boundary</strong><p>Autocomplete sends source context only to the local workstation endpoint. Do not replace localhost with the Mac Studio LAN address for this profile.</p></div>
      </section>

      <section className="section"><div className="sectionHeader"><p className="eyebrow">Model decision</p><h2>Why the 3B model is the baseline.</h2><p>The rejected qwen2.5-coder-1.5b-instruct connected successfully but was inconsistent, weak on comment-guided generation, and insufficient for multiline quality. qwen2.5-coder-3b-instruct showed stronger contextual and intent-driven C# suggestions while remaining small enough for local execution.</p></div><div className="checkPanel"><h3>Rollout checklist</h3><ul><li>Continue installed</li><li>LM Studio server running on port 1234</li><li>3B model loaded as local-autocomplete</li><li>Continue config saved and VS Code reloaded</li><li>Both C# validation tests passed</li><li>LM Studio request observed</li></ul></div></section>
    </main>
  );
}
