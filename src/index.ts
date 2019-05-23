#!/usr/bin/env node

import * as fs from 'fs';
import * as inquirer from 'inquirer';

import { buildDockerComposeYml, BuildOptions } from './build';

type Network = 'mainnet' | 'kovan' | 'ropsten' | 'custom';

function getNetworkId(network: Network): number {
    switch (network) {
        case 'mainnet':
            return 1;
        case 'kovan':
            return 42;
        case 'ropsten':
            return 3;
        case 'custom':
            return 50;
    }
}

function getRpcUrl(network: Network): string {
    switch (network) {
        case 'mainnet':
            return 'https://mainnet.infura.io/';
        case 'kovan':
            return 'https://kovan.infura.io/';
        case 'ropsten':
            return 'https://ropsten.infura.io/';
        case 'custom':
            return 'http://localhost:8545/';
    }
}

async function main() {
    const networkChoices: Array<{name: string, value: Network}> = [{
        name: 'Mainnet',
        value: 'mainnet',
    }, {
        name: 'Kovan',
        value: 'kovan',
    }, {
        name: 'Ropsten',
        value: 'ropsten',
    }, {
        name: 'Local / Custom',
        value: 'custom',
    }];

    const answers = await inquirer.prompt<any>([
        {
            type: 'list',
            name: 'tokenType',
            message: 'Select the kind of token you want to support on your exchange',
            choices: ['ERC20', 'ERC721'],
        },
        {
            type: 'list',
            name: 'network',
            message: 'Select the network you want to use',
            choices: networkChoices,
        },
        {
            type: 'input',
            name: 'rpcUrl',
            message: 'Select the RPC URL you want to use',
            default: (answers: any) => {
                return getRpcUrl(answers.network)
            }
        },
    ]);

    const networkId = getNetworkId(answers.network)

    const options: BuildOptions = {
        tokenType: answers.tokenType,
        networkId,
        rpcUrl: answers.rpcUrl,
    }

    const dockerComposeYml = buildDockerComposeYml(options);

    fs.writeFileSync('docker-compose.yml', dockerComposeYml);
}

main();
