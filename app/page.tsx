import { CopyButton } from "./CopyButton";

const providers = [
  {
    name: "mac-primary",
    endpoint: "http://10.1.64.228:7777/v1",
    use: "Complex coding, planning, architecture, refactoring, and agent workflows.",
    note: "Shared Mac Studio inference on the AWAKEN wireless LAN using qwen3-coder-30b-a3b-instruct-mlx.",
  },
  {
    name: "local-fallback",
    endpoint: "http://localhost:1234/v1",
    use: "Continuity during outages, local-only questions, simple code help, and chat.",
    note: "Runs Gemma 3 4B Instruct QAT in LM Studio with the local-gemma identifier.",
  },
  {
    name: "local-autocomplete",
    endpoint: "http://localhost:1234/v1",
    use: "Low-latency inline and multiline VS Code completion.",
    note: "Runs Qwen2.5-Coder 1.5B Instruct with the local-autocomplete identifier.",
  },
  {
    name: "local-embeddings",
    endpoint: "http://localhost:1234/v1",
    use: "Local code, notes, and project-memory indexing.",
    note: "Uses Nomic Embed Text v1.5 when embedding support is needed.",
  },
  {
    name: "cloud-openrouter",
    endpoint: "https://openrouter.ai/api/v1",
    use: "Optional free or approved paid cloud models when local quality is insufficient.",
    note: "OpenRouter organization policy, approved model list, and paid-use rules still need to be supplied.",
  },
];

const modelRows = [
  ["Mac Studio primary", "qwen3-coder-30b-a3b-instruct-mlx", "Primary reasoning, architecture, multi-file coding, and agent workflows", "Approved"],
  ["Workstation fallback", "local-gemma", "Local chat, lightweight code assistance, summaries, and fallback inference", "Approved"],
  ["Workstation autocomplete", "local-autocomplete", "Low-latency inline code completion in VS Code", "Approved"],
  ["Embedding model", "text-embedding-nomic-embed-text-v1.5", "Local code, notes, and project-memory indexing", "Approved"],
  ["OpenRouter free", "TBD by policy", "Optional free cloud model access", "Needs policy"],
  ["OpenRouter frontier", "TBD by policy", "Escalation for high-value difficult tasks", "Needs approval rules"],
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
  "Continue chat connection to local-gemma",
  "Continue autocomplete using local-autocomplete",
  "Provider switching and Mac Studio outage fallback",
];

const troubleshooting = [
  ["Mac Studio unreachable", "Confirm the workstation is on AWAKEN and test 10.1.64.228 on port 7777."],
  ["Wrong model identifier", "Copy the exact served model ID: qwen3-coder-30b-a3b-instruct-mlx, local-gemma, or local-autocomplete."],
  ["Client requires API key", "Use a placeholder for local LM Studio if the client requires one."],
  ["Local model not loaded", "Run lms ps and verify local-gemma and local-autocomplete are loaded."],
  ["Autocomplete is slow", "Use local-autocomplete with a 4096-token context and keep it workstation-local."],
  ["Continue not updating", "Reload the VS Code window after editing %USERPROFILE%\\.continue\\config.yaml."],
];

const macStudioPowerShell = [
  '$MacStudio = "10.1.64.228"',
  '$Port = 7777',
  '$Model = "qwen3-coder-30b-a3b-instruct-mlx"',
  '$env:LM_API_TOKEN = "your-token-here"',
  "",
  "Test-NetConnection $MacStudio -Port $Port",
  "",
  "Invoke-RestMethod `",
  '  -Uri "http://${MacStudio}:${Port}/v1/models" `',
  "  -Headers @{ Authorization = \"Bearer $env:LM_API_TOKEN\" }",
  "",
  "$body = @{",
  "  model = $Model",
  "  messages = @(@{ role = \"user\"; content = \"Return only the result of 17 * 23.\" })",
  "  temperature = 0",
  "} | ConvertTo-Json -Depth 5",
  "",
  "$response = Invoke-RestMethod `",
  '  -Uri "http://${MacStudio}:${Port}/v1/chat/completions" `',
  "  -Method Post `",
  "  -Headers @{ Authorization = \"Bearer $env:LM_API_TOKEN\" } `",
  '  -ContentType "application/json" `',
  "  -Body $body",
  "",
  "$response.choices[0].message.content",
].join("\n");

