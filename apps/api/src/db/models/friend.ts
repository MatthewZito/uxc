import { Schema, model } from 'mongoose';

import type { Model } from 'mongoose';
import type { ObjectID, Friend as FriendType } from '@uxc/types/node';
import type { AsBuildArgs, AsRawDocument, AsReturnDocument } from '../types';

type RawDocument = AsRawDocument<FriendType>;
type ReturnDocument = AsReturnDocument<FriendType>;
type NewFriendArgs = AsBuildArgs<FriendType>;

interface FriendModel extends Model<RawDocument> {
	build(attrs: NewFriendArgs): ReturnDocument;
}

const FriendSchema = new Schema<FriendType>(
	{
		partnerA: {
			ref: 'User',
			required: true,
			type: Schema.Types.ObjectId
		},
		partnerB: {
			ref: 'User',
			required: true,
			type: Schema.Types.ObjectId
		}
	},
	{
		timestamps: true,
		toJSON: {
			transform(_, ret: RawDocument) {
				delete ret.__v;
			}
		}
	}
);

FriendSchema.statics.findFriends = function (id: ObjectID) {
	return this.find({
		$and: [
			{
				$or: [
					{
						partnerA: id
					},
					{
						partnerB: id
					}
				]
			}
		]
	});
};

FriendSchema.statics.build = (attrs) => {
	return new Friend(attrs);
};

export const Friend = model<RawDocument, FriendModel>('Friend', FriendSchema);
