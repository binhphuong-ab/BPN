import { ObjectId } from 'mongodb';

export interface Comment {
  _id?: ObjectId;
  postId: ObjectId;
  author: string;
  email: string;
  content: string;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}