const macStudioTerminal = [
  "lms ps",
  "lsof -nP -iTCP:7777 -sTCP:LISTEN",
  "export LM_API_TOKEN='your-token-here'",
  "curl http://localhost:7777/v1/models \\",
  '  -H "Authorization: Bearer $LM_API_TOKEN"',
].join("\n");

const localServerCommands = [
  "lms server start --port 1234",
  "",
  "lms load google/gemma-3-4b `",
  "  --context-length 8192 `",
  "  --gpu max `",
  "  --identifier local-gemma",
  "",
  "lms load qwen2.5-coder-1.5b-instruct `",
  "  --context-length 4096 `",
  "  --gpu max `",
  "  --identifier local-autocomplete",
  "",
  "lms ps",
  "Invoke-RestMethod http://localhost:1234/v1/models",
].join("\n");

const continueConfig = [
  "name: Department Local AI",
  "version: 1.0.0",
  "schema: v1",
  "",
  "models:",
  "  - name: Local Gemma",
  "    provider: lmstudio",
  "    model: local-gemma",
  "    apiBase: http://localhost:1234/v1",
  "    apiKey: lm-studio",
  "    roles:",
  "      - chat",
  "      - edit",
  "      - apply",
  "      - summarize",
  "    defaultCompletionOptions:",
  "      contextLength: 8192",
  "      temperature: 0.2",
  "",
  "  - name: Local Qwen Autocomplete",
  "    provider: lmstudio",
  "    model: local-autocomplete",
  "    apiBase: http://localhost:1234/v1",
  "    apiKey: lm-studio",
  "    roles:",
  "      - autocomplete",
  "    autocompleteOptions:",
  "      debounceDelay: 250",
  "      maxPromptTokens: 2048",
  "      onlyMyCode: true",
  "      useCache: true",
  "      useImports: true",
  "      useRecentlyEdited: true",
  "      useRecentlyOpened: true",
].join("\n");

const userEnvironmentVariables = [
  "# Persistent user-level variables",
  "[Environment]::SetEnvironmentVariable(",
  '  "MAC_LMSTUDIO_BASE_URL",',
  '  "http://10.1.64.228:7777/v1",',
  '  "User"',
  ")",
  "",
  "[Environment]::SetEnvironmentVariable(",
  '  "MAC_LMSTUDIO_API_KEY",',
  '  "MyKey",',
  '  "User"',
  ")",
  "",
  "[Environment]::SetEnvironmentVariable(",
  '  "LOCAL_LMSTUDIO_BASE_URL",',
  '  "http://localhost:1234/v1",',
  '  "User"',
  ")",
  "",
  "[Environment]::SetEnvironmentVariable(",
  '  "LOCAL_LMSTUDIO_API_KEY",',
  '  "MyKey",',
  '  "User"',
  ")",
  "",
  "[Environment]::SetEnvironmentVariable(",
  '  "LOCAL_FALLBACK_MODEL",',
  '  "local-gemma",',
  '  "User"',
  ")",
  "",
  "[Environment]::SetEnvironmentVariable(",
  '  "LOCAL_AUTOCOMPLETE_MODEL",',
  '  "local-autocomplete",',
  '  "User"',
  ")",
].join("\n");

type EndpointTest = {
  name: string;
  purpose: string;
  command: string;
  expected: string;
  success: string;
  failure: string;
};

type EndpointGroup = {
  title: string;
  tests: EndpointTest[];
  checklist: string[];
};

