import React, { createContext, useCallback } from 'react';
import { useQuery } from '@apollo/client';
import { GET_THREADS, GET_USER } from '@/services/api/queries';
import type { PrivateThread, ObjectID, User } from '@uxc/types';

interface ThreadsContext {
	threads: PrivateThread[];
	getThreadById: (threadId: ObjectID) => PrivateThread | null;
}
export const ThreadsContext = createContext({} as ThreadsContext);

export const ThreadsProvider = ({ children }: { children: JSX.Element }) => {
	const { data: user } = useQuery<{
		getCurrentUser: User;
	}>(GET_USER);

	const { data: threadsPayload } = useQuery<{
		getThreads: PrivateThread[];
	}>(GET_THREADS, {
		variables: {
			userId: user?.getCurrentUser._id
		}
	});

	const threads = threadsPayload?.getThreads || [];

	const getThreadById = useCallback(
		(id: ObjectID) => {
			const thread = threads.find(({ _id }) => _id === id);

			return thread as PrivateThread;
		},
		[threads]
	);

	const value = { threads, getThreadById };

	return (
		<ThreadsContext.Provider value={value}>{children}</ThreadsContext.Provider>
	);
};