export const LOGIN_MUTATION = `
	mutation($args: LoginInput) {
		login(args: $args) {
			_id
			email
			username
			userImage
		}
	}
`;

export const LOGOUT_MUTATION = `
	mutation {
		logout
	}
`;

export const JOIN_MUTATION = `
	mutation($args: JoinInput) {
		join(args: $args) {
			_id
			email
			username
			userImage
		}
	}
`;

export const GET_USER_QUERY = `
	query {
		getCurrentUser {
			_id
			username
			email
			userImage
		}
	}
`;