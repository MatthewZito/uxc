import React, { useEffect, useRef, useState } from 'react';

import type { Message, ObjectID, User } from '@uxc/types';

import { ChatMessage } from '@/components/ChatThread/ChatMessage';
import { useQuery } from '@apollo/client';
import {
	GET_MESSAGES,
	GET_USER,
	MESSAGES_SUBSCRIPTION
} from '@/services/api/queries';

interface MessageListProps {
	threadId: ObjectID;
}

export function MessageList({ threadId }: MessageListProps) {
	const bottomRef = useRef<HTMLDivElement | null>(null);
	const [isScrolledToTop] = useState(false);

	useEffect(() => {
		isScrolledToTop ||
			bottomRef.current?.scrollIntoView({
				block: 'nearest',
				inline: 'start'
			});
	});

	const { data: user } = useQuery<{
		getCurrentUser: User;
	}>(GET_USER);

	const { loading, data, error, subscribeToMore } = useQuery<{
		getMessages: (Omit<Message, 'sender'> & { sender: User })[];
	}>(GET_MESSAGES, {
		variables: {
			threadId
		}
	});

	useEffect(() => {
		subscribeToMore({
			document: MESSAGES_SUBSCRIPTION,
			variables: { threadId },
			updateQuery: (prev, { subscriptionData }) => {
				console.log({ prev, subscriptionData });
				if (Object.keys(prev || {}).length === 0) {
					return { getMessages: [] };
				}

				if (!subscriptionData.data) {
					return prev;
				}

				/** @todo */
				// @ts-ignore
				const newMessage = subscriptionData.data.onMessage[0];

				const ret = Object.assign({}, prev, {
					getMessages: [
						...prev.getMessages,
						{ ...newMessage, sender: user?.getCurrentUser }
					]
				});

				return ret;
			}
		});
	}, []);

	if (loading) {
		return null;
	}

	if (error) {
		console.log({ error });
		// showNotification({
		// 	message:
		// 		'Something went wrong while grabbing info for this channel. Please try again later.',
		// 	type: 'error'
		// });

		return null;
	}

	const messages =
		data?.getMessages.map((message) => {
			if (message.sender._id === user?.getCurrentUser._id) {
				return {
					...message,
					isSender: true
				};
			}

			return {
				...message,
				isSender: false
			};
		}) || [];

	return (
		<div className="overflow-y-auto flex-auto">
			{messages.map((message) => (
				<ChatMessage key={message._id} {...message} />
			))}

			<div ref={bottomRef} />
		</div>
	);
}