const express = require('express');
const router = express.Router();
const { runQuery, getDbStatus } = require('../db');

// Status endpoint
router.get('/status', (req, res) => {
  res.json(getDbStatus());
});

// Overview graph dataset for 2D visual canvas
router.get('/overview', async (req, res) => {
  try {
    const cypher = `
      MATCH (n)
      OPTIONAL MATCH (n)-[r]->(m)
      RETURN n, r, m
    `;
    const data = await runQuery(cypher);

    let formattedData;
    if (getDbStatus().connected) {
      const nodesMap = new Map();
      const relationships = [];
      const seenRels = new Set();

      data.forEach(row => {
        const n = row.n;
        const r = row.r;
        const m = row.m;

        if (n && n.properties) {
          const id = n.properties.id;
          if (id && !nodesMap.has(id)) {
            nodesMap.set(id, {
              id,
              label: n.labels[0],
              properties: n.properties
            });
          }
        }

        if (m && m.properties) {
          const id = m.properties.id;
          if (id && !nodesMap.has(id)) {
            nodesMap.set(id, {
              id,
              label: m.labels[0],
              properties: m.properties
            });
          }
        }

        if (r && n && m) {
          const from = n.properties.id;
          const to = m.properties.id;
          const relKey = `${from}-${r.type}-${to}`;
          if (from && to && !seenRels.has(relKey)) {
            seenRels.add(relKey);
            relationships.push({
              from,
              to,
              type: r.type,
              props: r.properties || {}
            });
          }
        }
      });
      formattedData = [{ nodes: Array.from(nodesMap.values()), relationships }];
    } else {
      formattedData = data;
    }

    res.json({ success: true, data: formattedData, cypherExecuted: cypher.trim() });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get people candidates
router.get('/people', async (req, res) => {
  try {
    const cypher = `
      MATCH (p:Person)
      OPTIONAL MATCH (p)-[hs:HAS_SKILL]->(s:Skill)
      OPTIONAL MATCH (p)-[ct:CONTRIBUTED_TO]->(pr:Project)
      RETURN p,
             collect(DISTINCT {skill: s, proficiency: hs.proficiency, years: hs.yearsExperience}) AS skills,
             collect(DISTINCT {project: pr, role: ct.role}) AS projects
    `;
    const data = await runQuery(cypher);

    let formattedData;
    if (getDbStatus().connected) {
      formattedData = data.map(row => {
        const p = row.p ? row.p.properties : {};
        const skills = (row.skills || [])
          .filter(s => s.skill !== null && s.skill !== undefined)
          .map(s => ({
            ...s.skill.properties,
            proficiency: s.proficiency,
            yearsExperience: s.years
          }));
        const projects = (row.projects || [])
          .filter(pr => pr.project !== null && pr.project !== undefined)
          .map(pr => ({
            ...pr.project.properties,
            role: pr.role
          }));
        return { p, skills, projects };
      });
    } else {
      formattedData = data;
    }

    res.json({ success: true, data: formattedData, cypherExecuted: cypher.trim() });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get job roles
router.get('/roles', async (req, res) => {
  try {
    const cypher = `
      MATCH (j:JobRole)
      OPTIONAL MATCH (j)-[rq:REQUIRES_SKILL]->(s:Skill)
      OPTIONAL MATCH (c:Company)-[:OFFERS_ROLE]->(j)
      RETURN j,
             c AS company,
             collect(DISTINCT {skill: s, importance: rq.importance, requiredProficiency: rq.requiredProficiency}) AS requiredSkills
    `;
    const data = await runQuery(cypher);

    let formattedData;
    if (getDbStatus().connected) {
      formattedData = data.map(row => {
        const j = row.j ? row.j.properties : {};
        const company = row.company ? row.company.properties : null;
        const requiredSkills = (row.requiredSkills || [])
          .filter(s => s.skill !== null && s.skill !== undefined)
          .map(s => ({
            ...s.skill.properties,
            importance: s.importance,
            requiredProficiency: s.requiredProficiency
          }));
        return { j, requiredSkills, company };
      });
    } else {
      formattedData = data;
    }

    res.json({ success: true, data: formattedData, cypherExecuted: cypher.trim() });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Multi-hop Graph Traversal: Role Match & Gap Analysis
router.get('/match', async (req, res) => {
  try {
    const { personId = 'p1', roleId = 'j1' } = req.query;

    const cypher = `
      MATCH (p:Person {id: $personId}), (j:JobRole {id: $roleId})
      MATCH (j)-[rq:REQUIRES_SKILL]->(reqSkill:Skill)
      OPTIONAL MATCH (p)-[hs:HAS_SKILL]->(reqSkill)
      OPTIONAL MATCH (p)-[:CONTRIBUTED_TO]->(pr:Project)-[:DEMONSTRATES_SKILL|USES_TECH*1..2]->(reqSkill)
      RETURN p, j,
             reqSkill,
             rq.importance AS importance,
             rq.requiredProficiency AS requiredProficiency,
             hs.proficiency AS candidateDirectProficiency,
             collect(DISTINCT pr.name) AS verifiedInProjects
    `;

    const rawData = await runQuery(cypher, { personId, roleId });

    let matchResult;
    if (getDbStatus().connected) {
      if (rawData.length === 0) {
        matchResult = {};
      } else {
        const person = rawData[0].p ? rawData[0].p.properties : {};
        const role = rawData[0].j ? rawData[0].j.properties : {};

        const matchedSkills = [];
        const missingSkills = [];

        rawData.forEach(row => {
          if (!row.reqSkill) return;
          const skill = row.reqSkill.properties;
          const importance = row.importance;
          const requiredProficiency = row.requiredProficiency;
          const candidateDirectProficiency = row.candidateDirectProficiency;
          const verifiedInProjects = row.verifiedInProjects || [];

          const hasDirect = candidateDirectProficiency !== null && candidateDirectProficiency !== undefined;
          const hasViaProject = verifiedInProjects.length > 0;

          // ✅ FIXED: Skill counts as matched ONLY when proficiency meets or exceeds the bar.
          // Project verification adds evidence context but does NOT override the proficiency check.
          const proficiencyMet = hasDirect && candidateDirectProficiency >= requiredProficiency;

          if (proficiencyMet) {
            matchedSkills.push({
              skill,
              importance,
              requiredProficiency,
              candidateProficiency: candidateDirectProficiency,
              verifiedByProject: hasViaProject
            });
          } else {
            // Below threshold: show candidateProficiency (0 = doesn't have it at all)
            missingSkills.push({
              skill,
              importance,
              requiredProficiency,
              candidateProficiency: hasDirect ? candidateDirectProficiency : 0,
              verifiedByProject: hasViaProject
            });
          }
        });

        // Query project evidence separately for candidates when connected to a live database
        const evidenceCypher = `
          MATCH (p:Person {id: $personId})-[ct:CONTRIBUTED_TO]->(pr:Project)-[ds:DEMONSTRATES_SKILL]->(s:Skill)
          RETURN pr.name AS project, ct.role AS role, s.name AS demonstratedSkill, ds.relevanceScore AS relevance
        `;
        const evidenceData = await runQuery(evidenceCypher, { personId });
        const projectEvidence = evidenceData.map(row => ({
          project: row.project,
          role: row.role,
          demonstratedSkill: row.demonstratedSkill,
          relevance: row.relevance
        }));

        const totalRequired = matchedSkills.length + missingSkills.length;
        const matchPercentage = totalRequired > 0 
          ? Math.round((matchedSkills.length / totalRequired) * 100) 
          : 0;

        matchResult = {
          person,
          role,
          matchPercentage,
          matchedSkills,
          missingSkills,
          projectEvidence
        };
      }
    } else {
      const formatted = await runQuery('role_match', { personId, roleId });
      matchResult = formatted[0] || {};
    }

    res.json({
      success: true,
      data: matchResult,
      cypherExecuted: cypher.trim(),
      parameters: { personId, roleId }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Multi-hop Skill Recommendations
router.get('/recommendations', async (req, res) => {
  try {
    const { personId = 'p1' } = req.query;

    // Updated Cypher: aggregate all connected roles per skill, deduplicated
    const cypher = `
      MATCH (p:Person {id: $personId})-[hs:HAS_SKILL]->(existingSkill:Skill)
      MATCH (existingSkill)<-[:REQUIRES_SKILL]-(j:JobRole)-[rq:REQUIRES_SKILL]->(recSkill:Skill)
      OPTIONAL MATCH (p)-[candidateSkillRel:HAS_SKILL]->(recSkill)
      WITH p, j, rq, recSkill, candidateSkillRel
      WHERE candidateSkillRel IS NULL
         OR candidateSkillRel.proficiency < rq.requiredProficiency
      RETURN recSkill,
             collect(DISTINCT j.title) AS connectedRoles,
             max(rq.requiredProficiency) AS requiredProficiency,
             candidateSkillRel.proficiency AS candidateProficiency,
             CASE WHEN 'CRITICAL' IN collect(rq.importance) THEN 'CRITICAL' ELSE 'HIGH' END AS importance
    `;

    let recs;
    if (getDbStatus().connected) {
      const rawData = await runQuery(cypher, { personId });
      recs = rawData.map(row => {
        const candidateProf = row.candidateProficiency;
        const requiredProf = row.requiredProficiency;
        const skill = row.recSkill ? row.recSkill.properties : {};
        const roles = row.connectedRoles || [];
        const rolesText = roles.join(', ');
        const notPossessed = candidateProf === null || candidateProf === undefined;
        const reason = notPossessed
          ? `Missing skill required by: ${rolesText}`
          : `You have ${skill.name} at ${candidateProf}/5, but roles (${rolesText}) need up to ${requiredProf}/5 — level up!`;
        return {
          skill,
          reason,
          connectedRole: rolesText,
          importance: row.importance,
          candidateProficiency: candidateProf || 0,
          requiredProficiency: requiredProf,
          score: row.importance === 'CRITICAL' ? 95 : 80
        };
      });
    } else {
      recs = await runQuery('recommendation', { personId });
    }

    res.json({
      success: true,
      data: recs,
      cypherExecuted: cypher.trim(),
      parameters: { personId }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Custom Cypher query execution for Cypher Playground
router.post('/cypher', async (req, res) => {
  try {
    const { cypher, params = {} } = req.body;
    if (!cypher) return res.status(400).json({ success: false, error: 'Cypher query string is required' });

    const startTime = Date.now();
    let data = await runQuery(cypher, params);
    const executionTimeMs = Date.now() - startTime;

    // Helper to recursively convert Neo4j Node/Relationship objects to plain JSON
    function toPlainJS(val) {
      if (val === null || val === undefined) return val;
      
      // Check if it's a Neo4j Node
      if (typeof val === 'object' && Array.isArray(val.labels) && typeof val.properties === 'object' && val.identity !== undefined) {
        return {
          _id: val.identity.toString ? val.identity.toString() : val.identity,
          labels: val.labels,
          ...toPlainJS(val.properties)
        };
      }

      // Check if it's a Neo4j Relationship
      if (typeof val === 'object' && typeof val.type === 'string' && typeof val.properties === 'object' && val.identity !== undefined && val.start !== undefined && val.end !== undefined) {
        return {
          _id: val.identity.toString ? val.identity.toString() : val.identity,
          start: val.start.toString ? val.start.toString() : val.start,
          end: val.end.toString ? val.end.toString() : val.end,
          type: val.type,
          ...toPlainJS(val.properties)
        };
      }

      // Check if it's a Neo4j Integer (some drivers still return it despite option, so let's handle it)
      if (typeof val === 'object' && val.constructor && val.constructor.name === 'Integer') {
        return val.toString ? Number(val.toString()) : val;
      }

      // Array
      if (Array.isArray(val)) {
        return val.map(item => toPlainJS(item));
      }

      // Plain Object
      if (typeof val === 'object' && val !== null) {
        const resObj = {};
        for (const key in val) {
          if (Object.prototype.hasOwnProperty.call(val, key)) {
            resObj[key] = toPlainJS(val[key]);
          }
        }
        return resObj;
      }

      return val;
    }

    const cleanData = toPlainJS(data);

    res.json({
      success: true,
      data: cleanData,
      cypherExecuted: cypher,
      executionTimeMs
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;
