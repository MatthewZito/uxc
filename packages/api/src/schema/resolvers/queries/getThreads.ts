import type { Resolver } from '../types';
import type {
	ObjectID,
	PrivateThread as PrivateThreadType
} from '@uxc/common/node';

import { PrivateThread } from '@/db';
import { UserInputError } from 'apollo-server-core';

/**
 * @todo Paginate.
 */
export const getThreads: Resolver<PrivateThreadType[], { userId: ObjectID }> =
	async (_, { userId }) => {
		if (!userId) {
			throw new UserInputError('todo');
		}

		const privateThreads = PrivateThread.findUserThreads(userId);

		return privateThreads;
	};