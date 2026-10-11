# G-01 RozgarLink — Screen-by-Screen Plan

**Date:** 2026-10-11
**Rule of the project:** old code stays, new G-01 code goes in a new folder beside it, useless code gets deleted.
**G-01 in one line:** strict eligibility gate first (fail one rule = job disappears, AI gets no vote), then rank only survivors with smart skill matching, then explain everything + suggest courses.

Each entry below has: what the screen is **now**, a **verdict**, and a **prompt** — copy-paste the prompt to an agent (or me) to execute it.

---

## A. DELETE — useless code (3 files, ~235 lines)

### A1. HomeScreen (`src/screens/HomeScreen.tsx`, 166 lines)
- **Now:** An old customer home with hero text + language chips. Not registered in any navigator — zero importers. Dead.
- **Verdict:** DELETE.
- **Prompt:** `Delete src/screens/HomeScreen.tsx. It is orphaned (no navigator registers it, nothing imports it). Then delete the TRANSLATIONS block (lines ~470–567) in src/data/mockData.ts and the TranslationStrings interface (~line 190) in src/types.ts, which exist only for HomeScreen. Run npm run typecheck and confirm 0 errors.`

### A2. CustomerPortalScreen (`src/screens/CustomerPortalScreen.tsx`, 1 line)
- **Now:** A one-line re-export of the navigator. Imported by nothing.
- **Verdict:** DELETE.
- **Prompt:** `Delete src/screens/CustomerPortalScreen.tsx (1-line dead re-export, zero importers). Run npm run typecheck to confirm 0 errors.`

### A3. AdminScreen (`src/screens/AdminScreen.tsx`, 68 lines)
- **Now:** Federation analytics (forecast/societies/fairshare tabs) showing the same data the 15-screen federation portal now covers properly. Still a registered route (`Admin`) and the AI's `open-admin` action points at it.
- **Verdict:** DELETE (after rewiring its two callers).
- **Prompt:** `Delete src/screens/AdminScreen.tsx and remove the Admin route from RootStackParamList (src/navigation/types.ts) and RootNavigator. In src/screens/AIScreen.tsx runAction, point the 'open-admin' case at the FederationPortal Reports screen instead of Admin. In src/services/rozgarAIService.ts keep the 'open-admin' action type (repurposed). Run typecheck (0 errors) and eslint (0 errors).`

---

## B. KEEP AS-IS — old app stays working (no G-01 work)

### B1. AuthScreen (`src/screens/AuthScreen.tsx`, 292 lines)
- **Now:** Login/signup, OTP + password, 4 demo roles. Entry point of the app.
- **Verdict:** KEEP. G-01 needs logins too.
- **Prompt:** `No action.`

### B2. CustomerDashboardScreen (217), ServicesScreen (78), BookingScreen (136), CustomerBookingsScreen (140), CustomerPaymentsScreen (51), SavedWorkersScreen (28), WorkersScreen (45), WorkerDetailScreen (59), EmergencyScreen (46), WelfareScreen (37), MapScreen (189), AccountScreen (80)
- **Now:** The full customer booking flow: search → map → worker → book → track → pay → rate, plus emergency and welfare info pages.
- **Verdict:** KEEP. This is the old app; G-01 builds beside it, not on top of it. One exception: AccountScreen's 6-language chips still write the dead `AppState.language` — rewire them to `useI18n()` (3 langs, persisted) when the old language state is removed.
- **Prompt:** `No action, except AccountScreen: replace useAppState().language/setLanguage with useI18n().lang/setLang, and reduce the chips from 6 codes to en/hi/mr.`

### B3. WorkerPortalScreen (77), WorkerJobsScreen (70), WorkerEarningsScreen (50)
- **Now:** Worker home, job list, earnings. Demo data.
- **Verdict:** KEEP. Unrelated to matching, still part of the old app.
- **Prompt:** `No action.`

### B4. CooperativePortalScreen (69), CoopRequestsScreen (64), CoopWorkforceScreen (63), CoopPaymentsScreen (40), CoopMoreScreen (51)
- **Now:** One society's admin: requests, 40 workers, payments.
- **Verdict:** KEEP. Note for later: societies are the natural authors of manually-entered opportunities (Section D5), so this portal may grow an "Post opportunity" button — but nothing changes now.
- **Prompt:** `No action.`

### B5. AIScreen (`src/screens/AIScreen.tsx`, 176 lines)
- **Now:** Chat guide answering from demo numbers, trilingual, federation snapshot wired.
- **Verdict:** KEEP. Later it can explain match results conversationally — not now.
- **Prompt:** `No action.`

### B6. Federation Dashboard/Societies/Jobs/Map/Emergency/Payments/Welfare/Verification/Reports/Notifications/Settings/More (11 screens)
- **Now:** Oversight views over the same demo store. Correct and working.
- **Verdict:** KEEP. G-01's new engine reads the same store; these screens don't change.
- **Prompt:** `No action.`

