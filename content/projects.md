# Projects

<!-- Projects are organized around the lab's five core research areas.
     Descriptions are drawn from content/home.md — edit freely, add links,
     code/demo URLs, and team members as projects mature. -->

## Research Projects

### Causal Video Understanding
status: Active
area: Perception → Reasoning
team: **Van-Thong Huynh**
Going beyond *what* happens in a video to understand *why*. We ground raw video into a stream of textual events and expressions with VLMs, then use LLMs and causal frameworks to reason about the triggers and dynamics that connect those events.
topic: UG | VLM causal-failure taxonomy — evaluate open VLMs on CausalVQA; per-type human–model gap analysis.
topic: UG | Counterfactual robustness curve — single- vs multi-hop accuracy on CounterVQA.
topic: UG | Event-graph captioner — VLM → (actor, action, object, time) tuples on short Kinetics clips.
topic: Grad | Causal-intervention transfer — port CRA front/back-door deconfounding to an open VLM; test on CausalVQA + BlackSwanSuite.
topic: Grad | Multi-hop causal-chain reasoner — TRACE-style causal-event modeling on Causal-VidQA.
topic: Grad | Anticipation under intervention — counterfactual training on CausalVQA anticipation / hypothetical splits.
figure: images/arch/A4-causal-intervention.svg | A4 · Causal-Intervention Reasoner
figure: images/arch/A5-multihop-chain.svg | A5 · Multi-Hop Causal-Chain Reasoner

### Causal Document Intelligence
status: Active
area: Structure → Logic
Treating document layout and structure as a causal graph. VLMs read structure while LLMs reason over semantics, inferring the logical and causal relationships between text, tables, and figures.
topic: UG | Answer-vs-grounding gap study — evaluate open LVLMs on MMDocBench (answer EM vs region IoU).
topic: UG | Layout-graph reproduction — DocGraphLM-style link prediction on DocLayNet.
topic: UG | Table↔text claim linker — match textual claims to supporting cells in financial reports.
topic: Grad | Document visual-grounding method — region supervision to raise IoU on MMDocBench.
topic: Grad | Logical-relation graph reasoner — gDSA spatial+logical relations on GraphDoc; beat the 57.6% mAP baseline.
topic: Grad | Causal document QA — premise→conclusion counterfactual QA; build a new benchmark.
figure: images/arch/B4-doc-grounding.svg | B4 · Document Visual-Grounding
figure: images/arch/B6-causal-doc-qa.svg | B6 · Causal Document QA

### Causal AI in Healthcare
status: Active
area: Diagnosis → Cause
team: **Trong-Nghia Nguyen**, **Hong-Hai Nguyen**, **Van-Thong Huynh**
Causal inference for trustworthy, safe medical diagnostics — finding causal biomarkers in medical images and extracting causal insight from electronic health records (e.g. MediFusion-Flex for real-time clinical deterioration prediction).

### Physics-Informed Causal AI
status: Active
area: Process → Mechanism
Causal models of complex physical processes such as battery degradation and impedance spectroscopy, to discover underlying scientific mechanisms and enable counterfactual "digital twin" simulations.

### Foundations of Causal LLMs & Neuro-Symbolic AI
status: Active
area: Perception ∧ Logic
Investigating the causal reasoning capabilities (and failures) of LLMs and VLMs, and building neuro-symbolic architectures that bridge perception and logic for genuine counterfactual reasoning.
