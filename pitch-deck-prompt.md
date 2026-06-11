# Bro2Bro — Pitch Deck Generation Prompt
*Team 7 · AI + Health Tech Hackathon · 2026*

---

> **HOW TO USE THIS PROMPT**
> You are a world-class pitch deck designer and startup storyteller.
> Generate a complete, judge-ready pitch deck for **Bro2Bro** using every detail below.
> For each slide, output: **(1) Slide Title, (2) Layout Description, (3) All Copy, (4) Design Notes, (5) Visual/Screenshot Instruction.**
> Attach any app screenshots when you send this — they go exactly where noted per slide.

---

## CONTEXT: WHO IS IN THE ROOM

This is a **hackathon pitch** to a panel of judges who are evaluating: innovation (25%), market impact (25%), technical execution (40% is the demo), and business viability (10%). The audience is highly technical and medically literate. They will probe hard. The deck sets up the demo — it doesn't replace it.

### The Judges (design the deck around what they care about)

| Judge | Organization | Their Lens |
|-------|-------------|-----------|
| **Wu** | UA Little Rock (Tech) | AI governance, LLM data lifecycle, racial bias in AI outputs |
| **AbuHalimeh & Berleant** | UA Little Rock (Tech) | Demo quality, technical architecture, build rigor |
| **Salena Wright-Brown** | Central Arkansas Veterans Healthcare System | Black veterans, PTSD/trauma, VA integration, Section 508, suicide prevention |
| **Eric Peterson** | UAMS BioVentures | IP, commercialization path, research validation, investment readiness |
| **Erin Parker** | Arkansas Children's | Clinical handoffs, implementation feasibility, community impact measurement |

---

## CRITICAL DESIGN DIRECTIVE — THE SLIDES MUST LOOK LIKE THE APP

Judges should glance at a slide and instantly recognize the product they're about to see demoed. Every design choice mirrors the Bro2Bro web application exactly.

### Color Palette — use these hex values, no substitutions
| Role | Name | Hex |
|------|------|-----|
| Primary CTA / brand anchor | Gold / Amber | `#f59e0b` |
| Secondary / care / wellness | Teal | `#0d9488` |
| Slide background (light) | White | `#ffffff` |
| Slide background (alt / gray) | Off-white | `#f9fafb` |
| Headings | Near-black | `#0a0a0a` |
| Body / supporting text | Mid-gray | `#6b7280` |
| Dark slides (cover, closing, ask) | Black | `#000000` |
| Badge / chip background (gold) | Amber tint | `#fef3c7` |
| Badge / chip background (teal) | Teal tint | `#ccfbf1` |

**Rules:**
- Gold `#f59e0b` → all key stats, data callouts, CTAs, and highlight lines
- Teal `#0d9488` → secondary icons, partner labels, supporting data
- Black background → cover, ask, and closing slides (bookend the deck)
- White/off-white → all content slides

### Typography — Inter (Google Fonts)
| Element | Weight | Size | Notes |
|---------|--------|------|-------|
| Slide title | Black 900 | 36–44pt | Tight tracking `-0.03em` |
| Eyebrow / section label | Semibold 600 | 11pt | Uppercase, wide letter-spacing, gold or teal color |
| Body / bullets | Regular 400 | 14–15pt | Line-height 1.7 |
| Big stat / data callout | Black 900 | 48–72pt | Gold `#f59e0b` |
| Caption / footnote | Light 300 | 10pt | Gray `#6b7280` |

### Visual Language
- **Corners:** 16px radius (rounded-2xl) on every card, image frame, and chip — no sharp corners anywhere
- **Shadows:** `0 4px 24px rgba(0,0,0,0.08)` — soft, never flat
- **Buttons/badges:** Pill-shaped (rounded-full) — gold fill for primary, teal outline for secondary
- **Icons:** Lucide-style line icons, 20–24px, monochrome
- **Screenshots/images:** rounded-2xl frame + soft shadow + 1px border `#e5e7eb`
- **Spacing:** generous white space — not crammed, breathe
- **No decorative gradients on text,** no stock images, no clipart

