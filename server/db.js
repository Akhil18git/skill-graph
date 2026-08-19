const neo4j = require('neo4j-driver');
require('dotenv').config();
const { nodes, relationships } = require('./seedData');

const uri = process.env.NEO4J_URI || 'bolt://localhost:7687';
const user = process.env.NEO4J_USER || 'neo4j';
const password = process.env.NEO4J_PASSWORD || 'password';

let driver = null;
let isConnectedToNeo4j = false;

// Initialize Neo4j / CognoDB driver
try {
  driver = neo4j.driver(uri, neo4j.auth.basic(user, password), {
    maxConnectionTimeout: 3000,
    disableLosslessIntegers: true
  });
} catch (err) {
  console.warn('[DB] Could not initialize Neo4j driver:', err.message);
}

// Test connection on startup
async function checkConnection() {
  if (!driver) return false;
  let session = null;
  try {
    session = driver.session();
    await session.run('RETURN 1 AS test');
    isConnectedToNeo4j = true;
    console.log(`[DB] Successfully connected to CognoDB/Neo4j at ${uri}`);
    return true;
  } catch (err) {
    isConnectedToNeo4j = false;
    console.warn(`[DB] CognoDB/Neo4j not reachable at ${uri}. Operating in Fallback In-Memory Graph Driver mode.`);
    return false;
  } finally {
    if (session) await session.close();
  }
}

checkConnection();

function getDbStatus() {
  return {
    connected: isConnectedToNeo4j,
    uri,
    user,
    mode: isConnectedToNeo4j ? 'CognoDB / Neo4j Live Bolt Server' : 'In-Memory Graph Engine (Seeded)'
  };
}

/**
 * Executes a Cypher query on CognoDB/Neo4j if connected, or uses in-memory graph driver fallback.
 */
async function runQuery(cypherQuery, params = {}) {
  if (isConnectedToNeo4j && driver) {
    const session = driver.session();
    try {
      const result = await session.run(cypherQuery, params);
      return result.records.map(record => record.toObject());
    } catch (err) {
      console.error('[DB] Cypher Query Execution Error:', err.message);
      throw err;
    } finally {
      await session.close();
    }
  }

  // Fallback In-Memory Cypher Simulator
  return executeInMemoryQuery(cypherQuery, params);
}

/**
 * In-Memory Graph Query Engine for seamless evaluation when Neo4j is offline.
 */
