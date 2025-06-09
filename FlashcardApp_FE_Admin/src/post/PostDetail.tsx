import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/AuthProvider';
import { Button } from '@/components/ui/button';

interface Post {
  _id: string;
  title: string;
  description: string;
  content: string;
  thumbnail?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
  slug: string;
}

export default function PostDetail() {
  const { api } = useAuth();
  const { slug } = useParams<{ slug : string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    if (!slug) return;
    api.get(`/api/v1/admin/posts/${slug}`)
      .then(res => setPost(res.data.data))
      .catch(err => console.error('Fetch post error:', err));
  }, [api, slug]);

  if (!post) return <div>Đang tải chi tiết...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold">Chi tiết bài viết</h2>
      <dl className="space-y-2">
        <div><dt className="font-medium">ID:</dt><dd>{post._id}</dd></div>
        <div><dt className="font-medium">Title:</dt><dd>{post.title}</dd></div>
        <div><dt className="font-medium">Description:</dt><dd>{post.description}</dd></div>
        <div><dt className="font-medium">Thumbnail:</dt><dd>{post.thumbnail || 'N/A'}</dd></div>
        <div><dt className="font-medium">Status:</dt><dd>{post.status}</dd></div>
        <div><dt className="font-medium">Deleted:</dt><dd>{post.deleted ? 'Yes' : 'No'}</dd></div>
        <div><dt className="font-medium">Created At:</dt><dd>{post.createdAt}</dd></div>
        <div><dt className="font-medium">Updated At:</dt><dd>{post.updatedAt}</dd></div>
      </dl>
      <div>
        <h3 className="font-medium">Content:</h3>
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
      <div className="flex justify-end space-x-2 ">
        <Button variant="default" onClick={() => navigate(`/post/${post._id}/edit`)}>Edit</Button>
        <Button variant="secondary" onClick={() => navigate(-1)}>Back</Button>
      </div>
    </div>
  );
}
