# Capstones

## Causal Video Understanding

### A1 | VLM Causal-Failure Taxonomy on Video
level: UG
duration: 8–12 weeks
goal: Map where video VLMs fail at causal reasoning and why, using CausalVQA with an error breakdown by question type.
context: On CausalVQA, humans score 84.78% and the best model (Gemini 2.5 Flash) about 61.7%. Most of that 22-point gap sits in counterfactual, anticipation, and hypothetical questions. Published results usually report only the aggregate number, so the breakdown is missing.
questions: Which question types open the gap, and is the pattern stable across models? What mistakes recur: temporal order, object permanence, shortcut answers?
data: CausalVQA (1,586 items, 793 paired questions, built on Ego-Exo4D). A slice of BlackSwanSuite if there is time.
method: Run two or three VLMs zero- or few-shot, one API model and one open model such as LLaVA-Video or Qwen-VL. Fix the prompt format, label each error by type, and group the results into a taxonomy with worked examples.
milestones: (1) reproduce the aggregate scores; (2) break them down by type; (3) write an error-tagging rubric and check it against a second annotator; (4) assemble the taxonomy and write up.
read: Background | "The Book of Why" (Pearl & Mackenzie, 2018). Causation versus correlation. ISBN 978-0-465-09760-9. |
read: Background | NExT-QA (Xiao et al., CVPR 2021). Causal and temporal video QA. | https://www.semanticscholar.org/arxiv/2105.08276
read: Core | CausalVQA. | https://arxiv.org/abs/2506.09943
read: Core | BlackSwanSuite. | https://arxiv.org/abs/2412.05725

### A2 | Counterfactual Robustness Curve
level: UG
duration: 8–12 weeks
goal: Chart how counterfactual accuracy drops as causal chains get longer.
context: CounterVQA reports that models handle simple counterfactuals reasonably but fall off on multi-hop chains. Its three tiers run from adjacent-event to long-chain to non-existent-event inference, which gives a ready-made difficulty axis.
questions: How steep is the drop across the tiers? Does chain length predict failure better than how the question is worded?
data: CounterVQA (three difficulty tiers).
method: Evaluate two or three VLMs on each tier, plot accuracy against hop count, and inspect the cases where the chain breaks.
milestones: (1) build the eval harness; (2) run the tiered evaluation; (3) produce the decay curve with a stratified error analysis; (4) report.
read: Background | "Causal Inference in Statistics: A Primer" (Pearl, Glymour & Jewell, 2016). ISBN 978-1-119-18684-7. |
read: Core | CounterVQA. | https://arxiv.org/html/2511.19923v1
read: Core | CausalVQA. | https://arxiv.org/abs/2506.09943

### A3 | Event-Graph Captioner
level: UG
duration: 8–12 weeks
goal: Turn short clips into structured event tuples (actor, action, object, time) with a VLM, and measure how good the extraction is.
context: Causal video reasoning usually starts by turning raw video into discrete events. TRACE builds its "causal event modeling" on exactly this step, so the quality of the events sets the ceiling.
questions: How accurately does an off-the-shelf VLM extract event tuples? Where does it slip: temporal order, or object identity?
data: Short Kinetics-700 clips (for example from Causal-VidQA) plus a small hand-labelled event set.
method: Prompt a VLM to emit structured events, define a tuple-matching metric, label a small gold set, then evaluate and analyse the errors.
milestones: (1) fix the event schema; (2) build the extraction pipeline; (3) annotate the gold set and define the metric; (4) evaluate and report.
read: Background | "A Comprehensive Study of Deep Video Action Recognition" (Zhu et al., 2020). | https://www.semanticscholar.org/arxiv/2012.06567
read: Core | TRACE. | https://arxiv.org/abs/2410.05643
read: Core | Causal-VidQA. | https://github.com/bcmi/Causal-VidQA

