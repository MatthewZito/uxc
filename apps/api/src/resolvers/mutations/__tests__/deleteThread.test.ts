import request from 'supertest';

import { DELETE_THREAD } from '@@/fixtures';

import { app } from '@/app';
import { ERROR_MESSAGES } from '@/utils/constants';
import { seed } from '@/resolvers/seed';

describe('deleteThread workflow', () => {
	it('fails with an Unauthorized error if the request does not include a valid session cookie', async () => {
		const { body } = await request(app)
			.post(BASE_PATH)
			.send({
				query: DELETE_THREAD,
				variables: {
					threadId: 'xxx'
				}
			})
			.expect(200);

		expect(body.errors).toHaveLength(1);
		expect(body.errors[0].message).toEqual(
			ERROR_MESSAGES.E_AUTHORIZATION_REQUIRED
		);
		expect(body.errors[0].path[0]).toBe('deleteThread');
	});

	it('fails when not provided a threadId', async () => {
		const cookie = await join();
		const threadId = '123';

		const { body } = await request(app)
			.post(BASE_PATH)
			.set('Cookie', cookie)
			.send({
				query: DELETE_THREAD,
				variables: {}
			})
			.expect(200);

		expect(body.errors).toHaveLength(1);
		expect(body.errors[0].message).toEqual(ERROR_MESSAGES.E_NO_THREAD_ID);

		expect(body.errors[0].path[0]).toBe('deleteThread');
	});

	it('fails when provided a threadId that is not a valid ObjectID', async () => {
		const cookie = await join();
		const threadId = '123';

		const { body } = await request(app)
			.post(BASE_PATH)
			.set('Cookie', cookie)
			.send({
				query: DELETE_THREAD,
				variables: {
					threadId
				}
			})
			.expect(200);

		expect(body.errors).toHaveLength(1);
		expect(body.errors[0].message).toEqual(
			`The provided threadId ${threadId} is not a valid ObjectID`
		);

		expect(body.errors[0].path[0]).toBe('deleteThread');
	});

	it('deletes a thread', async () => {
		const { threadIds } = await seed();

		const cookie = await join();
		const threadId = threadIds[0];

		const { body } = await request(app)
			.post(BASE_PATH)
			.set('Cookie', cookie)
			.send({
				query: DELETE_THREAD,
				variables: {
					threadId
				}
			})
			.expect(200);

		const { deleteThread } = body.data;

		expect(deleteThread).toStrictEqual(threadId.toString());
	});
});
