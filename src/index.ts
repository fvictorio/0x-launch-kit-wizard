#!/usr/bin/env node

import * as fs from 'fs';
import * as inquirer from 'inquirer';

import { buildDockerComposeYml, BuildOptions } from './build';

async function main() {
    const answers = await inquirer.prompt<BuildOptions>([
        {
            type: 'list',
            name: 'tokenType',
            message: 'Select the kind of token you want to support on your exchange',
            choices: ['ERC20', 'ERC721'],
        },
    ]);

    const dockerComposeYml = buildDockerComposeYml(answers);

    fs.writeFileSync('docker-compose.yml', dockerComposeYml);
}

main();