function executeInMemoryQuery(cypher, params) {
  const queryLower = cypher.toLowerCase();

  // 1. Overview graph
  if (queryLower.includes('match (n)') && queryLower.includes('return n, r, m')) {
    const allNodes = [];
    Object.keys(nodes).forEach(group => {
      nodes[group].forEach(n => {
        let label = group.slice(0, -1).charAt(0).toUpperCase() + group.slice(0, -1).slice(1);
        if (group === 'people') label = 'Person';
        if (group === 'jobRoles') label = 'JobRole';
        if (group === 'companies') label = 'Company';
        if (group === 'technologies') label = 'Technology';
        allNodes.push({ id: n.id, label, properties: n });
      });
    });
    return [{ nodes: allNodes, relationships }];
  }

  // 2. Get all people
  if (queryLower.includes('match (p:person)') && queryLower.includes('return p')) {
    return nodes.people.map(p => {
      const pSkills = relationships
        .filter(r => r.from === p.id && r.type === 'HAS_SKILL')
        .map(r => {
          const sk = nodes.skills.find(s => s.id === r.to);
          return { ...sk, ...r.props };
        });
      const pProjects = relationships
        .filter(r => r.from === p.id && r.type === 'CONTRIBUTED_TO')
        .map(r => {
          const pr = nodes.projects.find(x => x.id === r.to);
          return { ...pr, ...r.props };
        });
      return { p, skills: pSkills, projects: pProjects };
    });
  }

  // 3. Get all roles
  if (queryLower.includes('match (j:jobrole)') && queryLower.includes('return j')) {
    return nodes.jobRoles.map(j => {
      const reqSkills = relationships
        .filter(r => r.from === j.id && r.type === 'REQUIRES_SKILL')
        .map(r => {
          const sk = nodes.skills.find(s => s.id === r.to);
          return { ...sk, ...r.props };
        });
      const companyRel = relationships.find(r => r.to === j.id && r.type === 'OFFERS_ROLE');
      const company = companyRel ? nodes.companies.find(c => c.id === companyRel.from) : null;
      return { j, requiredSkills: reqSkills, company };
    });
  }

  // 4. Role match & gap analysis
  if (queryLower.includes('role_match') || (queryLower.includes('personid') && queryLower.includes('roleid'))) {
    const personId = params.personId || 'p1';
    const roleId = params.roleId || 'j1';

    const person = nodes.people.find(p => p.id === personId);
    const role = nodes.jobRoles.find(j => j.id === roleId);

    // Direct skills
    const personDirectSkillRels = relationships.filter(r => r.from === personId && r.type === 'HAS_SKILL');
    const personDirectSkillIds = new Set(personDirectSkillRels.map(r => r.to));

    // Project demonstrated skills & tech
    const personProjectRels = relationships.filter(r => r.from === personId && r.type === 'CONTRIBUTED_TO');
    const projectEvidence = [];
    const acquiredSkillsFromProjects = new Set();

    personProjectRels.forEach(pRel => {
      const proj = nodes.projects.find(pr => pr.id === pRel.to);
      const projSkillRels = relationships.filter(r => r.from === proj.id && r.type === 'DEMONSTRATES_SKILL');
      const projTechRels = relationships.filter(r => r.from === proj.id && r.type === 'USES_TECH');

      projSkillRels.forEach(sr => {
        const sk = nodes.skills.find(s => s.id === sr.to);
        acquiredSkillsFromProjects.add(sk.id);
        projectEvidence.push({
          project: proj.name,
          role: pRel.props.role,
          demonstratedSkill: sk.name,
          relevance: sr.props.relevanceScore
        });
      });

      projTechRels.forEach(tr => {
        const tech = nodes.technologies.find(t => t.id === tr.to);
        const enabledSkillsRels = relationships.filter(r => r.from === tech.id && r.type === 'ENABLES_SKILL');
        enabledSkillsRels.forEach(er => {
          acquiredSkillsFromProjects.add(er.to);
        });
      });
    });

    // Required skills for target role
    const roleSkillRels = relationships.filter(r => r.from === roleId && r.type === 'REQUIRES_SKILL');
    const totalRequired = roleSkillRels.length;

    const matchedSkills = [];
    const missingSkills = [];

    roleSkillRels.forEach(rRel => {
      const sk = nodes.skills.find(s => s.id === rRel.to);
      const hasDirect = personDirectSkillIds.has(sk.id);
      const hasViaProject = acquiredSkillsFromProjects.has(sk.id);
      const directProp = personDirectSkillRels.find(r => r.to === sk.id);
      const candidateProficiency = directProp ? directProp.props.proficiency : 0;
      const requiredProficiency = rRel.props.requiredProficiency;

      // ✅ FIXED: A skill only counts as matched when the candidate's proficiency
      // actually MEETS or EXCEEDS the required level. Project verification provides
      // evidence context but does NOT substitute for meeting the proficiency bar.
      const proficiencyMet = hasDirect && candidateProficiency >= requiredProficiency;

      if (proficiencyMet) {
        matchedSkills.push({
          skill: sk,
          importance: rRel.props.importance,
          requiredProficiency,
          candidateProficiency,
          verifiedByProject: hasViaProject
        });
      } else {
        // Includes: skill not possessed at all, or possessed but below required level
        missingSkills.push({
          skill: sk,
          importance: rRel.props.importance,
          requiredProficiency,
          candidateProficiency,          // 0 = not possessed; >0 = has it but too low
          verifiedByProject: hasViaProject // still show project context as partial evidence
        });
      }
    });

    // Match % is based only on skills where proficiency threshold is fully met
    const matchPercentage = totalRequired > 0 ? Math.round((matchedSkills.length / totalRequired) * 100) : 0;

    return [{
      person,
      role,
      matchPercentage,
      matchedSkills,
      missingSkills,
      projectEvidence
    }];
  }

  // 5. Recommendations
  if (queryLower.includes('recommendation') || queryLower.includes('recommendedskill')) {
    const personId = params.personId || 'p1';

    // Build a map of personSkillId -> proficiency
    const personSkillRels = relationships.filter(r => r.from === personId && r.type === 'HAS_SKILL');
    const personProficiencyMap = new Map(personSkillRels.map(r => [r.to, r.props.proficiency]));

    const recMap = new Map();

    personSkillRels.forEach(pSkillRel => {
      const existingSkillId = pSkillRel.to;
      const rolesWithSkill = relationships.filter(r => r.to === existingSkillId && r.type === 'REQUIRES_SKILL').map(r => r.from);

      rolesWithSkill.forEach(roleId => {
        const role = nodes.jobRoles.find(j => j.id === roleId);
        const otherSkillRels = relationships.filter(r => r.from === roleId && r.type === 'REQUIRES_SKILL');

        otherSkillRels.forEach(osRel => {
          const candidateProf = personProficiencyMap.get(osRel.to);
          const requiredProf = osRel.props.requiredProficiency;

          const notPossessed = !personProficiencyMap.has(osRel.to);
          const proficiencyTooLow = personProficiencyMap.has(osRel.to) && candidateProf < requiredProf;

          if (notPossessed || proficiencyTooLow) {
            const recSkill = nodes.skills.find(s => s.id === osRel.to);

            if (recMap.has(recSkill.id)) {
              // Aggregate: add this role, keep highest required proficiency
              const existing = recMap.get(recSkill.id);
              if (!existing.connectedRoles.includes(role.title)) {
                existing.connectedRoles.push(role.title);
              }
              if (requiredProf > existing.requiredProficiency) {
                existing.requiredProficiency = requiredProf;
              }
              // Upgrade importance if this role has a higher one
              if (osRel.props.importance === 'CRITICAL' && existing.importance !== 'CRITICAL') {
                existing.importance = 'CRITICAL';
                existing.score = 95;
              }
            } else {
              recMap.set(recSkill.id, {
                skill: recSkill,
                connectedRoles: [role.title],
                importance: osRel.props.importance,
                candidateProficiency: candidateProf || 0,
                requiredProficiency: requiredProf,
                score: osRel.props.importance === 'CRITICAL' ? 95 : 80
              });
            }
          }
        });
      });
    });

    // Build final array with aggregated reason text
    const results = Array.from(recMap.values()).map(entry => {
      const notPossessed = entry.candidateProficiency === 0;
      const rolesText = entry.connectedRoles.join(', ');
      const reason = notPossessed
        ? `Missing skill required by: ${rolesText}`
        : `You have ${entry.skill.name} at ${entry.candidateProficiency}/5, but roles (${rolesText}) need up to ${entry.requiredProficiency}/5 — level up!`;
      return {
        ...entry,
        connectedRole: rolesText,
        reason
      };
    });

    return results.sort((a, b) => b.score - a.score);
  }

  // Default fallback
  return [];
}

module.exports = { runQuery, getDbStatus, checkConnection };
