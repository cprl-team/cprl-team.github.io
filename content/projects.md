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
topic: UG | VLM causal-failure taxonomy: evaluate open VLMs on CausalVQA and break the human-model gap down by question type. | a1
topic: UG | Counterfactual robustness curve: measure how accuracy drops from single-hop to multi-hop chains on CounterVQA. | a2
topic: UG | Event-graph captioner: extract (actor, action, object, time) event tuples from short clips with a VLM. | a3
topic: Grad | Causal-intervention transfer: add CRA-style front/back-door adjustment to an open VLM and test on CausalVQA and BlackSwanSuite. | a4
topic: Grad | Multi-hop causal-chain reasoner: extend TRACE-style causal-event modeling to hold up on long chains (Causal-VidQA). | a5
topic: Grad | Anticipation under intervention: use counterfactual training to lift the weakest CausalVQA question types. | a6
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
topic: UG | Answer-vs-grounding gap: compare answer accuracy with region IoU across open LVLMs on MMDocBench. | b1
topic: UG | Layout-graph reproduction: rebuild the DocGraphLM link-prediction baseline on DocLayNet. | b2
topic: UG | Table-to-text claim linker: match claims to their supporting table cells in financial reports. | b3
topic: Grad | Document visual-grounding method: add region supervision to raise IoU on MMDocBench. | b4
topic: Grad | Logical-relation graph reasoner: predict gDSA spatial and logical relations on GraphDoc and beat the 57.6% mAP baseline. | b5
topic: Grad | Causal document QA: build a counterfactual, premise-to-conclusion benchmark for documents. | b6
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
area: Prediction → Explanation
team: **Trong-Nghia Nguyen**, **Hong-Hai Nguyen**, **Van-Thong Huynh**
ICU outcome prediction on the MIMIC critical-care databases (MIMIC-III/IV): in-hospital and ICU mortality, survival, and clinical deterioration. The early phase focuses on leakage-free prediction and model explanation; causal and counterfactual analysis is a later direction.
topic: UG | Strong-baseline mortality benchmark: XGBoost vs LSTM/TCN on MIMIC-IV, leakage-free, with calibration. | hc1
topic: UG | Label-leakage replication: how ICD codes inflate same-admission mortality AUROC, with a clean-feature checklist. | hc2
topic: UG | SHAP explanation study for ICU mortality on the MIMIC-III benchmark. | hc3
topic: UG | Mutual-information vs tree-based feature selection for ICU mortality. | hc4
topic: UG | Few-label ICU mortality with self-supervised pretraining (label-efficiency curve). | hc5
topic: Grad | Competing-risks ICU survival with task-matched metrics (SurvTRACE vs DeepHit/DSM). | hc6
topic: Grad | MIMIC to eICU external validation with calibration and subgroup fairness. | hc7
topic: Grad | Information-Bottleneck representations and IB attribution for ICU outcomes. | hc8
ref: MIMIC-IV (PhysioNet) | https://physionet.org/content/mimiciv/3.1/
ref: Harutyunyan MIMIC-III benchmark | https://github.com/YerevaNN/mimic3-benchmarks
ref: YAIB (multi-center ICU) | https://arxiv.org/abs/2306.05109
ref: MIMIC-IV benchmark (XGBoost) | https://arxiv.org/pdf/2401.15290
ref: SurvTRACE (survival) | https://arxiv.org/pdf/2110.00855
ref: Stop Chasing the C-index | https://arxiv.org/pdf/2506.02075
ref: ICD label-leakage study | https://www.medrxiv.org/content/10.1101/2025.08.09.25333360.full.pdf
ref: STraTS (self-supervised) | https://arxiv.org/abs/2107.14293

### Physics-Informed Causal AI
status: Active
area: Process → Mechanism
Causal models of physical processes like battery degradation and electrochemical impedance. We fit a physical model to the data, then use it to ask counterfactual "digital twin" questions, for example how a cell would have aged under a different charging protocol. Most current work stops at prediction; the part we care about is intervention.
topic: UG | Early-life RUL prediction on the Severson battery dataset (gradient-boosted trees on first-100-cycle features). | pi1
topic: UG | Equivalent-circuit-model classification from EIS spectra (BatteryDEV). | pi2
topic: UG | PINN for a canonical PDE on PDEBench, characterising training failure modes. | pi3
topic: Grad | Physics-informed state-of-health with calibrated uncertainty (re-implement PINN4SOH). | pi4
topic: Grad | Discovering battery degradation equations with weak-SINDy / PySR. | pi5
topic: Grad | Causal digital twin for counterfactual battery aging (discovered dynamics + SCM). | pi6
ref: Severson (Nature Energy 2019) | https://doi.org/10.1038/s41560-019-0356-8
ref: PINN4SOH (Nature Comms 2024) | https://doi.org/10.1038/s41467-024-48779-z
ref: Zhang EIS (Nature Comms 2020) | https://doi.org/10.1038/s41467-020-15235-7
ref: Raissi PINNs (JCP 2019) | https://doi.org/10.1016/j.jcp.2018.10.045
ref: SINDy (PNAS 2016) | https://doi.org/10.1073/pnas.1517384113
ref: PySINDy | https://github.com/dynamicslab/pysindy
ref: PDEBench | https://arxiv.org/abs/2210.07182
ref: EIS ECM benchmark | https://arxiv.org/abs/2302.03362

### Foundations of Causal LLMs & Neuro-Symbolic AI
status: Active
area: Perception ∧ Logic
We test where LLMs and VLMs actually reason about cause and effect, and where they only repeat causal-sounding text, then pair them with symbolic tools that handle the inference the model cannot. The question that runs through the work: does the model infer cause and effect, or recall it?
topic: UG | Does it reason or recall? a robustness audit of LLM correlation-to-causation (Corr2Cause). | ns1
topic: UG | Solver-in-the-loop: an LLM-to-DoWhy pipeline for interventional queries. | ns2
topic: UG | Counterfactual consistency probing of open LLMs (CRASS, CounterBench). | ns3
topic: Grad | Faithful autoformalization for causal queries (LLM-to-SCM with a solver verifier). | ns4
topic: Grad | Isolating abduction: a diagnostic benchmark and method for LLM counterfactuals. | ns5
topic: Grad | When are LLM causal claims identifiable? theory and a shortcut-resistant benchmark. | ns6
ref: Corr2Cause (ICLR 2024) | https://arxiv.org/abs/2306.05836
ref: CLadder (NeurIPS 2023) | https://arxiv.org/abs/2312.04350
ref: CRASS (LREC 2022) | https://arxiv.org/abs/2112.11941
ref: CausalBench for LLMs (Zhou et al., 2024) | https://arxiv.org/abs/2404.06349
ref: Kiciman et al. (TMLR 2024) | https://arxiv.org/abs/2305.00050
ref: Logic-LM (EMNLP Findings 2023) | https://arxiv.org/abs/2305.12295
ref: CounterBench | https://arxiv.org/abs/2502.11008
ref: e-CARE (ACL 2022) | https://arxiv.org/abs/2205.05849