const macStudioTests: EndpointTest[] = [
  {
    name: "Mac Test 1: Confirm Base URL Environment Variable",
    purpose: "Verify that PowerShell can read the persistent Mac Studio base URL.",
    command: "$env:MAC_LMSTUDIO_BASE_URL",
    expected: "http://10.1.64.228:7777/v1",
    success: "The exact configured URL is displayed.",
    failure: "If the value is blank, close PowerShell, open a new PowerShell window, and test again. If it remains blank, recreate the user-level environment variable.",
  },
  {
    name: "Mac Test 2: Confirm API Key Environment Variable Exists",
    purpose: "Verify that the API key variable is available without printing the secret value.",
    command: [
      "if ([string]::IsNullOrWhiteSpace($env:MAC_LMSTUDIO_API_KEY)) {",
      '  "MAC_LMSTUDIO_API_KEY is missing"',
      "} else {",
      '  "MAC_LMSTUDIO_API_KEY is configured"',
      "}",
    ].join("\n"),
    expected: "MAC_LMSTUDIO_API_KEY is configured",
    success: "PowerShell confirms that the variable contains a value.",
    failure: "Recreate the user-level API key variable, then open a new PowerShell window.",
  },
  {
    name: "Mac Test 3: Test LAN Port Connectivity",
    purpose: "Verify that the Windows workstation can reach the Mac Studio LM Studio server over the LAN.",
    command: "Test-NetConnection 10.1.64.228 -Port 7777",
    expected: "TcpTestSucceeded : True",
    success: "TcpTestSucceeded is True.",
    failure: "Check the Mac Studio IP address, LM Studio server state, port configuration, network routing, and firewall rules.",
  },
  {
    name: "Mac Test 4: List Available Models",
    purpose: "Confirm that the OpenAI-compatible /models endpoint responds and that authentication is accepted.",
    command: [
      "Invoke-RestMethod `",
      '  -Uri "$env:MAC_LMSTUDIO_BASE_URL/models" `',
      "  -Headers @{",
      '    Authorization = "Bearer $env:MAC_LMSTUDIO_API_KEY"',
      "  }",
    ].join("\n"),
    expected: [
      "The response should include model records similar to:",
      "qwen3-coder-30b-a3b-instruct-mlx",
      "text-embedding-nomic-embed-text-v1.5",
    ].join("\n"),
    success: "The data collection contains the currently loaded Mac Studio models.",
    failure: "Confirm LM Studio is running, the server is started, the model is loaded, the base URL ends in /v1, and the API key matches the server configuration.",
  },
  {
    name: "Mac Test 5: Chat Completions Inference",
    purpose: "Validate the /chat/completions endpoint using the loaded Mac Studio chat model.",
    command: [
      "$body = @{",
      '  model = "qwen3-coder-30b-a3b-instruct-mlx"',
      "  messages = @(",
      "    @{",
      '      role = "user"',
      '      content = "Reply with exactly: Mac Studio inference successful"',
      "    }",
      "  )",
      "  temperature = 0",
      "  max_tokens = 30",
      "} | ConvertTo-Json -Depth 5",
      "",
      "$response = Invoke-RestMethod `",
      '  -Uri "$env:MAC_LMSTUDIO_BASE_URL/chat/completions" `',
      "  -Method Post `",
      "  -Headers @{",
      '    Authorization = "Bearer $env:MAC_LMSTUDIO_API_KEY"',
      '    "Content-Type" = "application/json"',
      "  } `",
      "  -Body $body",
      "",
      "$response.choices[0].message.content",
    ].join("\n"),
    expected: "Mac Studio inference successful",
    success: "The model returns the expected response text.",
    failure: "Confirm the exact model ID using the /models test and verify that the model is loaded in LM Studio.",
  },
  {
    name: "Mac Test 6: Responses Endpoint",
    purpose: "Validate the OpenAI-compatible /responses endpoint.",
    command: [
      "$body = @{",
      '  model = "qwen3-coder-30b-a3b-instruct-mlx"',
      '  input = "Reply with exactly: Responses endpoint successful"',
      "  max_output_tokens = 30",
      "} | ConvertTo-Json -Depth 5",
      "",
      "$response = Invoke-RestMethod `",
      '  -Uri "$env:MAC_LMSTUDIO_BASE_URL/responses" `',
      "  -Method Post `",
      "  -Headers @{",
      '    Authorization = "Bearer $env:MAC_LMSTUDIO_API_KEY"',
      '    "Content-Type" = "application/json"',
      "  } `",
      "  -Body $body",
      "",
      "$response.output",
    ].join("\n"),
    expected: "The response should contain an assistant message with text similar to:\nResponses endpoint successful",
    success: "The returned object has a completed assistant message containing the expected text.",
    failure: "Confirm that the installed LM Studio version supports the /responses endpoint and that the model is loaded.",
  },
  {
    name: "Mac Test 7: Legacy Completions Endpoint",
    purpose: "Validate the legacy /completions endpoint for tools that still use prompt-based completions.",
    command: [
      "$body = @{",
      '  model = "qwen3-coder-30b-a3b-instruct-mlx"',
      '  prompt = "Reply with exactly: Completions endpoint successful"',
      "  temperature = 0",
      "  max_tokens = 30",
      "} | ConvertTo-Json",
      "",
      "$response = Invoke-RestMethod `",
      '  -Uri "$env:MAC_LMSTUDIO_BASE_URL/completions" `',
      "  -Method Post `",
      "  -Headers @{",
      '    Authorization = "Bearer $env:MAC_LMSTUDIO_API_KEY"',
      '    "Content-Type" = "application/json"',
      "  } `",
      "  -Body $body",
      "",
      "$response.choices[0].text",
    ].join("\n"),
    expected: "Completions endpoint successful",
    success: "The choices[0].text value contains the expected text.",
    failure: "Confirm that the client requires the legacy endpoint. Prefer /chat/completions or /responses for new integrations.",
  },
  {
    name: "Mac Test 8: Embeddings Endpoint",
    purpose: "Validate the /embeddings endpoint using the Mac Studio embedding model.",
    command: [
      "$body = @{",
      '  model = "text-embedding-nomic-embed-text-v1.5"',
      '  input = "Test embedding from the Mac Studio"',
      "} | ConvertTo-Json",
      "",
      "$response = Invoke-RestMethod `",
      '  -Uri "$env:MAC_LMSTUDIO_BASE_URL/embeddings" `',
      "  -Method Post `",
      "  -Headers @{",
      '    Authorization = "Bearer $env:MAC_LMSTUDIO_API_KEY"',
      '    "Content-Type" = "application/json"',
      "  } `",
      "  -Body $body",
      "",
      "$response.data[0] | Select-Object index, object, embedding",
    ].join("\n"),
    expected: "index object    embedding\n----- ------    ---------\n0     embedding {-0.0117, 0.0462, -0.1728, ...}",
    success: "The response contains an embedding array with many decimal values.",
    failure: "Confirm that the embedding model is loaded and use the exact embedding model ID returned by /models.",
  },
];

