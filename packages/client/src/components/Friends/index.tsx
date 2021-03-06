import type { ChangeEvent } from 'react';

import React, { useState } from 'react';
import { v4 } from 'uuid';

import * as S from './styles';

import { Input } from '@/components/Fields/Input';

export function Friends() {
	const [searchText, setSearchText] = useState('');

	const searchOptions = [
		{
			iconName: 'search'
		}
	];

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target;

		setSearchText(value);
	};

	const rawFriends = [
		'Jane Doe',
		'John Doe',
		'Marco Inaros',
		'Naomi Nagata',
		'Amos Burton'
	];

	/** @todo robust impl */
	function naiveSearch(friend: string) {
		const cleanSearchText = searchText.trim().toLowerCase();
		const cleanFriendText = friend.toLowerCase();

		return cleanFriendText.includes(cleanSearchText);
	}

	const filteredFriends = rawFriends
		.filter(naiveSearch)
		.map((value) => ({ value, id: v4() }));

	return (
		<S.Container>
			<S.Form>
				<Input
					autoComplete="off"
					data-testid="search-friends"
					label="Search friends"
					maxLength={512}
					onChange={handleChange}
					options={searchOptions}
					placeholder="Search friends"
					value={searchText}
				/>
			</S.Form>

			<S.ListContainer>
				{filteredFriends.map(({ value, id }) => {
					return (
						<S.ListItem key={id}>
							<S.Avatar />
							<S.Username>{value}</S.Username>
							<S.UserStatus>user status</S.UserStatus>
							<S.ActionsContainer>
								<S.ActionBubble />
								<S.ActionBubble />
							</S.ActionsContainer>
						</S.ListItem>
					);
				})}
			</S.ListContainer>
		</S.Container>
	);
}
