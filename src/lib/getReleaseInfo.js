export async function getReleaseInfo(module) {
    const moduleData = await fetch(`https://updates.drupal.org/release-history/${module}/current`)
      .then(response => response.text())
      .then(text => {
        const parser = new DOMParser();
        return parser.parseFromString(text, 'application/xml')
      })
      .catch(error => console.log(error));
  
    const releaseData = []
}