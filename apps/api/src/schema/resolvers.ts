import { GraphQLDateTime } from 'graphql-iso-date';

import type { Resolvers } from '@uxc/types/generated';
import type { GraphQLScalarType } from 'graphql';

import { authGuard } from '@/middleware/auth';

import * as queries from '@/resolvers/queries';
import {
	onThreadMessageCreated,
	onAnyMessageCreated,
	onFriendRequestSaved
} from '@/resolvers/subscriptions';

import {
	joinResolver as join,
	signinResolver as signin,
	signoutResolver as signout
} from '@/resolvers/mutations';
import * as mutations from '@/resolvers/mutations';

import { seedWrapper, purge } from '@/resolvers/mutations/computed';

export const resolvers: Resolvers = {
	Date: GraphQLDateTime as unknown as GraphQLScalarType,

	Subscription: {
		onThreadMessageCreated,
		onAnyMessageCreated,
		onFriendRequestSaved
	},

	Query: {
		getThread: authGuard(queries.getThread),
		getThreads: authGuard(queries.getThreads),
		getMessages: authGuard(queries.getMessages),
		getUser: authGuard(queries.getUser),
		getCurrentUser: authGuard(queries.getCurrentUser),
		search: authGuard(queries.search)
	},

	// User: {
	// 	__isTypeOf: (obj) => {
	// 		return obj instanceof User;
	// 	}
	// },

	// Message: {
	// 	__isTypeOf: (obj) => {
	// 		return obj instanceof Message;
	// 	}
	// },

	Mutation: {
		seed: authGuard(seedWrapper),
		purge: authGuard(purge),
		signout,
		signin,
		join,
		createMessage: authGuard(mutations.createMessage),
		updateMessage: authGuard(mutations.updateMessage),
		createThread: authGuard(mutations.createThread),
		deleteThread: authGuard(mutations.deleteThread),
		createFriendRequest: authGuard(mutations.createFriendRequest),
		updateFriendRequest: authGuard(mutations.updateFriendRequest)
	}
};
