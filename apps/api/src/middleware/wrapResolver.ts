import type { Context } from '@uxc/types';

export function buildWrapResolver(
	middleware: (context: Context) => Promise<void> | void
) {
	return function wrapResolver<R, T>(
		resolver: (parent: {}, args: T, context: Context) => Promise<R>
	) {
		return async function (parent: {}, args: T, context: Context) {
			await middleware(context);
			const ret = await resolver(parent, args, context);

			return ret;
		};
	};
}