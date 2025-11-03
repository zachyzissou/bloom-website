import { Gitlab } from '@gitbeaker/rest';
import { config } from 'dotenv';

config({ path: '.env' });

const api = new Gitlab({
  host: 'https://gitlab.slurpgg.net',
  token: process.env.GITLAB_TOKEN,
});

// List all accessible projects
try {
  const projects = await api.Projects.all({ membership: true });
  console.log('Found ' + projects.length + ' accessible projects:\n');
  projects.forEach(p => {
    const wikiStatus = p.wiki_enabled ? 'Yes' : 'No';
    console.log('- ' + p.path_with_namespace + ' (ID: ' + p.id + ') - Wiki: ' + wikiStatus);
  });
} catch (error) {
  console.error('Error:', error.message);
}