---

## C. KEEP + EVOLVE — existing screens that become G-01 pieces

### C1. WorkerPassportScreen (`src/screens/WorkerPassportScreen.tsx`, 56 lines) + FederationWorkerPassport (`src/portals/fed/WorkerSkillPassport.tsx`, 220 lines)
- **Now:** Certificates, verification status, rating, welfare card. Static demo content.
- **Verdict:** EVOLVE → this is where a seeker's **qualifications** live, which is half the G-01 eligibility input.
- **Prompt:** `Make the worker passport editable for demo purposes: add certificate add/remove (name, issuer, expiry) and a location edit, persisted to AsyncStorage. Expose a getSeekerQualifications(workerId) helper returning { certifications[], verificationStatus, location } in the shape the new eligibility engine expects (see Section E). Do not change the visual layout.`

### C2. FederationWorkforce (`src/portals/fed/screens/FederationWorkforce.tsx`, 304 lines)
- **Now:** Worker directory (9 filters) + supply/demand intelligence.
- **Verdict:** EVOLVE → this becomes the **candidate pool browser** for G-01.
- **Prompt:** `Add a "Match preview" action on each worker row: tapping it runs the new eligibility engine (Section E) for that worker against all open opportunities and shows eligible count + top-3 ranked matches in a bottom sheet, reusing RecordCard and StatusBadge. Read-only; no changes to existing filters.`

### C3. FederationAllocation (`src/portals/fed/screens/FederationAllocation.tsx`, 314 lines)
- **Now:** Fair ranking with factor bars + "why this worker?" — the closest thing to G-01 ranking that exists. But it ranks everyone; nothing is ever excluded.
- **Verdict:** EVOLVE → this is where the **eligibility gate** lands.
- **Prompt:** `Add a strict eligibility pre-filter to the allocation screen using the new engine (Section E): before ranking, drop every candidate failing any hard criterion, show an "Excluded (n)" collapsible section listing each excluded worker with the exact failing condition, and rank only survivors. Keep the fair-boost formula and factor bars unchanged. The gate must not consult any AI service — pure predicate over stated criteria.`

### C4. FederationTraining (`src/portals/fed/screens/FederationTraining.tsx`, 228 lines)
- **Now:** Training intakes with eligible/enrolled counts, renewal queue.
- **Verdict:** EVOLVE → this becomes the **course catalogue + pathway** surface.
- **Prompt:** `Add a course catalogue section backed by a new static file in the new folder (code, title, skillsTaught[], duration, provider). Add per-candidate gap view: given a worker and a target opportunity, list missing skills and map each to catalogue courses (Section E pathways engine). Keep existing intakes untouched.`

### C5. FederationForecast (`src/portals/fed/screens/FederationForecast.tsx`, 255 lines)
- **Now:** Demand vs workforce charts.
- **Verdict:** KEEP, no evolution needed. Listed here only because shortage data may feed "which gaps matter most" later.
- **Prompt:** `No action.`

---

## D. NEW SCREENS — G-01 needs these, nothing like them exists

### D1. Seeker Profile screen (NEW)
- **Now:** Nothing. Seeker data is scattered across worker profiles and passport.
- **Prompt:** `Build a new SeekerProfile screen in the new folder: editable skills (free text + taxonomy suggestions), qualifications/certificates list, location (reuse LocationSelector), preferences (max commute km, min pay, work types). Persist to AsyncStorage. Any save must immediately re-run matching and refresh the Match Results screen (D3) — visible recompute, no stale lists. Follow FedScreen/Card2/ActBtn conventions from src/portals/fed/fedUI.tsx.`

### D2. Opportunity Entry form (NEW)
- **Now:** Nothing. All 12 jobs are hardcoded in fedData.ts.
- **Prompt:** `Build a new OpportunityForm screen in the new folder: title, description, required skills (free text), hard eligibility criteria list (criterion type: certificate/city/age/experience + operator + value), location, pay range, work involved. Validate: at least 1 hard criterion and 1 required skill. Save to AsyncStorage-backed opportunity store with create/update/delete. Entries appear in Match Results (D3) immediately.`

### D3. Match Results screen (NEW — the heart of G-01)
- **Now:** Nothing. This is the screen the problem statement describes.
- **Prompt:** `Build a new MatchResults screen in the new folder. For the active seeker profile, run the eligibility engine (Section E) over all opportunities: (1) show ELIGIBLE matches ranked with score + plain-language reason per rank ("#2 because wiring matches 90% and you're 2 km away"), each expandable to its factor breakdown; (2) show a separate INELIGIBLE section where each entry names the exact failing condition ("needs Mumbai address — you live in Pune"); (3) never mix the two lists and never rank an ineligible item. Support en/hi/mr via the existing useI18n(). Reuse RecordCard, StatusBadge, HBarList.`

