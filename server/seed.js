/**
 * Seed script for CognoDB / Neo4j Graph Database
 * Populates labeled nodes and typed relationships using parameterized openCypher queries over Bolt.
 */

const { runQuery, checkConnection } = require('./db');
const { nodes, relationships } = require('./seedData');

async function seedDatabase() {
  console.log('--- Starting SkillGraph CognoDB / Neo4j Seed Process ---');

  const isConnected = await checkConnection();
  if (!isConnected) {
    console.log('⚠️ Could not establish connection to live Neo4j / CognoDB instance.');
    console.log('In-Memory fallback graph driver will serve sample data automatically.');
    process.exit(0);
  }

  try {
    // Clear existing data
    console.log('Cleaning existing graph nodes and relationships...');
    await runQuery('MATCH (n) DETACH DELETE n');

    // 1. Create Nodes
    console.log('Seeding labeled nodes...');

    for (const person of nodes.people) {
      await runQuery(
        `CREATE (p:Person {id: $id, name: $name, title: $title, bio: $bio, avatar: $avatar})`,
        person
      );
    }

    for (const skill of nodes.skills) {
      await runQuery(
        `CREATE (s:Skill {id: $id, name: $name, category: $category, demandLevel: $demandLevel})`,
        skill
      );
    }

    for (const tech of nodes.technologies) {
      await runQuery(
        `CREATE (t:Technology {id: $id, name: $name, category: $category, version: $version})`,
        tech
      );
    }

    for (const project of nodes.projects) {
      await runQuery(
        `CREATE (pr:Project {id: $id, name: $name, description: $description, domain: $domain, impact: $impact})`,
        project
      );
    }

    for (const role of nodes.jobRoles) {
      await runQuery(
        `CREATE (j:JobRole {id: $id, title: $title, domain: $domain, tier: $tier, experienceLevel: $experienceLevel, salaryRange: $salaryRange})`,
        role
      );
    }

    for (const company of nodes.companies) {
      await runQuery(
        `CREATE (c:Company {id: $id, name: $name, industry: $industry, size: $size})`,
        company
      );
    }

    for (const domain of nodes.domains) {
      await runQuery(
        `CREATE (d:Domain {id: $id, name: $name, description: $description})`,
        domain
      );
    }

    // 2. Create Typed Relationships
    console.log('Seeding typed relationships...');

    for (const rel of relationships) {
      let cypher = '';
      if (rel.type === 'HAS_SKILL') {
        cypher = `
          MATCH (p:Person {id: $from}), (s:Skill {id: $to})
          CREATE (p)-[:HAS_SKILL {proficiency: $proficiency, yearsExperience: $yearsExperience}]->(s)
        `;
      } else if (rel.type === 'CONTRIBUTED_TO') {
        cypher = `
          MATCH (p:Person {id: $from}), (pr:Project {id: $to})
          CREATE (p)-[:CONTRIBUTED_TO {role: $role, durationMonths: $durationMonths}]->(pr)
        `;
      } else if (rel.type === 'USES_TECH') {
        cypher = `
          MATCH (pr:Project {id: $from}), (t:Technology {id: $to})
          CREATE (pr)-[:USES_TECH {environment: $environment}]->(t)
        `;
      } else if (rel.type === 'DEMONSTRATES_SKILL') {
        cypher = `
          MATCH (pr:Project {id: $from}), (s:Skill {id: $to})
          CREATE (pr)-[:DEMONSTRATES_SKILL {relevanceScore: $relevanceScore}]->(s)
        `;
      } else if (rel.type === 'BELONGS_TO_DOMAIN') {
        cypher = `
          MATCH (pr:Project {id: $from}), (d:Domain {id: $to})
          CREATE (pr)-[:BELONGS_TO_DOMAIN]->(d)
        `;
      } else if (rel.type === 'ENABLES_SKILL') {
        cypher = `
          MATCH (t:Technology {id: $from}), (s:Skill {id: $to})
          CREATE (t)-[:ENABLES_SKILL]->(s)
        `;
      } else if (rel.type === 'REQUIRES_SKILL') {
        cypher = `
          MATCH (j:JobRole {id: $from}), (s:Skill {id: $to})
          CREATE (j)-[:REQUIRES_SKILL {importance: $importance, requiredProficiency: $requiredProficiency}]->(s)
        `;
      } else if (rel.type === 'IN_DOMAIN') {
        cypher = `
          MATCH (j:JobRole {id: $from}), (d:Domain {id: $to})
          CREATE (j)-[:IN_DOMAIN]->(d)
        `;
      } else if (rel.type === 'OFFERS_ROLE') {
        cypher = `
          MATCH (c:Company {id: $from}), (j:JobRole {id: $to})
          CREATE (c)-[:OFFERS_ROLE]->(j)
        `;
      } else if (rel.type === 'TARGETS_ROLE') {
        cypher = `
          MATCH (p:Person {id: $from}), (j:JobRole {id: $to})
          CREATE (p)-[:TARGETS_ROLE]->(j)
        `;
      }

      if (cypher) {
        await runQuery(cypher, { from: rel.from, to: rel.to, ...(rel.props || {}) });
      }
    }

    console.log('✅ SkillGraph Seed Process Complete! Graph ready for Cypher traversals.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during seeding:', err);
    process.exit(1);
  }
}

seedDatabase();
