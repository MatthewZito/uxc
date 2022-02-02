import { Schema, model } from 'mongoose';
import type { Model, Document } from 'mongoose';

import { toHash } from '@/utils';
import type { User as UserType } from '@uxc/types';

type UserWithPassword = UserType & { password: string };
type ReturnDocument = UserWithPassword & { __v?: string };

interface UserDocument extends UserType, Omit<Document, '_id'> {}

interface UserModel extends Model<ReturnDocument> {
	build(attrs: Omit<UserWithPassword, '_id'>): UserDocument;
}

const UserSchema = new Schema<UserWithPassword>(
	{
		username: {
			required: true,
			type: String
		},
		email: {
			required: true,
			type: String
		},
		password: {
			required: true,
			type: String
		},
		userImage: {
			default: null,
			type: String
		}
	},
	{
		timestamps: true,

		// modify internal `toJSON` method to serialize the user object sans password, __v;
		// convert mongo-specific `_id` to a db-agnostic format
		toJSON: {
			// mongoose types are terrible here
			transform(_, ret: ReturnDocument) {
				delete ret.password;
				delete ret.__v;
			}
		}
	}
);

UserSchema.pre('save', async function save(this: Document, done) {
	if (this.isModified('password')) {
		const hashed = await toHash(this.get('password') as string);

		this.set('password', hashed);
	}

	done();
});

UserSchema.statics.build = (attrs: Omit<ReturnDocument, '_id'>) => {
	return new User(attrs);
};

export const User = model<ReturnDocument, UserModel>('User', UserSchema as any);