const localWorkstationTests: EndpointTest[] = [
  {
    name: "Local Test 1: Confirm Base URL Environment Variable",
    purpose: "Verify that PowerShell can read the local LM Studio base URL.",
    command: "$env:LOCAL_LMSTUDIO_BASE_URL",
    expected: "http://localhost:1234/v1",
    success: "The exact configured local URL is displayed.",
    failure: "Open a new PowerShell window or recreate the persistent environment variable.",
  },
  {
    name: "Local Test 2: Confirm API Key Environment Variable Exists",
    purpose: "Verify that the local API key variable is available without printing its value.",
    command: [
      "if ([string]::IsNullOrWhiteSpace($env:LOCAL_LMSTUDIO_API_KEY)) {",
      '  "LOCAL_LMSTUDIO_API_KEY is missing"',
      "} else {",
      '  "LOCAL_LMSTUDIO_API_KEY is configured"',
      "}",
    ].join("\n"),
    expected: "LOCAL_LMSTUDIO_API_KEY is configured",
    success: "PowerShell confirms that the variable contains a value.",
    failure: "Recreate the persistent user-level variable and restart PowerShell.",
  },
  {
    name: "Local Test 3: Test Local Port Connectivity",
    purpose: "Verify that LM Studio is listening on the workstation.",
    command: "Test-NetConnection localhost -Port 1234",
    expected: "TcpTestSucceeded : True",
    success: "TcpTestSucceeded is True.",
    failure: "Start the LM Studio local server and confirm it is configured to use port 1234.",
  },
  {
    name: "Local Test 4: List Available Models",
    purpose: "Confirm that the local /models endpoint responds and shows both workstation models.",
    command: [
      "Invoke-RestMethod `",
      '  -Uri "$env:LOCAL_LMSTUDIO_BASE_URL/models" `',
      "  -Headers @{",
      '    Authorization = "Bearer $env:LOCAL_LMSTUDIO_API_KEY"',
      "  }",
    ].join("\n"),
    expected: "The response should include:\nlocal-gemma\nlocal-autocomplete",
    success: "Both configured model identifiers appear in the data collection.",
    failure: "Confirm that both models are loaded in LM Studio and that their identifiers match the environment variables.",
  },
  {
    name: "Local Test 5: Verify Fallback Model Variable",
    purpose: "Confirm that the local fallback model identifier is available.",
    command: "$env:LOCAL_FALLBACK_MODEL",
    expected: "local-gemma",
    success: "The displayed identifier matches the loaded fallback model.",
    failure: "Recreate the environment variable or align it with the identifier shown by /models.",
  },
  {
    name: "Local Test 6: Fallback Chat Inference",
    purpose: "Validate local chat inference using the fallback model.",
    command: [
      "$body = @{",
      "  model = $env:LOCAL_FALLBACK_MODEL",
      "  messages = @(",
      "    @{",
      '      role = "user"',
      '      content = "Reply with exactly: Local fallback inference successful"',
      "    }",
      "  )",
      "  temperature = 0",
      "  max_tokens = 30",
      "} | ConvertTo-Json -Depth 5",
      "",
      "$response = Invoke-RestMethod `",
      '  -Uri "$env:LOCAL_LMSTUDIO_BASE_URL/chat/completions" `',
      "  -Method Post `",
      "  -Headers @{",
      '    Authorization = "Bearer $env:LOCAL_LMSTUDIO_API_KEY"',
      '    "Content-Type" = "application/json"',
      "  } `",
      "  -Body $body",
      "",
      "$response.choices[0].message.content",
    ].join("\n"),
    expected: "Local fallback inference successful",
    success: "The local fallback model produces the expected response.",
    failure: "Confirm that local-gemma is loaded and that the identifier exactly matches the /models response.",
  },
  {
    name: "Local Test 7: Verify Autocomplete Model Variable",
    purpose: "Confirm that the local autocomplete model identifier is available.",
    command: "$env:LOCAL_AUTOCOMPLETE_MODEL",
    expected: "local-autocomplete",
    success: "The displayed identifier matches the loaded autocomplete model.",
    failure: "Recreate the environment variable or align it with the identifier shown by /models.",
  },
  {
    name: "Local Test 8: Autocomplete Model Inference",
    purpose: "Validate that the autocomplete model can generate code-oriented output.",
    command: [
      "$body = @{",
      "  model = $env:LOCAL_AUTOCOMPLETE_MODEL",
      "  messages = @(",
      "    @{",
      '      role = "system"',
      '      content = "You are a code completion engine. Reply with exactly one C# return statement. Do not use markdown, classes, methods, explanations, or code fences."',
      "    }",
      "    @{",
      '      role = "user"',
      '      content = "Complete the body of this method: int Add(int a, int b) { }"',
      "    }",
      "  )",
      "  temperature = 0",
      "  max_tokens = 40",
      "} | ConvertTo-Json -Depth 5",
      "",
      "$response = Invoke-RestMethod `",
      '  -Uri "$env:LOCAL_LMSTUDIO_BASE_URL/chat/completions" `',
      "  -Method Post `",
      "  -Headers @{",
      '    Authorization = "Bearer $env:LOCAL_LMSTUDIO_API_KEY"',
      '    "Content-Type" = "application/json"',
      "  } `",
      "  -Body $body",
      "",
      "$response.choices[0].message.content",
    ].join("\n"),
    expected: "return a + b;",
    success: "The autocomplete model returns one valid C# return statement without markdown, a class scaffold, or an explanation.",
    failure: "If the response starts a full program, includes a code fence, or cuts off mid-output, the endpoint is reachable but the autocomplete behavior failed. Confirm local-autocomplete is loaded, then rerun this stricter prompt.",
  },
];