### Tone & Voice
- Confident and direct — no filler words
- Community-first language: "the barbershop", "your guys", "real men, real health"
- Every data claim is sourced — cite LABBPS trial by name
- Urgency without fear — the stakes are real, but this is a solutions story
- Never corporate-speak — this was born in a barbershop

---

## THE BUSINESS: BRO2BRO — COMPLETE INFORMATION

### What It Is
Bro2Bro is an AI-powered wellness companion that extends the trusted health conversations that already happen in Black barbershops into a 24/7, SMS-first, free-for-users platform. It combines a culturally competent AI chat companion (Bro.AI), a care navigation layer (resource finder + appointment booking), and a peer accountability system (Crew) — all anchored by a Community Health Worker certification track for barbers.

### The Research Foundation
- **UAMS LABBPS Trial (Jordan et al., 2024):** Barbershop + AI follow-up achieved a **63.6% blood pressure control rate** vs. **11.7%** without it — a 5x improvement, peer-reviewed and published.
- **2025 JMIR Systematic Review:** AI-based motivational interviewing is "generally feasible, usable, and positively received," with highest effectiveness when delivered through a trusted introduction — exactly the Bro2Bro model.
- **Barbershop Trust:** The barbershop is the most trusted institution in Black male culture — more than a doctor's office, more than a clinic. The pivot isn't the AI; it's the trust layer.

### The Problem
- Black men have the highest rates of hypertension, diabetes, and preventable death of any US demographic
- Only 1 in 3 Black men with hypertension has it under control
- Black men die 4–6 years earlier than white men on average
- Barriers: deep distrust of healthcare systems, stigma around mental health, lack of culturally competent care, geographic isolation in rural Arkansas
- Arkansas consistently ranks among the lowest states in health outcomes

### The Solution — Three Pillars
1. **TALK** — Bro.AI: judgment-free, 24/7 AI wellness companion using motivational interviewing. No clinical jargon. Emoji-friendly. Crisis escalation to 988 (Veterans Crisis Line option for veterans). No PHI ever sent to the LLM — anonymous IDs only.
2. **CONNECT** — Resource Finder (Leaflet map: free clinics, barbershops, churches, support groups), appointment booking via FHIR API integration with partner clinics, and peer mentor matching (mentors share personal experience — they do not give medical advice; they are screened, trained in scope boundaries, and covered under platform terms of service).
3. **CREW** — Accountability groups: shared 90-day health journey, BP milestone tracking, streak system, family sharing. Barbers earn Community Health Worker certification with Medicaid billing access.

### Privacy Architecture (judge-critical — Wu will probe this)
- No PHI ever sent to the LLM API — only wellness context + conversation content under anonymous user IDs
- Conversation history stored encrypted, accessible only for that user's next session
- LLM provider API call logs purged after 30 days
- Zero-knowledge architecture: users own all their data, one-tap deletion
- AI does not train on user conversations — only aggregate, de-identified analytics used for model improvement
- Model improvement: UAMS IRB-approved studies on properly consented data, not user conversation retraining

### AI Bias Mitigation (Wu / Salena will probe)
- System prompt built specifically for this population — cultural context is embedded, not inferred
- Community advisory board of Black men and Black healthcare professionals reviews a sample of AI outputs quarterly
- Adversarial testing: same health scenarios run with varied implied user backgrounds, outputs compared for quality divergence
- Bias is monitored, detected, and correctable — not claimed to be eliminated

### Business Model
**Free for users — always.** Revenue comes from the systems that benefit from healthier communities:
1. **B2B SaaS — Health Systems & Clinics:** Monthly subscription for patient engagement dashboard, appointment routing, and outcomes tracking
2. **Insurer Partnerships:** BCBS Arkansas, Medicaid value-based care / pay-for-outcomes contracts
3. **CHW Certification Program:** Barber certification fees + Medicaid billing integration revenue split
4. **Grant & Institutional Funding:** CDC Prevention Centers (via UAMS co-application), RWJF, AR Dept. of Health, UAMS research partnerships

