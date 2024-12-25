/**
 * Get info for installed drupal modules.
 */
import { readFile, writeFile } from "fs/promises";

const drupalPath = '/home/andrew/Sites/mantra/';

const composerJson = await readFile(drupalPath + 'composer.json')
    .then(file => JSON.parse(file))
    .catch(error => console.log(error));

const composerLock = await readFile(drupalPath + 'composer.lock')
    .then(file => JSON.parse(file))
    .catch(error => console.log(error));


const installedVersion = new Map();
composerLock.packages.forEach(extension => {
    if (extension.name.startsWith('drupal/')) {
        installedVersion.set(extension.name.replace('drupal/', ''), extension.version);
    }
});

const composerPackages = new Map();
['require', 'require-dev'].forEach(requirement => {
    Object.keys(composerJson[requirement]).forEach((extension) => {
        if (extension.startsWith('drupal/')) {
            const module = extension.replace('drupal/', '');
            composerPackages.set(module, {
                require: composerJson[requirement][extension],
                dev: requirement == 'require-dev',
                installed: installedVersion.get(module) ?? ''
            });
        }
    })
})

writeFile('./data/installedVersions.json', JSON.stringify(Object.fromEntries(composerPackages)));
