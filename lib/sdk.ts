import { sdk } from '@farcaster/miniapp-sdk';

export interface UserContext {
  fid: number;
  username: string;
  pfp: string;
}

let isInFarcaster = false;

export async function initializeSdk(): Promise<UserContext> {
  try {
    await sdk.actions.ready();
    const context = await sdk.context;
    isInFarcaster = true;
    return {
      fid: context.user.fid,
      username: context.user.username || 'Anonymous',
      pfp: context.user.pfpUrl || '',
    };
  } catch (error) {
    // Запущено в обычном браузере - возвращаем mock данные
    console.warn('Not running in Farcaster, using mock user');
    return {
      fid: 999999,
      username: 'Browser User',
      pfp: '',
    };
  }
}

export function isFarcasterContext(): boolean {
  return isInFarcaster;
}

export { sdk };