### Commercialization Path (Eric Peterson will ask this exactly)
- **Month 1–3:** UAMS IRB-approved pilot — 10 barbershops, 100 men, SMS-only MVP. Collect engagement data and preliminary BP readings.
- **Month 3–6:** Apply for CDC Prevention Center funding through UAMS (they have the grant infrastructure).
- **Month 6–12:** Present pilot data to BCBS Arkansas for a paid contract conversation.
- **Year 2:** Jumpstart Nova Series A application ($55M fund, AHA and HCA Healthcare backed).
- **Year 3:** Regional expansion — Mississippi, Louisiana, Georgia. Formal VA procurement via VHI/ATLAS program with UAMS as co-applicant.

### UAMS Partnership — Honest Statement (Eric Peterson will probe)
"We are building on UAMS's published research and publicly available Barbershop Talk data. We do not have a formal partnership yet — that's honest. This hackathon is the start of that conversation. UAMS BioVentures is in this room. The right next step is a formal pilot agreement where Bro2Bro integrates into the Barbershop Talk workflow and UAMS provides the community relationships and IRB oversight."

### Competitive Moat (judges will ask about IP)
Not a patent — it's the network. Every barber certified as a Community Health Ambassador, every UAMS barbershop integrated, every peer mentor onboarded, every BCBS member enrolled — those relationships are not copyable. Teladoc has $18 billion and cannot walk into a Pine Bluff barbershop and have the conversation a trusted barber can. The IP is the network, the CHW training system, and the culturally specific conversation design — those take years to replicate.

### Target Market
- **Primary:** Black men ages 18–40 (lean canvas core target), expanding to 18–65+ in Arkansas
- **Secondary:** Barbers serving as Community Health Worker trustees (~3,000 licensed barbers in AR)
- **Tertiary:** Healthcare providers, BCBS Arkansas, AR Medicaid — paying for outcomes
- **Veterans segment:** Black veterans face compound racial health disparities + military trauma (PTSD, TBI, MST) — specialized crisis escalation (988 Veterans Crisis Line) + veteran peer mentor track
- **TAM:** ~6M Black men with chronic conditions in the US
- **SAM:** ~500K in Arkansas + neighboring underserved states
- **SOM (Year 1):** 5,000 active users in Little Rock + 3 rural AR counties

### The Team — Team 7
| Name | Role |
|------|------|
| **Amir Houston** | Project Manager, Researcher, Communications, Presentation |
| **Bryan Smith** | Pitch Team, Presentation, Communications |
| **David Adedeji** | Tech Team (Backend) |
| **Tinodaishe Lincoln Chitswa** | Tech Team (Frontend / Full-Stack) |
*(Add any additional team members and their roles here)*

### Institutional Backing / Partners (for traction slide)
UAMS (University of Arkansas for Medical Sciences) · UA Little Rock · BCBS Arkansas · Arkansas Dept. of Health · Robert Wood Johnson Foundation · Central Arkansas VAHCS · Arkansas Children's

---

## APP SCREENSHOTS — WHERE TO USE THEM
*(Attach screenshots to your message; place them exactly as listed)*

| Slide | Screenshot to use |
|-------|------------------|
| Slide 4 (Solution) | Full dashboard overview + Bro.AI chat interface |
| Slide 5 (Product Features) | Chat screen, Resources map (Leaflet), Crew accountability screen |
| Slide 6 (How It Works) | Landing page "How It Works" section or signup role-selection screen |
| Slide 9 (Traction) | Landing page hero section with stats / trust marquee |
| Slide 14 (Closing) | Hero screenshot with phone mockup |

---

## SLIDE STRUCTURE — 14 SLIDES

