export interface BuildOptions {
    tokenType: 'ERC20' | 'ERC721';
    networkId: number;
    rpcUrl: string;
}

export const buildDockerComposeYml = (options: BuildOptions) => {
    const basePath = options.tokenType === 'ERC20' ? '/erc20' : '/erc721';

    return `
version: "3"
services:
  ganache:
    image: fvictorio/0x-ganache-testing:0.0.1
    ports:
      - "8545:8545"
  frontend:
    image: fvictorio/0x-launch-kit-frontend
    environment:
      REACT_APP_DEFAULT_BASE_PATH: '${basePath}'
      REACT_APP_RELAYER_URL: 'http://localhost:3000/v2'
    command: yarn build
    volumes:
        - frontend-assets:/app/build
  backend:
    image: 0xorg/launch-kit-backend
    environment:
        HTTP_PORT: '3000'
        RPC_URL: '${options.rpcUrl}'
        NETWORK_ID: '${options.networkId}'
        WHITELIST_ALL_TOKENS: 'true'
        FEE_RECIPIENT: '0x0000000000000000000000000000000000000000'
        MAKER_FEE_ZRX_UNIT_AMOUNT: '0'
        TAKER_FEE_ZRX_UNIT_AMOUNT: '0'
    ports:
      - '3000:3000'
  nginx:
    image: nginx
    ports:
        - '3001:80'
    volumes:
        - frontend-assets:/usr/share/nginx/html
volumes:
    frontend-assets:
`.trimLeft();
};
