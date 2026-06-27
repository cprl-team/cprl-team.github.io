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


---

## Causal AI in Healthcare

### HC1 | Strong-Baseline ICU Mortality Benchmark
level: UG
duration: 8–12 weeks
goal: Establish a reproducible, leakage-free baseline for in-ICU mortality on MIMIC-IV, comparing a strong tabular model with deep sequence models.
context: On MIMIC-IV mortality, XGBoost reaches about 0.87 AUROC and often beats LSTM/TCN on irregular, sparse features. A clean, calibrated baseline is the right first step before any deep model.
questions: Does a tuned XGBoost beat LSTM/TCN on MIMIC-IV mortality? How well calibrated are the predictions, and do patient-level splits change the picture?
data: MIMIC-IV in-ICU mortality via YAIB (or the arXiv 2401.15290 setup).
method: Build leakage-free features, train XGBoost vs LSTM/TCN with patient-level splits, and report AUROC, AUPRC, and calibration.
milestones: (1) cohort and leakage-free features; (2) baselines; (3) calibration analysis; (4) report.
read: Core | MIMIC-IV benchmark (XGBoost baseline). | https://arxiv.org/pdf/2401.15290
read: Core | YAIB. | https://arxiv.org/abs/2306.05109
read: Background | MIMIC-IV (Johnson et al., Scientific Data 2023). | https://physionet.org/content/mimiciv/3.1/

### HC2 | Label-Leakage Replication
level: UG
duration: 8–12 weeks
goal: Show how ICD diagnostic codes inflate same-admission mortality AUROC, and produce a leakage-free feature checklist.
context: ICD codes are finalized only after discharge, so using them as features inflates AUROC to an implausible 0.97 to 0.98. About 40% of published same-admission models did this.
questions: How much does ICD-code leakage inflate AUROC versus leakage-free features on MIMIC-IV? Which variables are unsafe for same-admission outcomes?
data: MIMIC-IV in-hospital mortality.
method: Train identical models with and without ICD and other post-outcome features; quantify the AUROC gap; write a reusable cohort and feature checklist.
milestones: (1) cohort; (2) leaky vs clean feature sets; (3) measured AUROC gap; (4) checklist and report.
read: Core | ICD label-leakage study (2025). | https://www.medrxiv.org/content/10.1101/2025.08.09.25333360.full.pdf
read: Core | MIMIC-IV benchmark. | https://arxiv.org/pdf/2401.15290

### HC3 | SHAP Explanation Study for ICU Mortality
level: UG
duration: 8–12 weeks
goal: Explain an ICU mortality model with SHAP on the standard MIMIC-III benchmark and audit the drivers.
context: Explanation is an early-phase focus alongside prediction. SHAP on the Harutyunyan in-hospital-mortality task is a clean, established setup.
questions: Which features drive the model, are any of them leakage or proxies, and do explanations agree across models?
data: MIMIC-III via the Harutyunyan in-hospital-mortality benchmark.
method: Train a baseline, compute SHAP rankings, cross-check agreement across models, and audit for leakage.
milestones: (1) reproduce the task; (2) SHAP rankings; (3) cross-model agreement; (4) report.
read: Core | Harutyunyan MIMIC-III benchmark. | https://github.com/YerevaNN/mimic3-benchmarks
read: Background | Attention-based explainability on MIMIC-IV. | https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9554013/

### HC4 | Mutual-Information Feature Selection
level: UG
duration: 8–12 weeks
goal: Compare information-theoretic feature selection (MI, mRMR, JMI) with tree-based selection for ICU mortality.
context: Tree-based selection (Boruta/XGBoost) is standard on MIMIC, but an MI-as-headline feature-selection study on MIMIC mortality is essentially missing, so a clean head-to-head is a real contribution.
questions: Do MI-based methods give a more compact or more interpretable feature set than Boruta/XGBoost at equal accuracy? Which features do they disagree on?
data: MIMIC-IV mortality (replicate and extend the two-tier AKI selection setup).
method: Run mRMR/JMI vs Boruta/XGBoost on one fixed cohort; compare accuracy, feature-set size, and selection stability.
milestones: (1) cohort; (2) selection methods; (3) head-to-head comparison; (4) report.
read: Core | Two-tier feature selection on MIMIC AKI mortality (Scientific Reports 2024). | https://doi.org/10.1038/s41598-024-63793-3
read: Background | Estimating CMI for dynamic feature selection (Gadgil et al., ICLR 2024). | https://arxiv.org/abs/2306.03301