For every slide, output in this format:
```
## SLIDE [N] — [TITLE]
**Eyebrow Label:** [SHORT UPPERCASE LABEL]
**Headline:** [exact text for the slide]
**Subhead:** [if any]
**Body Copy / Bullets:** [all text, ruthlessly edited — max 6 bullets, max 8 words per bullet]
**Layout:** [describe visually — split, grid, full-bleed, centered, etc.]
**Key Visual:** [what goes here and exactly where]
**Design Notes:** [specific color, weight, sizing, spacing instructions]
```

---

### SLIDE 1 — COVER
**Goal:** Judges recognize the brand in under 2 seconds. Bold. Minimal.

- Background: Black `#000000`
- Bro2Bro logo — large, centered or left-weighted
- Tagline (large, Inter Black, white): *"The Barbershop Got Men Talking. We Built What Comes Next."*
- Sub-line (Inter Regular, gray): *"AI-powered wellness for Black men in Arkansas"*
- Bottom row: Team 7 · AI + Health Tech Hackathon · 2026
- Hackathon badge bottom-right corner
- Subtle radial glow behind logo — gold `#f59e0b` at 6% opacity, 300px radius

---

### SLIDE 2 — THE PROBLEM
**Goal:** One number stops the room. Then the context lands.

- Eyebrow: "THE PROBLEM" in gold, uppercase
- Hero stat (Inter Black, 72pt, gold `#f59e0b`): **"4–6 YEARS"** → subtext: *"The gap in life expectancy between Black men and white men. From conditions that are manageable."*
- Left column bullets (below the stat):
  - Only 1 in 3 Black men with hypertension has it controlled
  - 40% higher cardiovascular mortality rate in Black men
  - Arkansas ranks bottom-5 in US health outcomes
- Right column (the barrier layer — 4 chips in a 2×2 grid, teal outline):
  - Healthcare distrust
  - Mental health stigma
  - No culturally competent care
  - Rural access deserts
- No photo — the number is the visual anchor

---

### SLIDE 3 — THE INSIGHT / WHY NOW
**Goal:** The proof that it works. The "aha" moment.

- Black background (dark impact slide)
- Left panel (60% width):
  - Eyebrow: "PEER-REVIEWED PROOF" in teal
  - Big stat: **"63.6%"** in gold, Inter Black, 80pt
  - Sub-stat line: *"BP control rate with barbershop + AI follow-up"*
  - vs. contrast chip (teal background, black text): **"11.7%"** *"without it"*
  - Source caption (Inter Light, 10pt, gray): *UAMS LABBPS Trial · Jordan et al., 2024*
- Right panel (40% width, white background, rounded-2xl):
  - Headline: *"The barbershop already works."*
  - 3 brief points:
    - Most trusted institution in Black male culture
    - AI can now scale that conversation 24/7
    - Works on any phone — SMS-first, no app required
  - Quote chip (amber tint background): *"We didn't invent the trust. We extended the room."*
- UAMS logo bottom-left of dark panel

---

### SLIDE 4 — THE SOLUTION
**Goal:** One sentence. Three pillars. Product screenshot.

- White background
- Eyebrow: "OUR SOLUTION" in gold
- Headline (Inter Black, 40pt): *"Bro2Bro: The barbershop, in your pocket, 24/7."*
- One-liner (Inter Regular, 15pt, gray): *"Free for users. Culturally built. Privacy-first. Powered by AI."*
- Three pillar cards (horizontal, rounded-2xl, gold/teal/black icon badges):
  - 🗣 **TALK** — Bro.AI: judgment-free wellness chat, 24/7, no clinical jargon, 988 crisis escalation
  - 🗺 **CONNECT** — Find free clinics, book appointments, link with peer mentors
  - 👥 **CREW** — Accountability groups: streaks, BP milestones, shared 90-day journey
- Right side or bottom: floating app screenshot (dashboard or chat), rounded-2xl, soft shadow
- Footnote (gray, 10pt): *"Peer mentors share personal experience — they do not give medical advice. Screened, trained in scope, covered under platform terms."*

---

### SLIDE 5 — PRODUCT FEATURES
**Goal:** Show the actual product. Screenshots are the copy.

