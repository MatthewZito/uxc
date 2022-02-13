import type { MutationResolvers } from '@uxc/types/generated';

import { invalidateSession } from '@/utils';

export const signoutResolver: MutationResolvers['signout'] = async (
	_,
	__,
	{ req }
) => {
	invalidateSession(req);

	return '';
};