### HC5 | Few-Label ICU Mortality with Self-Supervised Pretraining
level: UG
duration: 8–12 weeks
goal: Quantify how much labeled data self-supervised pretraining saves for ICU mortality.
context: Self-supervised pretraining (STraTS forecasting, TS2Vec contrastive) helps most when labels are scarce; reported gains include +0.17 AUROC with only 1% of labels.
questions: How does pretrain-then-linear-probe compare to supervised-from-scratch at 1, 5, 10, and 100% of labels?
data: MIMIC-III via MIMIC-Extract, or the open PhysioNet/CinC 2012 set for a low-friction start.
method: Pretrain TS2Vec or STraTS on unlabeled series, linear-probe across label fractions, and plot a label-efficiency curve.
milestones: (1) pretraining; (2) probes at each label fraction; (3) efficiency curve; (4) report.
read: Core | STraTS (ACM TKDD 2022). | https://arxiv.org/abs/2107.14293
read: Core | TS2Vec (AAAI 2022). | https://arxiv.org/abs/2106.10466
read: Background | MIMIC-Extract (CHIL 2020). | https://arxiv.org/abs/1907.08322

### HC6 | Competing-Risks ICU Survival with Correct Metrics
level: Grad
duration: 6–9 months
goal: Model ICU time-to-event with competing risks and evaluate it with task-matched metrics.
context: SurvTRACE, DeepHit, and DSM handle competing events, but about 72% of recent survival papers use a metric misaligned with their task. Matching the metric to the objective is itself a contribution.
questions: Does a transformer survival model beat DeepHit/DSM on MIMIC-IV, and does the ranking change under C-index versus Brier versus calibration?
data: MIMIC-IV survival cohort with competing risks.
method: Train SurvTRACE vs DeepHit/DSM/Cox; report C-index, integrated Brier score, and calibration; analyze where the metrics disagree.
milestones: (1) cohort and censoring; (2) models; (3) task-matched evaluation; (4) paper.
read: Core | SurvTRACE. | https://arxiv.org/pdf/2110.00855
read: Core | "Stop Chasing the C-index" (2025). | https://arxiv.org/pdf/2506.02075

### HC7 | MIMIC to eICU External Validation with Fairness
level: Grad
duration: 6–9 months
goal: Test whether an ICU mortality model generalizes from MIMIC to eICU, with calibration and subgroup fairness.
context: Single-center models often fail off-site. YAIB can evaluate a MIMIC-trained model on eICU without retraining, which makes a clean external-validation study feasible.
questions: How much does AUROC and calibration drop from MIMIC to eICU, and are the drops uneven across demographic subgroups?
data: MIMIC-IV (train) and eICU-CRD (external) via YAIB.
method: Train on MIMIC-IV, evaluate on eICU, report calibration and subgroup metrics, and test simple domain-adaptation fixes.
milestones: (1) harmonized cohorts; (2) cross-center evaluation; (3) fairness slices; (4) paper.
read: Core | YAIB. | https://arxiv.org/abs/2306.05109
read: Background | eICU-CRD (Pollard et al., Scientific Data 2018). | https://doi.org/10.1038/sdata.2018.178

### HC8 | Information-Bottleneck Representations and Attribution
level: Grad
duration: 9–12 months
goal: Apply the deep variational Information Bottleneck to MIMIC ICU outcomes and add IB-based temporal attribution.
context: Deep VIB applied directly to MIMIC ICU outcomes is an open niche; the strong IB methods live on adjacent data (ECG, TCGA), so porting them to MIMIC-IV is both feasible and novel.
questions: Does an IB beta sweep trade compression for accuracy, calibration, and robustness well, and does IB attribution match known clinical signals?
data: MIMIC-IV mortality and deterioration.
method: Train a deep-VIB model with a beta sweep; add TimeX++-style IB attribution; validate the explanations against SOFA/APACHE components.
milestones: (1) VIB model; (2) beta sweep; (3) IB attribution; (4) clinical validation; (5) paper.
read: Core | Deep Variational Information Bottleneck (ICLR 2017). | https://arxiv.org/abs/1612.00410
read: Core | TimeX++ (ICML 2024). | https://arxiv.org/abs/2405.09308
read: Background | PIBD (ICLR 2024). | https://arxiv.org/abs/2401.01646
