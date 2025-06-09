export interface PostTypes {
  postId: string;
  title: string;
  content: string;
  createdAt: Date;
  modifiedAt: Date;
  isDeleted: boolean;
  authorId: string;
  slug: string;
}