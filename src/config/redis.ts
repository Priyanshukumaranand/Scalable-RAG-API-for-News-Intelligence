import Redis from 'ioredis';
import { env } from './env';

if (process.env.NODE_ENV === 'test') {
	const store = new Map<string, string[]>();
	const mock = {
		async lrange(key: string) {
			return store.get(key) || [];
		},
		async rpush(key: string, ...vals: string[]) {
			const arr = store.get(key) || [];
			arr.push(...vals);
			store.set(key, arr);
		},
		async expire() {
			return 1;
		},
		async del(key: string) {
			store.delete(key);
			return 1;
		},
		async quit() {
			return 0;
		},
	} as unknown as Redis;

	// eslint-disable-next-line import/no-mutable-exports
	var redis = mock;
} else {
	// eslint-disable-next-line import/no-mutable-exports
	var redis = new Redis(env.redisUrl);
}

export { redis };
