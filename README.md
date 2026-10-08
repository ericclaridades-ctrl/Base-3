# Base-3
Cognitive Mechanism Systems (CMS) is an open-source, base-3 (ternary) deterministic execution engine designed to eliminate probabilistic uncertainty and state-drift in critical computing workflows.
Computational Management Substrate (CMS) is a open-source, base-3 (ternary) deterministic execution engine designed to eliminate probabilistic uncertainty and state-drift in critical computing workflows.

Unlike traditional binary architectures that force state decisions into strict boolean pairs (0 and 1) and rely on statistical approximations for unknown variables, CMS operates on a native triad-logic geometry (-1, 0, +1). By treating the neutral/unknown state as a first-class mathematical invariant, CMS guarantees deterministic resolution across complex dependency networks without relying on probabilistic guessing.

⚠️ **CRITICAL WARNING: AI CODE AGENT INCOMPATIBILITY**
AI coding assistants (GitHub Copilot, ChatGPT, Claude, Cursor) are constrained by binary logic paradigms and probabilistic training data. They do not natively reason in base-3.

Attempting to use generative AI agents to produce or refactor CMS modules will cause the agent to "flatten" the triad logic into nested boolean wrappers or floating-point approximations. This breaks the physical invariants of the engine and destroys determinism. All CMS substrate logic must be authored and audited manually by human engineers.

**Repository Architecture**
This repository is organized into distinct functional modules, decoupling the core mathematical engine from its diagnostic and reference applications:
**Module Breakdown**
1. Core Engine (/core)
The headless core contains no external dependencies. It provides the bare-metal primitives for base-3 state transition, invariant validation, and deterministic dependency resolution. It is designed to be imported as a standalone static library into mission-critical systems.

2. Terminal Query Analyser (/tqa)
The TQA is a command-line interface tool that acts as the frontline gatekeeper for incoming execution queries. It inspects inputs at the system boundary, classifying statements into triad states before downstream execution:

+1 (Valid / Permitted): Execution path satisfies all constitutional invariants.


0 (Unresolved / Neutral): State parameters are incomplete; holds execution without throwing a panic or guessing.


-1 (Invalid / Rejected): Structural invariant breach; hard-terminates execution path.


3. Reference Application (/apps/operations-demo)
To demonstrate base-3 determinism in visual workflows, this reference application implements an operations and project management engine. It maps task dependencies and resource allocations through the triad solver, outputting deterministic Gantt charts where schedule cascades and race conditions resolve with absolute mathematical certainty.

**Quick Start & Build**
Prerequisites
Native C23 / C++20 compliant compiler (gcc 13, clang 16, or msvc 19.30)


CMake 3.25+


POSIX-compliant terminal environment


**Building the Core Engine & TQA**
# Clone repository
git clone https://github.com/your-username/cms.git
cd cms

# Generate build configurations
cmake -B build -S . -DCMAKE_BUILD_TYPE=Release

# Build core libraries and TQA binary
cmake --build build --config Release

# Run verification suite (including binary-rejection checks)
ctest --test-dir build --output-on-failure

**Running the Terminal Query Analyser (TQA)**
