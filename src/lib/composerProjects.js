/**
 * Provides a list of projects in composer.json.
 */

import composerJson from "/home/andrew/Sites/mantra/composer.json" assert {type: 'json'};

const projects = new Set();

['require', 'require-dev'].forEach(item => {
  for (const extension in composerJson[item]) {
      const extensionParts = extension.split('/');
      const nameSpace = extensionParts[0];
      const extensionName = extensionParts[1];
      if (nameSpace == 'drupal') {
        projects.add(extensionName);
          // this.projects[item].add(extensionName);
      }
  }
})

export default projects;