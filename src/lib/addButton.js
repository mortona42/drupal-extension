const packages = new Set();

const moduleList = [];

function addButton(link) {
  const title = link.parentElement;
  if (!title.classList.contains('processed')) {
    title.classList.add('processed');

    const button = document.createElement('button');
    button.innerText = 'Hello';

    button.addEventListener('click', addToList);
    
    title.appendChild(button);
  }
}

async function addToList(click) {
  const button = click.target;
  const link = button.parentElement.querySelector('a');
  const module = link.href.split('/').pop();
  moduleList.push(module);
  console.log(moduleList);

  const releaseData = await fetchReleaseData(module);
  showReleaseInfo(releaseData);



  createOutput(releaseData);
}

function createOutput(releaseData) {
  let outputContainer = document.querySelector('.output-container');
  if (!outputContainer) {
    outputContainer = document.createElement('div');
    outputContainer.classList.add('output-container');
    document.body.appendChild(outputContainer);
  }

  const version = getMajorVersion(releaseData);
  console.log(version);

  const composerPackages = moduleList.map(module => `\n  drupal/${module}:^${version}`).join(' ')
  outputContainer.innerText = `ddev composer require ${composerPackages} \n -W --update-no-dev`
}

function getMajorVersion(releaseData) {
  return releaseData[0].version.match(/^(\d)/)[0];
  // const usesDashes = releaseData[0].version.textContent.contains('-');
  // return usesDashes
  //   ? releaseData[0].version.textContent.split('-')[0]
  //   : releaseData[0].version.split('.')[0];
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

  for (const release of moduleData.querySelectorAll('release')) {
    releaseData.push({
      version: release.querySelector('version').textContent,
      compatibility: release.querySelector('core_compatibility').textContent
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

export default function moduleLinks() {
  const moduleLinks = document.querySelectorAll('.node-project-module.node-teaser > h2 a');
  moduleLinks.forEach(addButton);
}