### A4 | Do Causal Interventions Close the Human Gap?
level: Grad
duration: 6–9 months
goal: Find out whether causal-intervention methods (CRA's front-/back-door adjustment, TRACE's causal event modeling) help on the hard causal benchmarks, not only on the grounding tasks their authors reported.
context: CRA and TRACE both beat correlation-based grounding, but they were tested mainly on NExT-GQA, STAR, and temporal grounding. Nobody has run them on CausalVQA, CounterVQA, or BlackSwanSuite. Whether the gains carry over is an open question and a clean thesis.
questions: Does front-/back-door intervention on an open video-LLM raise counterfactual and anticipation accuracy on held-out benchmarks? Does the gain shrink as chains get longer?
data: Adapt on Causal-VidQA; test across domain on CausalVQA and BlackSwanSuite; stress-test multi-hop on CounterVQA.
method: Re-implement a CRA-style intervention as a module on an open video-LLM, then ablate it against the same backbone without it. Report deltas per question type and per chain length.
milestones: (1) baseline plus one causal method; (2) integrate the intervention module; (3) cross-benchmark evaluation; (4) multi-hop analysis; (5) ablations for the paper.
read: Background | Front-door and back-door adjustment, in "Causality" (Pearl, 2009). ISBN 978-0-521-89560-6. |
read: Core | CRA. | https://arxiv.org/pdf/2503.07635
read: Core | TRACE. | https://arxiv.org/abs/2410.05643
read: Core | CausalVQA. | https://arxiv.org/abs/2506.09943
read: Core | CounterVQA. | https://arxiv.org/html/2511.19923v1

### A5 | Multi-Hop Causal-Chain Reasoner
level: Grad
duration: 6–9 months
goal: Build a model that holds up on multi-hop causal chains, the case where current VLMs drop off.
context: CounterVQA shows accuracy falling away on long chains. TRACE's causal event modeling is a good backbone to extend, since it already represents video as an ordered set of events.
questions: Does building a per-video causal graph and supervising the chain improve long-chain accuracy without hurting single-hop questions?
data: Causal-VidQA for training; CounterVQA's long-chain tier and CausalVQA for evaluation.
method: Take a causal-event-modeling backbone, add a graph-and-chain supervision objective, and evaluate stratified by hop count against the baseline.
milestones: (1) baseline; (2) causal-graph module; (3) chain supervision; (4) stratified evaluation; (5) paper.
read: Background | Structural causal models and causal graphs, in "Causality" (Pearl, 2009). ISBN 978-0-521-89560-6. |
read: Core | TRACE. | https://arxiv.org/abs/2410.05643
read: Core | CounterVQA. | https://arxiv.org/html/2511.19923v1
read: Core | CausalVQA. | https://arxiv.org/abs/2506.09943

### A6 | Anticipation Under Intervention
level: Grad
duration: 6–9 months
goal: Raise the weakest question types, anticipation and hypothetical, using counterfactual training signals.
context: CausalVQA reports anticipation and hypothetical questions as the worst categories for every model tested, which makes them a clear target to push on.
questions: Does counterfactual augmentation, or an intervention objective, improve anticipation accuracy without costing descriptive accuracy?
data: CausalVQA anticipation and hypothetical splits, plus the prediction category from Causal-VidQA.
method: Add counterfactual data augmentation and an intervention objective to a video-LLM, then compare each question type before and after.
milestones: (1) per-type baseline; (2) augmentation pipeline; (3) intervention training; (4) per-type evaluation; (5) paper.
read: Background | "Learning the Difference that Makes a Difference with Counterfactually-Augmented Data" (Kaushik, Hovy & Lipton, ICLR 2020). | https://www.semanticscholar.org/arxiv/1909.12434
read: Core | CausalVQA. | https://arxiv.org/abs/2506.09943
read: Core | CRA. | https://arxiv.org/pdf/2503.07635

---

## Causal Document Intelligence

