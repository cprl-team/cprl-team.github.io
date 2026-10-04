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
Going beyond *what* happens in a video to understand *why*. We ground raw video into a stream of textual events and expressions with VLMs, then use LLMs and causal frameworks to reason about the triggers and dynamics that connect those events.

### Causal Document Intelligence
summary: Treating document layout and structure as a causal graph over text, tables, and figures.
Treating document layout and structure as a causal graph. VLMs read structure while LLMs reason over semantics, inferring the logical and causal relationships between text, tables, and figures.

### Causal AI in Healthcare
summary: ICU outcome prediction on MIMIC: leakage-free prediction, explanation, and counterfactuals.
team: **Trong-Nghia Nguyen**, **Hong-Hai Nguyen**, **Van-Thong Huynh**
ICU outcome prediction on the MIMIC critical-care databases (MIMIC-III/IV): in-hospital and ICU mortality, survival, and clinical deterioration. The early phase focuses on leakage-free prediction and model explanation; causal and counterfactual analysis is a later direction.

### Physics-Informed Causal AI
summary: Mechanistic models of physical processes, from prediction to intervention and digital twins.
Causal models of physical processes like battery degradation and electrochemical impedance. We fit a physical model to the data, then use it to ask counterfactual "digital twin" questions, for example how a cell would have aged under a different charging protocol. Most current work stops at prediction; the part we care about is intervention.

### Foundations of Causal LLMs & Neuro-Symbolic AI
summary: Do models infer cause and effect, or recall it? Pairing LLMs with symbolic reasoning.
We test where LLMs and VLMs actually reason about cause and effect, and where they only repeat causal-sounding text, then pair them with symbolic tools that handle the inference the model cannot. The question that runs through the work: does the model infer cause and effect, or recall it?
