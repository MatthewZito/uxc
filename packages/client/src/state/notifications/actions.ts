import { store } from '..';

import {
	ShowNotification,
	HideNotification,
	NOTIFICATION_ACTION
} from './types';

// Actions
const SHOW_NOTIFICATION: ShowNotification = ({
	message,
	duration = 'default',
	type = 'info'
}) => ({
	payload: {
		duration,
		message,
		type
	},
	type: NOTIFICATION_ACTION.SHOW
});

const HIDE_NOTIFICATION: HideNotification = ({ id }) => ({
	payload: {
		id
	},
	type: NOTIFICATION_ACTION.HIDE
});

// Action Creators
export const showNotification: ShowNotification = (args) => store.dispatch(SHOW_NOTIFICATION(args));

export const hideNotification: HideNotification = (args) => store.dispatch(HIDE_NOTIFICATION(args));
