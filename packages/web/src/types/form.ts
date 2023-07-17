export interface CommentEditable {
  id?: string | null;
  resourceId: string;
  userId: string;
  parentId?: string | null;
  content: string | undefined;
  createdAt?: string;
  updatedAt?: string;
}
