import 'module-alias/register';

import { connectToDatabase } from '@/db';
import { initializeServer } from '@/server';
import { DatabaseConnectionError } from '@/services/error';
import { logger } from '@/services/logger';
import { validateConfig } from '@/utils';

const PORT = process.env.API_PORT || 5000;

(async () => {
	validateConfig();
	const { httpServer, server } = await initializeServer();

	try {
		await connectToDatabase();
	} catch (ex) {
		throw new DatabaseConnectionError(
			`failed to initialize database connection; see: ${ex}`
		);
	}

	httpServer.listen(PORT, () => {
		logger.info(
			`\nš Query endpoint listening at http://localhost:${PORT}${server.graphqlPath}`
		);

		logger.info(
			`š Subscription endpoint listening at ws://localhost:${PORT}${server.graphqlPath}`
		);

		logger.info(
			`š GraphQL Explorer listening at http://localhost:${PORT}${server.graphqlPath}\n`
		);
	});
})();

process.on('unhandledRejection', (reason) => {
	logger.error('Unhandled Promise Rejection', { reason });
});
