# Research

<!-- One entry per research area, in display order. The ### title also sets
     the page anchor (e.g. research.html#causal-video-understanding).
       summary: one sentence, used on the home page area cards
       team:    people working on it; lab members are highlighted
       link / code / demo: optional buttons
     Free text below the fields is the full description on the Research page.
     Publications join an area with "area: <anchor>" in publications.md. -->

## Research Areas

### Causal Video Understanding
summary: Grounding video into events, then reasoning about the triggers that connect them.
team: **Van-Thong Huynh**
We go beyond recognizing *what* happens in a video to explaining *why* it happens. Vision-language models (VLMs) first ground raw video into a stream of textual events, actions, and expressions; large language models (LLMs) and causal frameworks then reason about the triggers and dynamics that connect those events.

### Causal Document Intelligence
summary: Treating document layout as a causal graph over text, tables, and figures.
We treat document layout and structure as a causal graph. VLMs read the structure while LLMs reason over the content, so that the system can infer the logical and causal relationships between text, tables, and figures.

### Causal AI in Healthcare
summary: ICU outcome prediction on MIMIC, from leakage-free prediction and explanation toward counterfactual analysis.
team: **Trong-Nghia Nguyen**, **Hong-Hai Nguyen**, **Van-Thong Huynh**
We predict ICU outcomes on the MIMIC critical-care databases (MIMIC-III and MIMIC-IV): in-hospital and ICU mortality, survival, and clinical deterioration. The current phase focuses on leakage-free prediction and model explanation; causal and counterfactual analysis follows in a later phase.

### Physics-Informed Causal AI
summary: Mechanistic models of physical processes, from prediction to intervention and digital twins.
We build causal models of physical processes such as battery degradation and electrochemical impedance. A physical model is first fitted to the data and then used to answer counterfactual, "digital twin" questions, for example how a cell would have aged under a different charging protocol. Most current work stops at prediction; our focus is intervention.

### Foundations of Causal LLMs & Neuro-Symbolic AI
summary: Do models infer cause and effect, or recall it? Pairing LLMs with symbolic reasoning.
We test where LLMs and VLMs reason about cause and effect and where they only reproduce causal-sounding text, and we pair them with symbolic tools that perform the inference the model cannot. One question runs through this work: does the model infer cause and effect, or recall it?
