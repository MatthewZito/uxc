/**
 * Does the request body contain an operationName?
 * @param req The request body.
 * @param operationName Target operationName.
 */
export function hasOperationName(req: any, operationName: string) {
	const { body } = req;
	if (!body) {
		return false;
	}

	return (
		// eslint-disable-next-line no-prototype-builtins
		body.hasOwnProperty('operationName') && body.operationName === operationName
	);
}

/**
 * Alias given query if operationName matches.
 * @param req The request body.
 * @param operationName Target operationName.
 */
export function aliasQuery(req: any, operationName: string) {
	if (hasOperationName(req, operationName)) {
		req.alias = `gql${operationName}Query`;
	}
}

/**
 * Alias given mutation if operationName matches.
 * @param req The request body.
 * @param operationName Target operationName.
 */
export function aliasMutation(req: any, operationName: string) {
	if (hasOperationName(req, operationName)) {
		req.alias = `gql${operationName}Mutation`;
	}
}
