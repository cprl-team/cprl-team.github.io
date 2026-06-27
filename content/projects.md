# Projects

<!-- Projects are organized around the lab's five core research areas.
     Descriptions are drawn from content/home.md. Edit freely, add links,
     code/demo URLs, and team members as projects mature. -->

## Research Projects

### Causal Video Understanding
status: Active
area: Perception → Reasoning
team: **Van-Thong Huynh**
Going beyond *what* happens in a video to understand *why*. We ground raw video into a stream of textual events and expressions with VLMs, then use LLMs and causal frameworks to reason about the triggers and dynamics that connect those events.
topic: UG | VLM causal-failure taxonomy: evaluate open VLMs on CausalVQA and break the human-model gap down by question type.
topic: UG | Counterfactual robustness curve: measure how accuracy drops from single-hop to multi-hop chains on CounterVQA.
topic: UG | Event-graph captioner: extract (actor, action, object, time) event tuples from short clips with a VLM.
topic: Grad | Causal-intervention transfer: add CRA-style front/back-door adjustment to an open VLM and test on CausalVQA and BlackSwanSuite.
topic: Grad | Multi-hop causal-chain reasoner: extend TRACE-style causal-event modeling to hold up on long chains (Causal-VidQA).
topic: Grad | Anticipation under intervention: use counterfactual training to lift the weakest CausalVQA question types.
figure: images/arch/A4-causal-intervention.svg | A4 · Causal-Intervention Reasoner
figure: images/arch/A5-multihop-chain.svg | A5 · Multi-Hop Causal-Chain Reasoner
ref: CausalVQA | https://arxiv.org/abs/2506.09943
ref: CounterVQA | https://arxiv.org/html/2511.19923v1
ref: BlackSwanSuite | https://arxiv.org/abs/2412.05725
ref: Causal-VidQA | https://github.com/bcmi/Causal-VidQA
ref: TRACE | https://arxiv.org/abs/2410.05643
ref: CRA | https://arxiv.org/pdf/2503.07635
ref: NExT-QA | https://www.semanticscholar.org/arxiv/2105.08276

### Causal Document Intelligence
status: Active
area: Structure → Logic
Treating document layout and structure as a causal graph. VLMs read structure while LLMs reason over semantics, inferring the logical and causal relationships between text, tables, and figures.
topic: UG | Answer-vs-grounding gap: compare answer accuracy with region IoU across open LVLMs on MMDocBench.
topic: UG | Layout-graph reproduction: rebuild the DocGraphLM link-prediction baseline on DocLayNet.
topic: UG | Table-to-text claim linker: match claims to their supporting table cells in financial reports.
topic: Grad | Document visual-grounding method: add region supervision to raise IoU on MMDocBench.
topic: Grad | Logical-relation graph reasoner: predict gDSA spatial and logical relations on GraphDoc and beat the 57.6% mAP baseline.
topic: Grad | Causal document QA: build a counterfactual, premise-to-conclusion benchmark for documents.
figure: images/arch/B4-doc-grounding.svg | B4 · Document Visual-Grounding
figure: images/arch/B6-causal-doc-qa.svg | B6 · Causal Document QA
ref: MMDocBench | https://link.springer.com/chapter/10.1007/978-981-95-6950-2_6
ref: DocLLM | https://aclanthology.org/2024.acl-long.463/
ref: DocGraphLM | https://arxiv.org/html/2401.02823v1
ref: gDSA / GraphDoc | https://proceedings.iclr.cc/paper_files/paper/2025/file/cf3d7d8e79703fe947deffb587a83639-Paper-Conference.pdf
ref: LayoutLM | https://www.semanticscholar.org/arxiv/1912.13318
ref: LayoutLMv3 | https://www.semanticscholar.org/arxiv/2204.08387
ref: DocVQA | https://www.semanticscholar.org/arxiv/2007.00398
ref: FinQA | https://www.semanticscholar.org/arxiv/2109.00122

### Causal AI in Healthcare
status: Active
area: Diagnosis → Cause
team: **Trong-Nghia Nguyen**, **Hong-Hai Nguyen**, **Van-Thong Huynh**
Causal inference for trustworthy, safe medical diagnostics. We look for causal biomarkers in medical images and extract causal insight from electronic health records (for example MediFusion-Flex, for real-time clinical deterioration prediction).

### Physics-Informed Causal AI
status: Active
area: Process → Mechanism
Causal models of complex physical processes such as battery degradation and impedance spectroscopy, to discover underlying scientific mechanisms and enable counterfactual "digital twin" simulations.

### Foundations of Causal LLMs & Neuro-Symbolic AI
status: Active
area: Perception ∧ Logic
Investigating the causal reasoning capabilities (and failures) of LLMs and VLMs, and building neuro-symbolic architectures that bridge perception and logic for genuine counterfactual reasoning.
