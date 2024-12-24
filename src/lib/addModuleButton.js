import projects from "./composerProjects";

const addModules = new Map();

/**
 * Process all project teaser titles.
 */
export default function addModuleButton() {
  document.querySelectorAll('.page-project-project-module .content > h2 a')
    .forEach(addButton);
}

/**
 * Add button if not in existing projects list.
 * 
 * @param {HTMLLinkElement} link 
 */
function addButton(link) {
  console.log(link);
  const title = link.parentElement;
  if (!title.classList.contains('processed')) {
    title.classList.add('processed');

    const button = document.createElement('button');
    button.innerText = 'Add';

    const module = getModuleFromLink(link);
    console.log(module);
    if (!projects.has(module)) {
      button.addEventListener('click', addToList);
      title.appendChild(button);
    }
    else {
      
    }
    
  }
  // console.log(projects);
}

function getModuleFromLink(link) {
  return link.href.split('/').pop();
}

async function addToList(click) {
  const button = click.target;
  const link = button.parentElement.querySelector('a');
  const module = getModuleFromLink(link);

  const releaseData = await fetchReleaseData(module);

  showReleaseInfo(releaseData);
  addModules.set(module, getMajorVersion(releaseData))

  createOutput();
}

function createOutput() {
  let outputContainer = document.querySelector('.output-container');
  if (!outputContainer) {
    outputContainer = document.createElement('div');
    outputContainer.classList.add('output-container');
    document.body.appendChild(outputContainer);
  }
  const composerPackages = Array.from(addModules.entries()).map((module) => {
    console.log(module);
    return `\\\n  drupal/${module[0]}:^${module[1]}`}
  ).join(' ')
  outputContainer.innerText = `ddev composer require ${composerPackages} \\\n -W --update-no-dev`
}

function getMajorVersion(releaseData) {
  const latestVersion = releaseData[0].version;
  if (latestVersion.match(/^8.x/)) {
    console.log(latestVersion.match(/^8.x/))
    const matches = latestVersion.match(/^8.x-(\d)/);
    return matches[1] ?? 1;
  }
  else {
    const matches = latestVersion.match(/^(\d)/);
    return matches[1] ?? 1;
  }
}

async function fetchReleaseData(module) {
  const moduleData = await fetch(`https://updates.drupal.org/release-history/${module}/current`)
    .then(response => response.text())
    .then(text => {
      const parser = new DOMParser();
      return parser.parseFromString(text, 'application/xml')
    })
    .catch(error => console.log(error));

  const releaseData = []

  for (const release of moduleData?.querySelectorAll('release')) {
    releaseData.push({
      version: release?.querySelector('version')?.textContent,
      compatibility: release?.querySelector('core_compatibility')?.textContent
    });
  }

  return releaseData;
}

function showReleaseInfo(releaseData) {
  console.log(releaseData);

  let outputContainer = document.querySelector('.output-container--release');
  if (!outputContainer) {
    outputContainer = document.createElement('div');
    outputContainer.classList.add('output-container--release');
    document.body.appendChild(outputContainer);
  }

  const output = releaseData.map(release => `${release.version}: ${release.compatibility}`)

  outputContainer.innerHTML = output.join(`<br>`);
}