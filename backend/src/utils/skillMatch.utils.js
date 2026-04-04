/**
 * AI Skill Recommendation Utility
 * Uses TF-IDF-like scoring and keyword matching to recommend skill matches
 */

/**
 * Compute a simple similarity score between two arrays of skills
 * Returns a score 0-100
 */
const computeSkillMatchScore = (userAOffered, userAWanted, userBOffered, userBWanted) => {
  let score = 0;
  let matches = 0;

  const normalize = (str) => str.toLowerCase().trim();

  const aOffered = userAOffered.map(normalize);
  const aWanted = userAWanted.map(normalize);
  const bOffered = userBOffered.map(normalize);
  const bWanted = userBWanted.map(normalize);

  // Direct matches: A offers what B wants
  for (const skill of aOffered) {
    if (bWanted.some((w) => w === skill || w.includes(skill) || skill.includes(w))) {
      score += 30;
      matches++;
    }
  }

  // Direct matches: B offers what A wants
  for (const skill of bOffered) {
    if (aWanted.some((w) => w === skill || w.includes(skill) || skill.includes(w))) {
      score += 30;
      matches++;
    }
  }

  // Partial matches via keyword overlap
  const keywords = (skills) =>
    skills.flatMap((s) => s.split(/[\s,]+/)).filter((k) => k.length > 2);

  const aOfferedKeywords = keywords(aOffered);
  const bWantedKeywords = keywords(bWanted);
  const bOfferedKeywords = keywords(bOffered);
  const aWantedKeywords = keywords(aWanted);

  for (const kw of aOfferedKeywords) {
    if (bWantedKeywords.includes(kw)) score += 5;
  }
  for (const kw of bOfferedKeywords) {
    if (aWantedKeywords.includes(kw)) score += 5;
  }

  return Math.min(score, 100);
};

/**
 * Get skill recommendations for a user from a list of candidates
 * Returns sorted array with scores
 */
const getSkillRecommendations = (currentUser, candidates) => {
  const scored = candidates
    .filter((c) => c._id.toString() !== currentUser._id.toString())
    .map((candidate) => {
      const score = computeSkillMatchScore(
        currentUser.skillsOffered || [],
        currentUser.skillsWanted || [],
        candidate.skillsOffered || [],
        candidate.skillsWanted || []
      );
      return { user: candidate, matchScore: score };
    })
    .filter((r) => r.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);

  return scored;
};

/**
 * Find complementary skills (skills that pair well together)
 */
const SKILL_RELATIONSHIPS = {
  javascript: ['react', 'nodejs', 'typescript', 'vue', 'angular'],
  python: ['machine learning', 'data science', 'django', 'flask', 'ai'],
  design: ['figma', 'ui/ux', 'photoshop', 'illustrator', 'css'],
  photography: ['photo editing', 'lightroom', 'videography', 'photoshop'],
  guitar: ['music theory', 'piano', 'singing', 'songwriting'],
  cooking: ['baking', 'nutrition', 'food photography'],
  marketing: ['seo', 'social media', 'content writing', 'copywriting'],
  fitness: ['yoga', 'nutrition', 'crossfit', 'meditation'],
  spanish: ['french', 'italian', 'portuguese', 'language teaching'],
  writing: ['content writing', 'copywriting', 'blogging', 'editing'],
};

const getRelatedSkills = (skill) => {
  const normalized = skill.toLowerCase().trim();
  for (const [key, related] of Object.entries(SKILL_RELATIONSHIPS)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return related;
    }
    if (related.some((r) => normalized.includes(r) || r.includes(normalized))) {
      return [key, ...related.filter((r) => r !== normalized)];
    }
  }
  return [];
};

module.exports = { computeSkillMatchScore, getSkillRecommendations, getRelatedSkills };
