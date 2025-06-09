import React, { useState, useEffect } from 'react';
import { useAuth } from '@/auth/AuthProvider';
import { useNavigate, useParams } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-toastify';

export default function EditPost() {
  const { api } = useAuth();
  const navigate = useNavigate();
  const { slug, _id} = useParams<{ slug: string, _id: string }>();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [updatedAt, setUpdatedAt] = useState('');
  

  useEffect(() => {
    if (!slug) return;
    api.get(`/api/v1/admin/posts/${slug}`)
      .then(res => {
        const p = res.data.data;
        setTitle(p.title);
        setDescription(p.description);
        setContent(p.content);
      })
      .catch(err => console.error(err));
  }, [api, slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const now = new Date().toISOString();
      await api.patch(`/api/v1/admin/posts/${_id}`, { title, description, content, updatedAt: now });
      toast.success('Cập nhật bài viết thành công!');
      navigate('..', { replace: true });
    } catch (error: any) {
      toast.error('Cập nhật bài viết thất bại: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-4">
      <h2 className="text-xl font-bold">Edit Post</h2>
      {/* Title */}
      <div>
        <label className="block font-medium">Title</label>
        <Input  value={title} onChange={e => setTitle(e.target.value)} required />
      </div>
      {/* Description */}
      <div>
        <label className="block font-medium">Description</label>
        <Input value={description} onChange={e => setDescription(e.target.value)} required />
      </div>
      {/* Content */}
      <div>
        <label className="block font-medium">Content</label>
        <Editor
          apiKey="pzrh7ziqqifd6v29e0xxfyp85ep56lkd3abyo6i0exqhawxc"
          init={{
            
            height: 500,
            plugins: [
              'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
              'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
              'insertdatetime', 'media', 'table', 'help', 'wordcount'
            ],
            toolbar: 'undo redo | blocks | ' +
            'bold italic backcolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }'        
        }}          value={content}
          onEditorChange={newContent => setContent(newContent)}
        />
      </div>
      {/* Updated At */}
      <div>
        <label className="block font-medium">Updated At</label>
        <Input type="datetime-local" value={new Date().toISOString().slice(0,16)} disabled />
      </div>
      {/* Actions */}
      <div className="flex justify-end space-x-2">
        <Button variant="secondary" onClick={() => navigate(-1)}>Cancel</Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}
