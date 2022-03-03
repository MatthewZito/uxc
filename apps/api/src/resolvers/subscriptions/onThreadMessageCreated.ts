import { SubscriptionResolvers } from '@uxc/types/generated';
import { withFilter } from 'graphql-subscriptions';

import type { Message } from '@uxc/types';

import { pubsub } from '@/redis';
import { EVENTS } from '@/utils/constants';

export const onThreadMessageCreated: SubscriptionResolvers['onThreadMessageCreated'] =
	{
		// @ts-ignore
		subscribe: withFilter(
			() => pubsub.asyncIterator([EVENTS.MESSAGE_CREATED]),
			(payload, { threadId }) => {
				return payload.message.threadId === threadId;
			}
		),
		// @ts-ignore
		resolve: ({ message }: { message: Message }) => {
			return [message];
		}
	};
