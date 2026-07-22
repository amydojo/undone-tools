/*
 * Chaos Vault · Affective Contract Helpers
 * Clean-room, dependency-free reference implementations.
 *
 * These helpers do not infer emotions, diagnose people, or perform external
 * actions. They translate explicit user choices and bounded system evidence
 * into inspectable, reversible interface contracts.
 */
(function initChaosVaultAffective(root) {
  'use strict';

  const ADAPTATION_TIERS = Object.freeze({
    UNIVERSAL: 0,
    USER_INVOKED: 1,
    SUGGESTED: 2,
    LOW_RISK_AUTOMATIC: 3,
    CONSEQUENTIAL_AUTOMATIC: 4,
  });

  const VALID_BUDGET_POLICIES = Object.freeze([
    'one-step-at-a-time',
    'fewer-decisions',
    'protect-progress',
    'defer-optional-work',
  ]);

  const VALID_TONES = Object.freeze([
    'practical',
    'gentle',
    'playful',
    'direct',
    'reflective',
    'deep',
  ]);

  function assert(condition, message) {
    if (!condition) throw new TypeError(message);
  }

  function uniqueStrings(values) {
    return [...new Set((values || []).filter((value) => typeof value === 'string' && value.trim()).map((value) => value.trim()))];
  }

  function createStateHypothesis(input) {
    assert(input && typeof input === 'object', 'State hypothesis input is required.');
    assert(typeof input.construct === 'string' && input.construct.trim(), 'construct is required.');

    const confidence = Number(input.confidence);
    assert(Number.isFinite(confidence) && confidence >= 0 && confidence <= 1, 'confidence must be between 0 and 1.');

    const expiresAt = new Date(input.expiresAt);
    assert(!Number.isNaN(expiresAt.getTime()), 'expiresAt must be a valid date.');

    return Object.freeze({
      construct: input.construct.trim(),
      confidence,
      evidence: Object.freeze([...(input.evidence || [])]),
      competingExplanations: Object.freeze(uniqueStrings(input.competingExplanations)),
      expiresAt: expiresAt.toISOString(),
      userConfirmed: input.userConfirmed === true,
      scope: input.scope || 'current-task',
    });
  }

  function selectAdaptationTier(options) {
    const consequence = options?.consequence || 'low';
    const requested = options?.userRequested === true;
    const reversible = options?.reversible !== false;
    const visible = options?.visible !== false;

    if (requested) return ADAPTATION_TIERS.USER_INVOKED;
    if (consequence !== 'low') return ADAPTATION_TIERS.SUGGESTED;
    if (!reversible || !visible) return ADAPTATION_TIERS.SUGGESTED;
    return ADAPTATION_TIERS.LOW_RISK_AUTOMATIC;
  }

  function buildInteractionBudget(input) {
    assert(input && typeof input === 'object', 'Interaction budget input is required.');
    const policies = uniqueStrings(input.policies);
    policies.forEach((policy) => assert(VALID_BUDGET_POLICIES.includes(policy), `Unknown interaction policy: ${policy}`));

    return Object.freeze({
      id: input.id || `budget-${Date.now()}`,
      taskId: String(input.taskId || 'current-task'),
      policies: Object.freeze(policies),
      selectedBy: 'user',
      approved: input.approved === true,
      stableForTask: true,
      showFullView: input.showFullView !== false,
      expiresAt: input.expiresAt || null,
      externalActionsAllowed: false,
    });
  }

  function resolveToneContract(input) {
    const tone = String(input?.tone || 'practical');
    assert(VALID_TONES.includes(tone), `Unknown tone: ${tone}`);

    return Object.freeze({
      tone,
      chosenBy: 'user',
      changeable: true,
      maySkip: true,
      depthLimit: input?.depthLimit || (tone === 'deep' ? 'deep' : 'bounded'),
      scoreResponse: false,
      inferPersonality: false,
    });
  }

  function compileMinimumNecessaryInterface(input) {
    assert(input && typeof input === 'object', 'Task input is required.');
    assert(typeof input.goal === 'string' && input.goal.trim(), 'goal is required.');
    assert(typeof input.completion === 'string' && input.completion.trim(), 'completion is required.');

    const requiredSteps = [...(input.requiredSteps || [])];
    assert(requiredSteps.length > 0, 'At least one required step is required.');

    return Object.freeze({
      goal: input.goal.trim(),
      completion: input.completion.trim(),
      requiredSteps: Object.freeze(requiredSteps),
      optionalSteps: Object.freeze([...(input.optionalSteps || [])]),
      decisions: Object.freeze([...(input.decisions || [])]),
      facts: Object.freeze([...(input.facts || [])]),
      controls: Object.freeze(['show-full-plan', 'edit', 'cancel', 'copy', 'download', 'exit']),
      generatedMarkupAllowed: false,
      externalActionsAllowed: false,
    });
  }

  function createRecoveryContract(input) {
    assert(input && typeof input === 'object', 'Recovery contract input is required.');
    assert(typeof input.trigger === 'string' && input.trigger.trim(), 'trigger is required.');

    return Object.freeze({
      trigger: input.trigger.trim(),
      label: input.label || 'Something feels off?',
      optional: true,
      blocksPrimaryFlow: false,
      guidance: Object.freeze([...(input.guidance || [])]),
      returnTarget: input.returnTarget || 'current-step',
      blameLanguageAllowed: false,
    });
  }

  function buildContinuityEnvelope(input) {
    assert(input && typeof input === 'object', 'Continuity envelope input is required.');

    return Object.freeze({
      artifactId: input.artifactId || null,
      taskId: input.taskId || null,
      carriedFacts: Object.freeze([...(input.carriedFacts || [])]),
      userDeclaredNeeds: Object.freeze(uniqueStrings(input.userDeclaredNeeds)),
      sourceContextIncluded: input.sourceContextIncluded === true,
      consentedAt: input.consentedAt || null,
      expiresAt: input.expiresAt || null,
      separateStorage: true,
      canClearImmediately: true,
      automaticContinuation: false,
    });
  }

  function calibrateLanguage(input) {
    const confidence = Number(input?.confidence);
    assert(Number.isFinite(confidence) && confidence >= 0 && confidence <= 1, 'confidence must be between 0 and 1.');

    const observation = String(input?.observation || '').trim();
    assert(observation, 'observation is required.');

    let prefix = 'One possible reading is';
    if (confidence >= 0.85) prefix = 'The available evidence suggests';
    else if (confidence >= 0.65) prefix = 'This may indicate';

    return Object.freeze({
      text: `${prefix} ${observation}`,
      confidence,
      label: confidence >= 0.85 ? 'clear' : confidence >= 0.65 ? 'likely' : 'possible',
      competingExplanations: Object.freeze(uniqueStrings(input.competingExplanations)),
      correctionAllowed: true,
      diagnostic: false,
    });
  }

  function selectArtifactPresentation(input) {
    const interpretation = String(input?.interpretation || 'neutral').toLowerCase();
    const allowedTemplates = new Set(['receipt', 'specimen', 'archive', 'field-object', 'minimal-card']);
    const fallback = allowedTemplates.has(input?.fallbackTemplate) ? input.fallbackTemplate : 'minimal-card';

    const mappings = [
      { match: ['cost', 'effort', 'day'], template: 'receipt', rhythm: 'itemized' },
      { match: ['object', 'material', 'wear'], template: 'specimen', rhythm: 'archival' },
      { match: ['memory', 'continuity', 'history'], template: 'archive', rhythm: 'layered' },
      { match: ['discovery', 'scene', 'signal'], template: 'field-object', rhythm: 'cinematic' },
    ];

    const selected = mappings.find((entry) => entry.match.some((token) => interpretation.includes(token)));

    return Object.freeze({
      template: selected?.template || fallback,
      rhythm: selected?.rhythm || 'quiet',
      interpretation,
      mappingIsInspectable: true,
      generatedHtmlAllowed: false,
      quoteAuthenticityRequired: true,
    });
  }

  function createReversibleAction(input) {
    assert(input && typeof input === 'object', 'Action input is required.');
    assert(typeof input.actionId === 'string' && input.actionId.trim(), 'actionId is required.');

    const consequence = input.consequence || 'low';
    const undoWindowMs = Number(input.undoWindowMs ?? 8000);
    assert(Number.isFinite(undoWindowMs) && undoWindowMs >= 0, 'undoWindowMs must be non-negative.');

    return Object.freeze({
      actionId: input.actionId.trim(),
      consequence,
      previewRequired: consequence !== 'low',
      confirmationRequired: consequence === 'high',
      undoWindowMs,
      undoAttachedToOrigin: true,
      automaticExecution: false,
    });
  }

  function resolveValidEnding(ending) {
    const allowed = new Set(['keep', 'release', 'carry-forward']);
    assert(allowed.has(ending), `Unknown ending: ${ending}`);

    return Object.freeze({
      ending,
      equallyValid: true,
      preservesArtifact: ending !== 'release',
      requiresBoundedUndo: ending === 'release',
      createsTemporaryTaskContext: ending === 'carry-forward',
      performsExternalAction: false,
    });
  }

  const api = Object.freeze({
    ADAPTATION_TIERS,
    VALID_BUDGET_POLICIES,
    VALID_TONES,
    createStateHypothesis,
    selectAdaptationTier,
    buildInteractionBudget,
    resolveToneContract,
    compileMinimumNecessaryInterface,
    createRecoveryContract,
    buildContinuityEnvelope,
    calibrateLanguage,
    selectArtifactPresentation,
    createReversibleAction,
    resolveValidEnding,
  });

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root) root.ChaosVaultAffective = api;
})(typeof window !== 'undefined' ? window : globalThis);
