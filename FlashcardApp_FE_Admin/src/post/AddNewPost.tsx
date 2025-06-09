import React, { useState } from 'react';
import { useAuth } from '@/auth/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-toastify';

export default function PostForm() {
  const { api } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [thumbnailDataUrl, setThumbnailDataUrl] = useState<string>('');

  // Khi chọn file, tạo preview + data URL
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setThumbnailFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setThumbnailPreview(dataUrl);    // hiển thị preview
        setThumbnailDataUrl(dataUrl);    // gửi lên API
      };
      reader.readAsDataURL(file);
    } else {
      setThumbnailPreview('');
      setThumbnailDataUrl('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/api/v1/admin/posts', { 
        title, 
        description, 
        content,
        thumbnail: thumbnailDataUrl,
      });
      toast.success('Tạo bài viết thành công!');
      navigate('..', { replace: true });
    } catch (err: any) {
      toast.error('Tạo bài viết thất bại: ' + err.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold">Create new post</h1>
      <br />
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-4">
      <div>
        <label className="block font-medium">Title</label>
        <Input
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block font-medium">Description</label>
        <Input
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />
      </div>

      

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
        }}
          value={content}
          onEditorChange={(newContent) => setContent(newContent)}
        />
      </div>

      <div>
        <label className="block font-medium">Thumbnail</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleThumbnailChange}
        />
        {thumbnailPreview && (
          <img src={thumbnailPreview} className="h-32 mt-2 object-cover" />
        )}
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button type="submit" onClick={() => navigate(-1)}>Create</Button>
      </div>
    </form>
    </div>
  );
}