- White background
- Eyebrow: "THE PRODUCT" in gold
- Headline: *"Everything they need. Nothing they don't."*
- 2×2 screenshot grid (each card: gold/teal label chip above, Inter Semibold caption below):
  - **Bro.AI Chat** — motivational interviewing style, emoji-friendly, 988 escalation built-in
  - **Resource Finder** — Leaflet map: free clinics, barbershops, churches, support groups
  - **Crew Accountability** — 90-day journey, streak tracking, family sharing
  - **CHW Certification** — Barbers earn credentials + Medicaid billing access
- Each card: rounded-2xl frame, `0 4px 24px rgba(0,0,0,0.08)` shadow, 1px `#e5e7eb` border

---

### SLIDE 6 — HOW IT WORKS
**Goal:** Zero confusion. Three steps, visual flow.

- Off-white `#f9fafb` background
- Eyebrow: "HOW IT WORKS" in teal
- Headline: *"60 seconds to get started. A lifetime of support."*
- Horizontal step flow (Step 1 → 2 → 3 → 4), arrow connectors:
  - **① SIGN UP** (gold badge) — Choose your role: Member, Barber, Mentor, Provider, or Family. 60 seconds.
  - **② TALK TO BRO.AI** (teal badge) — Tell it what's going on. No judgment, no jargon. It asks the right questions.
  - **③ BUILD YOUR CREW** (black badge) — Invite your guys. Health challenges. Shared milestones.
  - **④ GET REAL CARE** (gold badge, smaller) — Book a clinic, connect with a mentor, or talk to a provider — inside the app.
- Each step: rounded-2xl card, title Inter Bold, description Inter Regular gray, 14pt

---

### SLIDE 7 — TARGET MARKET
**Goal:** Specific, sized, credible. Not generic.

- White background
- Eyebrow: "THE MARKET" in gold
- Headline: *"A underserved market with proven demand and zero culturally-built solutions."*
- TAM/SAM/SOM — concentric circles (gold/teal/light gray):
  - **TAM** (gold): ~6M Black men with chronic conditions, US
  - **SAM** (teal): ~500K Arkansas + underserved neighboring states
  - **SOM** (gray): 5,000 active users Year 1, Little Rock + 3 rural AR counties
- Three persona cards below (rounded-2xl, horizontal):
  - 👤 **Member** — Black men 18–40 (lean canvas core) / 18–65+ — seeking health info through trusted people
  - ✂️ **Barber/Trustee** — ~3,000 licensed AR barbers, earn CHW credentials + Medicaid billing
  - 🏥 **Provider/Insurer** — BCBS AR, AR Medicaid — pay for outcomes, not per-user
- Footer insight chip (amber tint): *"This model works anywhere barbershop culture thrives — it's a scalable playbook."*

---

### SLIDE 8 — BUSINESS MODEL
**Goal:** The inverted incentive lands clearly. Free for users = the moat.

- Split layout: dark left panel (40%) + white right panel (60%)
- Left panel (black background):
  - Eyebrow (teal): "BUSINESS MODEL"
  - Main statement (Inter Black, 36pt, white): *"Free for users."*
  - Sub-statement (Inter Regular, 16pt, gold): *"Healthcare systems pay. Communities benefit."*
  - Small note (gray, 12pt): *"The model inverts the standard health app incentive."*
- Right panel (white): 4 revenue stream cards stacked, each with icon + label + 1-line description:
  - 💻 **B2B SaaS** (teal label) — Health system dashboard: patient engagement, routing, outcomes
  - 🤝 **Insurer Contracts** (gold label) — BCBS AR, Medicaid pay-for-outcomes model
  - 📜 **CHW Certification** (black label) — Barber program fees + Medicaid billing split
  - 🏛 **Grant Funding** (teal label) — CDC via UAMS, RWJF, AR Dept. of Health

---

### SLIDE 9 — TRACTION & VALIDATION
**Goal:** Dark, confident, logo-heavy. Let the evidence speak.