### D4. Skill Gap + Pathway screen (NEW)
- **Now:** Nothing per-candidate (only aggregate trade gaps).
- **Prompt:** `Build a new SkillGap screen in the new folder: pick a seeker + a target opportunity they fail or nearly pass; show missing skills (required minus matched-after-taxonomy), and for each missing skill list catalogue courses that teach it (from the static catalogue file), with provider + duration. "No internet courses" rule: only catalogue entries, and if a skill has no course, say so plainly instead of inventing one.`

### D5. Opportunity Inbox entry point (NEW button, not a screen)
- **Now:** Societies have no way to post anything.
- **Prompt:** `Add a "Post opportunity" button to CoopMoreScreen that navigates to the OpportunityForm (D2) prefilled with the society id. One button + one navigation param; nothing else changes on that screen.`

---

## E. NEW ENGINE FILES — the new folder's core (build first, screens consume it)

Proposed folder: `src/rozgarlink/` (rename if the team picks another name).

### E1. `types.ts` — G-01 data shapes
- **Prompt:** `Create src/rozgarlink/types.ts: SeekerProfile { id, skills: string[], qualifications: string[], city, lat?, lng?, preferences { maxCommuteKm, minPay, workTypes[] } }, Opportunity { id, title, description, requiredSkills: string[], criteria: Criterion[], city, lat?, lng?, payMin?, payMax?, workInvolved, societyId? }, Criterion { type: 'certificate'|'city'|'age'|'experience', operator: string, value: string|number }, MatchResult { opportunityId, eligible: boolean, failedConditions: string[], score?: number, reasons?: string[] }, Course { code, title, skillsTaught: string[], duration, provider }. Plain types only, no logic.`

### E2. `skillTaxonomy.ts` — same skill, different words
- **Prompt:** `Create src/rozgarlink/skillTaxonomy.ts: a static synonym map (e.g. wiring: ['electrical fitting','wireman work',...], 20+ trades to start) with canonicalize(skill): string and skillSimilarity(a, b): 0|0.5|1 (exact=1, same canonical family=0.8, else 0). Pure functions, fully unit-testable, zero AI/network imports — add a comment stating AI similarity may only replace the 0.8 tier later and must never touch eligibility.`

### E3. `eligibility.ts` — THE GATE (most important file)
- **Prompt:** `Create src/rozgarlink/eligibility.ts: checkEligibility(seeker, opportunity): { eligible: boolean, failedConditions: string[] } — every criterion evaluated as pass/fail against stated values only; fail one = eligible:false with that condition's plain-language name recorded. No scores, no thresholds, no AI imports (add a lint comment banning them from this file). Must be synchronous and deterministic.`

### E4. `ranking.ts` — rank only survivors
- **Prompt:** `Create src/rozgarlink/ranking.ts: rankEligible(seeker, opportunities): MatchResult[] — takes ONLY opportunities that passed checkEligibility (assert this: throw if any input is ineligible, so the gate can never be silently skipped), scores by skill similarity (E2) + commute + pay preference + experience, returns sorted with per-factor reasons strings. Reuse the weighting spirit of matchingService.jobMatchScore but never import it — the old scorer blends eligibility into ranking, which is exactly what G-01 forbids.`

### E5. `pathways.ts` — gaps to courses
- **Prompt:** `Create src/rozgarlink/pathways.ts: suggestPathways(seeker, opportunity, catalogue: Course[]): { missingSkills: string[], suggestions: { skill, courses: Course[] }[] } — missing = required minus taxonomy-matched seeker skills; map each to catalogue courses teaching it; skills with no course get an empty list (UI says so plainly). Plus a static COURSES catalogue seed file with 10+ entries. No network calls.`

### E6. `store.ts` — persistence + live recompute
- **Prompt:** `Create src/rozgarlink/store.ts: a RozgarLinkProvider context holding seeker profiles + opportunities in AsyncStorage (hydrated-gate pattern from LocationContext — never clobber stored data), with selectors getMatches(seekerId) (gate then rank) and getGaps(seekerId, opportunityId). Any profile/location edit must synchronously recompute matches so D3 never shows stale results.`

---

## F. BUILD ORDER (recommended)

1. **E1 → E2 → E3** (types, taxonomy, gate — the foundation; testable with zero UI)
2. **E4 → E5 → E6** (ranking, pathways, store)
3. **D2 → D1** (entry form, then profile — so there's data to match)
4. **D3** (results — consumes everything)
5. **D4 → D5** (gaps, society button)
6. **C1 → C2 → C3 → C4** (evolve old screens last, when the engine is proven)
7. **A1 → A2 → A3** (deletions — do last, when nothing references the dead code)

**Out of scope for v1:** AI skill extraction (rule: AI never decides eligibility — add extraction later behind the same ban), real backend (AsyncStorage throughout, same as the old app), Play-Store signing (debug keystore is fine for the SIH demo).
