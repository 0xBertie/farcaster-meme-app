import { sdk } from '@farcaster/miniapp-sdk';

export interface UserContext {
  fid: number;
  username: string;
  pfp: string;
}

export async function initializeSdk(): Promise<UserContext> {
  await sdk.actions.ready();
  const context = await sdk.context;
  return {
    fid: context.user.fid,
    username: context.user.username || 'Anonymous',
    pfp: context.user.pfpUrl || '',
  };
}

export { sdk };