- Black background
- Eyebrow: "TRACTION" in gold, uppercase
- Headline (Inter Black, white): *"Built on proof. Not speculation."*
- Three stat callouts horizontally (Inter Black, gold, large):
  - **63.6%** · BP control rate (LABBPS Trial)
  - **5×** · improvement vs. standard care
  - **2024** · Peer-reviewed publication (Jordan et al.)
- Divider line in `#333` 
- "Built on the shoulders of:" — partner logo row (white/light versions):
  - UAMS · UA Little Rock · BCBS Arkansas · Arkansas Dept. of Health · Robert Wood Johnson Foundation · Central Arkansas VAHCS · Arkansas Children's · AI Healthtech Hackathon badge
- Bottom footnote (gray, 10pt): *"UAMS BioVentures co-development partnership discussions initiated at this hackathon."*
- App landing page screenshot optional — bottom right, shadowed phone mockup

---

### SLIDE 10 — COMPETITIVE LANDSCAPE
**Goal:** Clear positioning, no arrogance.

- White background
- Eyebrow: "COMPETITIVE POSITION" in teal
- Headline: *"There is no culturally built alternative. That's the opportunity."*
- 2×2 positioning matrix (vertical axis: Cultural Competency Low→High; horizontal axis: Accessibility Low→High):
  - **Top-right quadrant (gold dot):** Bro2Bro — high cultural competency + high accessibility
  - **Top-left:** BetterHelp / Talkspace — high cost, culturally neutral, not SMS
  - **Bottom-right:** MyFitnessPal / generic health apps — accessible but generic
  - **Bottom-left:** Epic / patient portals — clinical, institutional, inaccessible
- Below matrix: 3 "unfair advantage" chips (pill-shaped, alternating gold/teal/black):
  - **Barbershop trust infrastructure** — built in, not bolted on
  - **SMS-first** — works on any phone, reaches rural communities
  - **Free for users** — revenue from systems, not individuals

---

### SLIDE 11 — GO-TO-MARKET
**Goal:** Credible phased path. Not fantasy.

- Off-white background
- Eyebrow: "GO-TO-MARKET" in gold
- Headline: *"IRB data is the unlock. Everything else follows."*
- Horizontal timeline (3 phases + Year 3 expansion, color-coded teal→gold→black):

  **Phase 1 — NOW TO 6 MONTHS (teal)**
  - UAMS IRB-approved pilot
  - 10 barbershops · 100 men · SMS-only MVP
  - Collect BP + engagement data

  **Phase 2 — 6 TO 18 MONTHS (gold)**
  - CDC Prevention Center grant (via UAMS)
  - AR Medicaid integration
  - 50 CHW-certified barbers
  - 25,000 user target

  **Phase 3 — 18 TO 36 MONTHS (black)**
  - BCBS AR pay-for-outcomes contract
  - Jumpstart Nova Series A ($55M fund, AHA + HCA)
  - Mississippi · Louisiana · Georgia expansion

- Channels chip row (small, below timeline): Barbershop referrals · UAMS clinical referrals · Church partnerships · Community events · Earned media (no paid ads)

---

### SLIDE 12 — THE TEAM
**Goal:** Names, roles, relevant credibility. Show lived connection.

- White background
- Eyebrow: "THE TEAM" in gold
- Headline: *"Team 7 — built by people who understand the room."*
- Team member cards in a row (rounded-full avatar / headshot if available, name in Inter Bold, role in Inter Regular gray, credential chip in gold or teal):
  - **Amir Houston** · Project Manager, Research, Communications
  - **Bryan Smith** · Pitch, Presentation, Communications
  - **David Adedeji** · Tech — Backend
  - **Tinodaishe Chitswa** · Tech — Frontend / Full-Stack
  *(Add additional members as needed)*
- Optional: one-line team connection statement at bottom — why this team cares about this problem

---

### SLIDE 13 — THE ASK
**Goal:** Clear. Specific. Actionable for the judges in this room.