### B1 | Answer-vs-Grounding Gap in Document LVLMs
level: UG
duration: 8–12 weeks
goal: Measure the gap between answering a document question and pointing to the evidence that supports the answer.
context: On MMDocBench, GPT-4o answers 66.4% correctly (exact match) but lands only 2.44% region IoU; the best model reaches 11.44%. The benchmark authors note that almost every LVLM fails to locate the supporting region.
questions: How wide is the answer-vs-IoU gap across model families and document types? Do simple prompts, such as asking for an explicit bounding box, move the IoU at all?
data: MMDocBench (15 tasks, 4,338 questions, 11,353 supporting regions).
method: Evaluate three or four open LVLMs on answer exact-match and region IoU, split the results by document type, and test a few lightweight prompting changes.
milestones: (1) harness and reproduce the headline numbers; (2) per-type EM/IoU breakdown; (3) prompting experiments; (4) report.
read: Background | DocVQA (Mathew et al., WACV 2021). Document VQA basics. | https://www.semanticscholar.org/arxiv/2007.00398
read: Background | LayoutLMv3 (Huang et al., ACM MM 2022). Layout-aware document models. | https://www.semanticscholar.org/arxiv/2204.08387
read: Core | MMDocBench (MMM 2025). | https://link.springer.com/chapter/10.1007/978-981-95-6950-2_6

### B2 | Layout-Graph Reproduction
level: UG
duration: 8–12 weeks
goal: Reproduce a layout-as-graph baseline (DocGraphLM-style link prediction) on DocLayNet.
context: DocGraphLM rebuilds the document graph by predicting, for each pair of elements, a direction (eight classes) and a distance (regression). The task is well defined and a good fit for a first research project.
questions: Can a student match the reported link-prediction quality? Which relation types are hardest to get right?
data: DocLayNet (CDLA-Permissive-1.0; about 30 GB on Hugging Face, ds4sd/DocLayNet).
method: Build a graph from the layout, train link prediction (direction classification plus distance regression), and evaluate per relation type.
milestones: (1) data preparation; (2) graph construction; (3) link-prediction model; (4) evaluation and report.
read: Background | LayoutLM (Xu et al., KDD 2020). Layout representations. | https://www.semanticscholar.org/arxiv/1912.13318
read: Background | "A Comprehensive Survey on Graph Neural Networks" (Wu et al., IEEE TNNLS 2021). | https://www.semanticscholar.org/arxiv/1901.00596
read: Core | DocGraphLM. | https://arxiv.org/html/2401.02823v1
read: Core | DocLLM (ACL 2024). | https://aclanthology.org/2024.acl-long.463/

### B3 | Table-to-Text Claim Linker
level: UG
duration: 8–12 weeks
goal: Link a claim in the text of a financial report to the table cells that support it.
context: This is a small, measurable piece of the wider grounding problem: instead of locating any region, the task is to connect one claim to its evidence cells.
questions: How well can an LVLM or LLM match a claim sentence to the right cells? What are the common error modes?
data: The financial-reports and tables subset of MMDocBench.
method: Build a claim-to-cell matching pipeline, score it with cell accuracy or IoU, and analyse the errors.
milestones: (1) prepare the subset; (2) matching method; (3) evaluation; (4) report.
read: Background | FinQA (Chen et al., EMNLP 2021). Financial table reasoning. | https://www.semanticscholar.org/arxiv/2109.00122
read: Background | "A Survey on Table Question Answering" (Jin et al., 2022). | https://www.semanticscholar.org/arxiv/2207.05270
read: Core | MMDocBench (MMM 2025). | https://link.springer.com/chapter/10.1007/978-981-95-6950-2_6

