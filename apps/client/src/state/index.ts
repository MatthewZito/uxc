import { connect, ConnectedProps } from 'react-redux';
import { combineReducers, createStore } from 'redux';

import { showUpsertRoomModal, hideUpsertRoomModal } from './thread/actions';
import { reducer as channel } from './thread/reducer';
import { showNotification, hideNotification } from './notification/actions';
import { reducer as notification } from './notification/reducer';

export type RootState = ReturnType<typeof store.getState>;

const store = createStore(
	combineReducers({
		channel,
		notification
	}),
	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
	(window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
		(window as any).__REDUX_DEVTOOLS_EXTENSION__()
);

// @todo selectors

const mapStateToProps = (state: RootState) => {
	return {
		threadModalState: state.channel,
		notifications: state.notification
	};
};

const mapDispatchToProps = {
	hideNotification,
	hideUpsertRoomModal,
	showNotification,
	showUpsertRoomModal
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export {
	connector,
	hideNotification,
	hideUpsertRoomModal,
	showNotification,
	showUpsertRoomModal,
	store
};

export type PropsFromRedux = ConnectedProps<typeof connector>;
