globalThis.window = globalThis; 

import { Session } from '@0xsequence/auth'
/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import { ethers } from 'ethers';

export default {
	async fetch(
		request: Request,
		env: any,
		ctx: ExecutionContext
	): Promise<Response> {
		return handleRequest(env, request)
	},
};
  
async function handleRequest(env: any, request: any) {

	const providerUrl = 'https://nodes.sequence.app/arbitrum-nova';
	const provider = new ethers.providers.StaticJsonRpcProvider({ url: providerUrl, skipFetchSetup: true })

	// Create your server EOA
    const walletEOA = new ethers.Wallet(env.PRIV_KEY, provider);

	// Open a Sequence session, this will find or create
	// a Sequence wallet controlled by your server EOA
	const session = await Session.singleSigner({
		signer: walletEOA
	})
            
    const signer = session.account.getSigner(42170)
	const result = await signer.getAddress();

	return new Response(`Result: ${result}`, {
	  	headers: { 
			'content-type': 'text/plain', 
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
		},
	})
  }