- Black background
- Eyebrow: "THE ASK" in gold, uppercase
- Headline (Inter Black, white): *"Help us take the first step."*
- Three ask cards (rounded-2xl, white panels on black, stacked or horizontal):
  - 🔬 **UAMS Partnership** — Formal pilot agreement: integrate into Barbershop Talk workflow. UAMS provides community relationships + IRB oversight. We bring the technology.
  - 💰 **Seed Funding Path** — Support CDC Prevention Center grant application (co-applicant with UAMS). Connect us to AR Medicaid and BCBS innovation teams.
  - 📣 **Platform + Network** — Introductions to the 10 barbershops needed for the pilot. Media credibility from this hackathon for grant applications.
- Bottom CTA (Inter Semibold, gold): *"The IRB data is the proof we need. We're asking for the chance to collect it."*

---

### SLIDE 14 — CLOSING / THANK YOU
**Goal:** Leave them with one thought. Bookend the deck.

- Black background (mirrors the cover — intentional bookend)
- Bro2Bro logo — large, centered
- Tagline (Inter Black, white, large): *"The Barbershop Got Men Talking."*
- Second line (Inter Black, gold): *"We Built What Comes Next."*
- Closing statement (Inter Regular, gray, 14pt): *"Health equity isn't a feature. It's the product."*
- Bottom row: website URL · team contact email · QR code (optional, links to live demo)
- Hackathon badge + UAMS badge row — very bottom
- Same radial gold glow as cover — full circle, brand recognition complete

---

## QUALITY CONSTRAINTS — NON-NEGOTIABLE

- Maximum **8 words per bullet** on any slide — edit ruthlessly
- Every slide must have exactly **one visual anchor** — no text-only slides
- Every stat must be **sourced** (LABBPS trial, JMIR review, census data) — clinical judges will check
- No more than **6 bullets per slide**
- The deck reads as **one story arc:** Problem → Proof → Solution → Market → Model → Traction → Team → Ask
- Every slide must feel like it belongs to the same design system as the Bro2Bro app
- **No generic startup language** — no "disrupt," "revolutionize," "synergy," "ecosystem play"
- **No adding slides** not in this list — the 14 slides above are the complete deck
- Privacy/data slide notes go in footnotes or speaker notes — not as body bullets (judges probe verbally, not from slides)

---

## SPEAKER NOTES (critical for judge Q&A — add to each relevant slide)

Include these as slide speaker notes, not on-slide content:

**Slide 4 — Peer mentor liability (Erin Parker will ask):**
"Peer mentors share personal experience — they do not give medical advice. They are screened, trained in scope boundaries, and covered under the platform's terms of service, which explicitly distinguishes peer sharing from clinical guidance."

**Slide 4 / Tech Q — LLM data lifecycle (Wu will ask):**
"No PHI ever enters the LLM context. Conversation history is stored encrypted under anonymous IDs. LLM provider logs are purged after 30 days. The anonymous ID is the only identifier that touches the AI layer."

**Slide 4 / Tech Q — AI bias (Wu will probe):**
"Our system prompt is built specifically for this population — cultural context is embedded, not inferred. A community advisory board of Black men and Black healthcare professionals reviews sample AI outputs quarterly and tests adversarially."

**Slide 9 — UAMS formal partnership (Eric Peterson will ask):**
"We don't have a formal partnership yet — that's honest. This hackathon is the start of that conversation. UAMS BioVentures is literally in this room. We're asking for a pilot agreement where Bro2Bro integrates into the Barbershop Talk workflow."

**Slide 11 — VA integration (Salena Wright-Brown will ask):**
"We don't compete with VA services — we're a trusted on-ramp to them. Near-term: include VA resources in care navigation, invite VA CHWs to use the barber dashboard. Year 3: formal procurement via VHI/ATLAS program, co-applied with UAMS."

**Slide 13 — Crisis liability (everyone will ask):**
"Platform carries wellness liability insurance. Crisis protocol is automated and human-backed: keyword detection triggers 988 immediately, human reviewer alerted within minutes. The AI is not the last line of defense — it's the first responder."

---

*End of prompt. All information needed to generate the complete 14-slide deck is above. Begin with Slide 1.*
