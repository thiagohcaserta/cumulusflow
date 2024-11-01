import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function createProject({ projectName, useAuth0, useAI }) {
  const projectDir = path.join(process.cwd(), projectName);
  
  // Create project directory
  await fs.mkdir(projectDir, { recursive: true });

  // Create basic project structure
  const structure = {
    'src': {
      'pages': {
        'index.js': `export default function Home() {
  return <h1>Welcome to CumulusFlow</h1>;
}`,
        'api': {
          'hello.js': `export default function handler(req) {
  return new Response('Hello from CumulusFlow!');
}`
        }
      },
      'components': {},
      'styles': {
        'global.css': '/* Your global styles here */'
      }
    },
    'public': {}
  };

  // Create project files
  await createProjectStructure(projectDir, structure);

  // Create package.json
  const packageJson = {
    name: projectName,
    version: '0.1.0',
    private: true,
    scripts: {
      "dev": "cumulus dev",
      "build": "cumulus build",
      "deploy": "cumulus deploy",
      "analyze": "cumulus analyze"
    },
    dependencies: {
      "cumulusflow": "^0.1.0"
    }
  };

  if (useAuth0) {
    packageJson.dependencies["@auth0/auth0-react"] = "^2.0.0";
  }

  await fs.writeFile(
    path.join(projectDir, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );

  // Create config file
  const config = {
    name: projectName,
    auth0: useAuth0 ? {
      domain: "YOUR_AUTH0_DOMAIN",
      clientId: "YOUR_AUTH0_CLIENT_ID"
    } : null,
    ai: useAI ? {
      enabled: true
    } : null
  };

  await fs.writeFile(
    path.join(projectDir, 'cumulus.config.js'),
    `export default ${JSON.stringify(config, null, 2)}`
  );
}

async function createProjectStructure(baseDir, structure) {
  for (const [name, content] of Object.entries(structure)) {
    const fullPath = path.join(baseDir, name);
    
    if (typeof content === 'object') {
      await fs.mkdir(fullPath, { recursive: true });
      await createProjectStructure(fullPath, content);
    } else {
      await fs.writeFile(fullPath, content);
    }
  }
}