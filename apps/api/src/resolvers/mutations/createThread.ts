import { AuthenticationError, UserInputError } from 'apollo-server-core';
import { isValidObjectId } from 'mongoose';

import type { Resolver } from '../types';
import type { ObjectID, PrivateThread as PrivateThreadType } from '@uxc/types';

import { PrivateThread } from '@/db';
import { ERROR_MESSAGES } from '@/utils/constants';

export const createThread: Resolver<
	PrivateThreadType,
	{ receiverId: ObjectID }
> = async (_, { receiverId }, { req }) => {
	const userId = req.session.meta?.id;
	if (!userId) {
		throw new AuthenticationError(ERROR_MESSAGES.E_NO_USER_SESSION);
	}

	if (!receiverId) {
		throw new UserInputError(ERROR_MESSAGES.E_NO_RECEIVER_ID);
	}

	if (!isValidObjectId(receiverId)) {
		throw new UserInputError(
			`The provided receiverId ${receiverId} is not a valid ObjectID`
		);
	}

	const thread = await PrivateThread.create({
		users: [userId, receiverId]
	});

	return thread;
};