### B4 | Document Visual-Grounding Method
level: Grad
duration: 6–9 months
goal: Make document LVLMs point to their evidence, raising region IoU off the single-digit floor on MMDocBench.
context: Document LVLMs answer well but ground poorly (single-digit IoU). Layout structure, from DocGraphLM and gDSA/GraphDoc, and layout-aware LLMs like DocLLM, give signals that can supervise grounding.
questions: Can a region-prediction head, or attention supervised by layout structure, raise IoU while keeping answer accuracy? Does better grounding make answers more faithful to the source?
data: MMDocBench for evaluation; DocLayNet and GraphDoc for structural supervision (check that the relation-annotation release is downloadable first).
method: Add a grounding head and layout-aware supervision to an open document LVLM, train with a joint answer-plus-region loss, evaluate EM and IoU, and ablate the structural signal.
milestones: (1) reproduce a baseline; (2) grounding head and losses; (3) layout-graph supervision; (4) IoU/EM and faithfulness evaluation; (5) paper.
read: Background | Visual grounding and referring-expression methods: "Towards Visual Grounding: A Survey" (Xiao et al., 2024). | https://www.semanticscholar.org/arxiv/2412.20206
read: Core | MMDocBench (MMM 2025). | https://link.springer.com/chapter/10.1007/978-981-95-6950-2_6
read: Core | DocLLM (ACL 2024). | https://aclanthology.org/2024.acl-long.463/
read: Core | gDSA / GraphDoc (ICLR 2025). | https://proceedings.iclr.cc/paper_files/paper/2025/file/cf3d7d8e79703fe947deffb587a83639-Paper-Conference.pdf

### B5 | Logical-Relation Graph Reasoner
level: Grad
duration: 6–9 months
goal: Predict a document's spatial and logical relations as a graph, and beat the gDSA/GraphDoc baseline of 57.6% mAP.
context: The gDSA task asks for spatial relations (up, down, left, right) and logical ones (parent, child, sequence, reference). The DRGG baseline sits at 57.6% mAP, so there is roughly 42 points of room to improve.
questions: Can a stronger relation model raise mAP on the spatial and logical relations? Which logical relations are hardest?
data: GraphDoc (80k images, over 4M relation annotations; check the release is available).
method: Build a graph relation model covering direction and the logical relations, compare it against DRGG, and ablate the components.
milestones: (1) get data access; (2) relation model; (3) evaluation against the baseline; (4) paper.
read: Background | "A Comprehensive Survey on Graph Neural Networks" (Wu et al., IEEE TNNLS 2021). | https://www.semanticscholar.org/arxiv/1901.00596
read: Core | gDSA / GraphDoc (ICLR 2025). | https://proceedings.iclr.cc/paper_files/paper/2025/file/cf3d7d8e79703fe947deffb587a83639-Paper-Conference.pdf
read: Core | DocGraphLM. | https://arxiv.org/html/2401.02823v1

### B6 | Causal Document QA
level: Grad
duration: 9–12 months
goal: Build counterfactual document QA that tests cause-and-effect reading, and release it as a benchmark.
context: Today's "causal" document work is really spatial and logical relation inference. It does not test interventions or counterfactuals, so a benchmark for genuine causal reading does not yet exist.
questions: Can we construct counterfactual document QA that measures causal reading rather than retrieval? Do intervention-style methods help LLMs or LVLMs on it?
data: Scientific and financial report corpora (for example the MMDocBench sources), plus new counterfactual annotations.
method: Build the benchmark (premise-to-conclusion items with counterfactual variants), run baselines, add intervention-style methods, and validate with human checks.
milestones: (1) schema and annotation protocol; (2) build the benchmark; (3) baselines; (4) intervention analysis; (5) paper.
read: Background | "Causal Inference in Statistics: A Primer" (Pearl, Glymour & Jewell, 2016) and "Causality" (Pearl, 2009). ISBN 978-1-119-18684-7; 978-0-521-89560-6. |
read: Core | MMDocBench (MMM 2025). | https://link.springer.com/chapter/10.1007/978-981-95-6950-2_6
read: Core | DocLLM (ACL 2024). | https://aclanthology.org/2024.acl-long.463/
