@base3/core
![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL_3.0-blue.svg)
![Runtime: Node >= 18](https://img.shields.io/badge/Node-%3E%3D18.0.0-green.svg)
![Architecture: Headless & Limbless](https://img.shields.io/badge/Architecture-Headless_%26_Limbless-purple.svg)
![Epistemic Engine: Base--3](https://img.shields.io/badge/Epistemic_Engine-Base--3_Triad-orange.svg)
> **Headless, limbless multimodal physical arbitration & topological coherence engine.**  
> Anchoring Vision-Language Models (VLMs) and Generative AI in deterministic real-world domain physics through Base-3 epistemic consensus.
---
A Note on Domain Agnosticism: Base-3 is a fundamentally domain-agnostic execution substrate capable of governing any spatial, physical, or logical workflow. To make the abstract mathematics of the epistemic triad concrete and observable, this documentation relies heavily on examples from Architecture, Engineering, and Construction (AEC). We utilize construction as our primary illustrative model because its high physical complexity, extreme visual entropy, and mature scheduling processes provide the perfect crucible for demonstrating deterministic AI execution.

1. The Base-3 Philosophy
Why Binary Logic (Base-2) Collapses in Physical Reality
Classical computing and current artificial intelligence operate in Base-2—binary epistemological frameworks: True vs False, Prompt vs Completion, Synthetic vs Observed. When applied to complex physical systems (construction sites, aerospace manufacturing, civil infrastructure, and spatial robotics), Base-2 assumptions fail catastrophically:
Multimodal Hallucination & Foreshortening: Vision-Language Models (VLMs) analyzing 2D camera feeds cannot intuit 3D scale, perspective occlusions, or isometric foreshortening. A model routinely drops or invents entire structural levels based solely on camera angle.
Transient Environmental Entropy: Scaffolding, tower cranes, mobile machinery, shadows, and weather changes visually mimic permanent structural geometry, triggering false completion signals.
Decoupled Administrative Intent: CPM Gantt schedules and BIM models represent idealized contractual declarations that are chronically out of sync with real-world physical ground truth.
The Base-3 Triad Architecture
Base-3 rejects the premise that any single observation vector holds sovereign authority. Reality is not an authoritarian decree; it is a triangulated mathematical consensus across three orthogonal vectors:
```
                      [Vector D: Synthetic Intent]
                   (CAD Silhouette / Baseline Model)
                                  /\
                                 /  \
                                /    \
                               /  Ω   \
                              / Triad  \
                             / Consensus\
                            /____________\
      [Vector Admin: Symbolic Law]    [Vector RW: Empirical State]
       (Contractual DAG Schedule)       (Photometric / Sensor Feeds)
```
Vector 1: Synthetic Intent $[D]$: The idealized geometric and spatial design baseline (CAD silhouette, BIM profile, target envelope).
Vector 2: Symbolic Constraints $[Admin]$: The contractual, logical dependency matrix (Directed Acyclic Graph schedules, WBS tiers, predecessors, time layers).
Vector 3: Empirical Observation $[RW]$: Real-world sensory inputs (photogrammetry, site photography, optical camera feeds).
---
2. Invariant Governance: The Constitution Vector
`@base3/core` contains zero hardcoded industry strings or fixed architectural dimensions. The core substrate is completely domain-agnostic. All arbitration is governed by an instantiated Constitution Payload (The Vector) enforcing six immutable Cardinal Rules:
The Six Cardinal Rules of Base-3
Domain-Agnostic Entity Mapping:
The engine treats all inputs as abstract $[Entities]$ with topological dependencies. It does not assume floors, slabs, or walls; it calculates relational progression across arbitrary physical modules (fuselage ribs, highway spans, bridge caissons, or building levels).
Strict Epistemic Triad Evaluation (No Ungrounded Averaging):
The system does not smooth over conflicts. If $[Admin]$ specifies 30 units and $[D]$ depicts 28 units, the engine measures and reports the exact Epistemic Drift (Variance: 2 units) and bounds the evaluation accordingly.
Scale Enforcement & Physical Truth-Maintenance $[P_TRUTH]$:
Hardware optical physics (EXIF focal length/sensor metrics) and user-supplied dimensional baselines construct an unbreachable constraint matrix $[P_TRUTH]$. If visual model inference attempts to exceed these physical bounds, the system truncates the hallucination, defers to $[P_TRUTH]$, and flags a `geometry_drift` event.
Sovereign Cognitive Priors (80/20 Substrate):
A two-tiered cognitive ignore engine discards ambient site noise:
Global Priors (80%): Canonical entropy (weather, shadows, pedestrians, standard vehicles) is filtered automatically.
Local Refinements (20%): Project-specific memory tracks custom ignored regions.
Absolute Dominance: Local rules strictly supersede Global Priors.
Topological Volume Distribution (DAG Physics):
Physical progress is measured as abstract volumetric mass completion against the locked target silhouette. The engine computationally bleeds this volume through the schedule's Directed Acyclic Graph:
$$\text{StructuralWeight} = \max\left(1, \text{durationDays} + (\text{outDegree} \times 2.5)\right)$$
Tasks unlock and complete only as their upstream dependencies are satisfied.
Commit Shielding (Read-Only AI):
Generative AI models have zero write authority over the master ledger. All volumetric syntheses are staged in isolated transactions awaiting explicit human or cryptographic commit.
---
3. Universal Domain Versatility
Because the Constitution Vector is generic, `@base3/core` deploys across diverse physical and spatial operations:
Domain	Vector $[D]$	Vector $[Admin]$	Vector $[RW]$	Target $[Entity]$
Commercial Construction	Architectural Blueprint	CPM Schedule (Primavera/CSV)	Drone Orthomosaics	Structural Level
Civil Infrastructure	Bridge / Tunnel CAD	Highway Phasing DAG	CCTV / LiDAR feeds	Corridor Segment
Aerospace Assembly	Airframe 3D CAD	Assembly Jig Work Orders	Optical Inspection Cams	Fuselage Section
Spatial Robotics	Planned Path / Mesh	Mission State Machine	Onboard Stereo Vision	Navigation Waypoint
---
4. Headless & Limbless Anatomy
`@base3/core` is stripped of all browser dependencies, WebGL renderers, Three.js canvases, and monolithic server code:
```
@base3/core
├── bin/
│   ├── base3.js                 # Primary Headless CLI Executable
│   └── triad.js                 # Backward-compatible CLI alias
├── config/
│   └── global_priors.json       # Canonical environmental ignore substrate
├── examples/
│   ├── schedules/               # Synthetic CSV and JSON schedule networks
│   └── scripts/                 # Programmatic SDK & mock verification scripts
├── src/
│   ├── index.js                 # Master SDK entrypoint
│   ├── core/
│   │   ├── dag-solver.js        # Pure topological volume bleeder (domain physics)
│   │   ├── topology.js          # Strata & entity grouping compiler
│   │   ├── probability.js       # Multi-reality Bayesian consensus engine
│   │   └── priors.js            # Cognitive ignore substrate manager
│   ├── arbitration/
│   │   ├── arbitrator.js        # Two-stage calibration & diffing coordinator
│   │   ├── prompts.js           # Constitution Vector prompt generators
│   │   └── dimensions.js        # PhysicalBaselinesRegistry container
│   ├── ingestion/
│   │   ├── csv-parser.js        # Headless smart CSV parser with alias regex matrix
│   │   └── json-parser.js       # Schedule JSON schema normalizer
│   ├── providers/
│   │   ├── base.js              # VisionProvider abstract interface
│   │   ├── gemini.js            # Google Gemini multimodal adapter
│   │   └── mock.js              # Deterministic mock provider for offline tests
│   └── storage/
│       ├── base.js              # LedgerStorage interface
│       ├── memory.js            # In-memory ledger & staging
│       └── file.js              # Local disk JSON storage
└── test/                        # Deterministic unit test suite
```
---
5. Quickstart
Installation
```bash
npm install @base3/core
```
(Or clone the repository and run `npm install`)
Set up your environment (only required for live multimodal model runs):
```bash
cp .env.example .env
# Provide GEMINI_API_KEY
```
---
Command-Line Interface (CLI)
1. Inspect Schedule Strata Topology
```bash
node bin/base3.js inspect examples/schedules/commercial_building.csv
```
2. Execute Deterministic Topological Volume Bleed (Offline)
Distribute 50% structural progress through the dependency DAG:
```bash
node bin/base3.js distribute 50 examples/schedules/commercial_building.csv
```
3. Run Two-Stage Triad Arbitration (Offline Mock Mode)
```bash
node bin/base3.js synthesize \
  --schedule examples/schedules/commercial_building.csv \
  --design examples/schedules/commercial_building.csv \
  --scale "L1 = 3.5m" \
  --mock
```
---
Programmatic SDK Usage
```javascript
const {
  Base3Engine,
  CsvScheduleParser,
  GeminiVisionProvider,
  FileLedgerStorage
} = require('@base3/core');

async function main() {
  // 1. Define Domain Constitution Vector
  const constitution = {
    domain: "Civil Highway Infrastructure",
    entityType: "span_segment",
    invariants: [
      "Linear progression invariant along chainage coordinates.",
      "Visual verification anchored to engineering clearance baseline."
    ],
    physicalBaselines: {
      "standard_lane_width": "3.6m",
      "barrier_height": "0.81m"
    }
  };

  // 2. Initialize Engine
  const engine = new Base3Engine({
    provider: new GeminiVisionProvider({ apiKey: process.env.GEMINI_API_KEY }),
    constitution,
    storage: new FileLedgerStorage('./data/highway_ledger.json')
  });

  // 3. Ingest Schedule DAG
  const schedule = await CsvScheduleParser.parseFile('./schedule.csv');
  await engine.loadSchedule(schedule);

  // 4. Stage 1: Calibration & Entity Lock
  const calibration = await engine.calibrate({
    designFile: './bridge_cad.png',
    userScaleData: 'Pier = 5.0m'
  });

  // 5. Stage 2: Volumetric Synthesis & Epistemic Diffing
  const result = await engine.synthesize({
    designFile: './bridge_cad.png',
    realityFiles: ['./drone_pass_week8.jpg'],
    userScaleData: 'Pier = 5.0m'
  });

  if (result.status === 'COMPLETE') {
    console.log(`Structural Completion: ${result.calculatedPercentage}%`);
    console.log(`Reconciled Baseline: ${result.reconciledBaseline} ${constitution.entityType} units`);
    console.log(`Report: ${result.driftReport}`);

    // 6. Commit staged changes to permanent ledger
    await engine.commit(result.stagingId);
  }
}

main();
```
---
6. Verification & Test Suite
The test suite validates domain physics, topological DAG bleeds, contractor CSV alias normalization, and Bayesian probability calculations:
```bash
npm test
```
Or run individual test modules:
```bash
node test/dag-solver.test.js
node test/csv-parser.test.js
node test/probability.test.js
node test/arbitrator.test.js
```
---
7. License & AGPLv3 Legal Notice
This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0-only).
Section 13 Network Interaction Copyleft
Under Section 13 of AGPLv3, if you run a modified version of `@base3/core` over a computer network (e.g. as an API service, microservice, or hosted cloud platform), you must provide all remote users interacting with the system the opportunity to receive the Corresponding Source code of your modified version at no charge.
For enterprise licensing exempt from AGPLv3 copyleft provisions, contact the project maintainers. email: info@vrkonstrukt.com.au

8. Intellectual Property & Supply Chain Security

**Patented Architecture:** 
The Base-3 epistemic triad, topological volume bleeder, and deterministic inversion mechanisms are protected by foundational patents. While the AGPLv3 license grants the community the freedom to audit and deploy this science in open-source environments, the underlying mathematics remain proprietary. Commercial deployment exempt from AGPLv3 copyleft provisions requires a base3/ license.

**Repository Provenance (Security Warning):** 
To guarantee mathematical determinism and prevent supply-chain poisoning, you must download and deploy `@base3/core` directly from the official Base-3 repository. We do not audit, verify, or guarantee the safety, physical accuracy, or cryptographic integrity of third-party forks or branched repositories. For enterprise quality and safety assurance, always rely on the canonical source.

A Note from the Founder
"Intelligence without physical boundaries is a liability. Base-3 is the leash. Build boldly, but build on solid ground. Just make the world safe." — Eric Claridades