const endpointGroups: EndpointGroup[] = [
  {
    title: "Mac Studio LM Studio Tests",
    tests: macStudioTests,
    checklist: [
      "Base URL detected",
      "API key variable detected",
      "Port 7777 reachable",
      "Models endpoint passed",
      "Chat completions passed",
      "Responses endpoint passed",
      "Legacy completions passed",
      "Embeddings endpoint passed",
    ],
  },
  {
    title: "Local Workstation LM Studio Tests",
    tests: localWorkstationTests,
    checklist: [
      "Base URL detected",
      "API key variable detected",
      "Port 1234 reachable",
      "Models endpoint passed",
      "Fallback model detected",
      "Fallback inference passed",
      "Autocomplete model detected",
      "Autocomplete inference passed",
    ],
  },
];

type OnboardingStep = {
  title: string;
  summary: string;
  details: string[];
  codeTitle?: string;
  code?: string;
  extraCodeTitle?: string;
  extraCode?: string;
};

const onboardingSteps: OnboardingStep[] = [
  {
    title: "Confirm Mac Studio endpoint access",
    summary: "Verify the workstation can reach the shared Mac Studio inference server.",
    details: [
      "Network target: 10.1.64.228 on port 7777.",
      "Required network: AWAKEN wireless LAN.",
      "Provider base URL: http://10.1.64.228:7777/v1.",
      "Primary model ID: qwen3-coder-30b-a3b-instruct-mlx.",
      "Expected inference output for 17 * 23: 391.",
      "Do not commit API tokens to Git, project memory, scripts, or documentation.",
    ],
    codeTitle: "Windows PowerShell validation",
    code: macStudioPowerShell,
    extraCodeTitle: "Mac Studio local checks",
    extraCode: macStudioTerminal,
  },
  {
    title: "Install LM Studio",
    summary: "Install the latest LM Studio release and verify the CLI is available.",
    details: [
      "Approved installer source: https://lmstudio.ai/download.",
      "Required version: latest available release.",
      "CLI verification command: lms --version.",
    ],
  },
  {
    title: "Download approved local workstation models",
    summary: "Install the fallback, autocomplete, and embedding models used by the department baseline.",
    details: [
      "Tested workstation: Windows 11, 64 GB RAM, NVIDIA RTX A2000 with 6 GB VRAM.",
      "Fallback: Gemma 3 4B Instruct QAT, LM Studio model google/gemma-3-4b, identifier local-gemma, QAT Q4_0, 3.21 GB, 8192 context.",
      "Autocomplete: Qwen2.5-Coder 1.5B Instruct, model qwen2.5-coder-1.5b-instruct, identifier local-autocomplete, Q4_K_M, 1.12 GB, 4096 context.",
      "Embeddings: Nomic Embed Text v1.5, model text-embedding-nomic-embed-text-v1.5, 84.11 MB.",
      "Confirmed downloaded footprint: three models, 4.42 GB total.",
    ],
  },
  {
    title: "Start the local LM Studio API",
    summary: "Run the workstation API on localhost and load both approved local models.",
    details: [
      "Required port: 1234.",
      "Base URL: http://localhost:1234/v1.",
      "Authentication: local requests currently work without a Bearer token.",
      "Use lm-studio as the API key value when a client requires a nonblank value.",
      "Both models can remain loaded at the same time with maximum GPU offload.",
    ],
    codeTitle: "PowerShell model loading and validation",
    code: localServerCommands,
  },
  {
    title: "Add provider profiles",
    summary: "Use stable profile names so tools and support instructions stay consistent.",
    details: [
      "mac-primary: http://10.1.64.228:7777/v1, model qwen3-coder-30b-a3b-instruct-mlx, Bearer token from LM_API_TOKEN.",
      "local-fallback: http://localhost:1234/v1, model local-gemma, API key lm-studio when required, 8192 context.",
      "local-autocomplete: http://localhost:1234/v1, model local-autocomplete, API key lm-studio when required, 4096 context.",
    ],
  },
  {
    title: "Set suggested user environment variables",
    summary: "Persist shared endpoint names and model identifiers for tools that read from the Windows user environment.",
    details: [
      "Run this in PowerShell as the developer user, not inside a project script.",
      "Replace <MAC_STUDIO_IP> with the current Mac Studio address before running.",
      "Open a new terminal after setting user-level variables so the session sees the updated values.",
      "Do not store real secret tokens in Git or project documentation.",
    ],
    codeTitle: "PowerShell user environment",
    code: userEnvironmentVariables,
  },
  {
    title: "Configure VS Code Continue",
    summary: "Point Continue chat at local-gemma and autocomplete at local-autocomplete.",
    details: [
      "Install the Continue extension published by Continue.",
      "Enable VS Code setting Editor: Inline Suggest.",
      "Open Continue, select the configuration selector, then the gear beside Local Config.",
      "On Windows, edit %USERPROFILE%\\.continue\\config.yaml.",
      "After saving, reload the Continue configuration or run Developer: Reload Window.",
      "Validate autocomplete in a C# file, then ask Continue chat: Return only the result of 17 * 23.",
      "Expected chat result: 391.",
    ],
    codeTitle: "Continue config.yaml",
    code: continueConfig,
  },
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
          <a href="#choose">Providers</a>
          <a href="#catalog">Models</a>
          <a href="#setup">Setup</a>
          <a href="#validation">Validation</a>
          <a href="#security">Security</a>
        </div>
      </nav>

      <section className="hero" id="top">
        <div className="heroCopy">
          <p className="eyebrow">Department developer guide</p>
          <h1>Use the right AI provider for the job.</h1>
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

        <div className="systemVisual">
          <img
            src="/endpoint-hub-diagram.png"
            alt="Mac Studio, workstation, OpenRouter, and other cloud providers routed through an LLM endpoint hub into developer tools."
          />
        </div>
      </section>

      <section className="section" id="architecture">
        <div className="sectionHeader">
          <p className="eyebrow">Architecture</p>
          <h2>Three layers, one OpenAI-compatible workflow.</h2>
          <p>
            The complete endpoint identity is host plus port plus model ID.
            The Mac Studio is available on the AWAKEN wireless LAN, while
            workstation-local inference runs on localhost.
          </p>
        </div>
        <div className="codePanel" aria-label="Example endpoints">
          <code>Mac Studio: http://10.1.64.228:7777/v1</code>
          <code>Local workstation: http://localhost:1234/v1</code>
          <code>Local API key placeholder: lm-studio</code>
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
            The local baseline has exact identifiers now. Cloud model policy,
            paid-model approvals, and final support ownership still need to be
            added before department-wide rollout.
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
          <ol className="steps expandableSteps">
            {onboardingSteps.map((step, index) => (
              <li key={step.title}>
                <details>
                  <summary>
                    <span>{index + 1}</span>
                    <div>
                      <strong>{step.title}</strong>
                      <p>{step.summary}</p>
                    </div>
                  </summary>
                  <div className="stepBody">
                    <ul>
                      {step.details.map((detail) => (
                        <li key={detail}>{detail}</li>
                      ))}
                    </ul>
                    {step.code ? (
                      <div className="snippetGroup">
                        <h4>{step.codeTitle}</h4>
                        <pre>
                          <code>{step.code}</code>
                        </pre>
                      </div>
                    ) : null}
                    {step.extraCode ? (
                      <div className="snippetGroup">
                        <h4>{step.extraCodeTitle}</h4>
                        <pre>
                          <code>{step.extraCode}</code>
                        </pre>
                      </div>
                    ) : null}
                  </div>
                </details>
              </li>
            ))}
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

      <section className="section" id="validation">
        <div className="sectionHeader">
          <p className="eyebrow">Endpoint validation</p>
          <h2>LM Studio Connection and Endpoint Validation</h2>
          <p>
            Run these tests in order when setting up a workstation, or run a
            single card during troubleshooting. The persistent user-level
            environment variables must already exist; open a new PowerShell
            window after creating or changing them.
          </p>
        </div>

        <div className="prereqPanel">
          <div className="snippetHeader">
            <h4>Required user-level variables</h4>
            <CopyButton text={userEnvironmentVariables} />
          </div>
          <pre>
            <code className="language-powershell">{userEnvironmentVariables}</code>
          </pre>
        </div>

        <div className="validationGroups">
          {endpointGroups.map((group) => (
            <section className="validationGroup" key={group.title}>
              <h3>{group.title}</h3>
              <div className="testGrid">
                {group.tests.map((test) => (
                  <details className="testCard" key={test.name}>
                    <summary>
                      <span className="passBadge">Expected: Pass</span>
                      <strong>{test.name}</strong>
                      <p>{test.purpose}</p>
                    </summary>
                    <div className="testBody">
                      <div className="snippetHeader">
                        <h4>PowerShell command</h4>
                        <CopyButton text={test.command} />
                      </div>
                      <pre>
                        <code className="language-powershell">{test.command}</code>
                      </pre>
                      <div className="expectedBlock">
                        <h4>Expected result</h4>
                        <pre>
                          <code>{test.expected}</code>
                        </pre>
                      </div>
                      <p>
                        <strong>Success criteria:</strong> {test.success}
                      </p>
                      <p>
                        <strong>Troubleshooting:</strong> {test.failure}
                      </p>
                    </div>
                  </details>
                ))}
              </div>
              <div className="validationChecklist">
                <h4>{group.title.replace("Tests", "Validation Checklist")}</h4>
                <ul>
                  {group.checklist.map((item) => (
                    <li key={item}>[ ] {item}</li>
                  ))}
                </ul>
              </div>
            </section>
          ))}
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
        <strong>Content still needed:</strong> OpenRouter organization policy,
        approved cloud model list, paid-use rules, CLI agent setup beyond
        Continue, screenshots, support contacts, and department branding.
      </footer>
    </main>
  );
}
