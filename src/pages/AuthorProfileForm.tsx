// 📁 pages/CreateAuthor.tsx
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function CreateAuthor() {
  const [penName, setPenName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const user_id = user?.id;
    if (!user_id) return setError('Not logged in');

    // Upload avatar if file exists
    let avatar_url = '';
    if (avatarFile) {
      const ext = avatarFile.name.split('.').pop();
      const filePath = `${user_id}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('authors')
        .upload(filePath, avatarFile, { upsert: true });

      if (uploadError) return setError(uploadError.message);

      avatar_url = supabase.storage
        .from('authors')
        .getPublicUrl(filePath).data.publicUrl;
    }

    // Create author profile
    const { error: insertError } = await supabase.from('authors').insert({
      pen_name: penName,
      bio,
      user_id,
      avatar_url,
    });

    if (insertError) return setError(insertError.message);
    setSuccess(true);
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-bearBrown">Create Your Author Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Pen Name"
          value={penName}
          onChange={(e) => setPenName(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <textarea
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
          className="w-full border p-2 rounded"
        />
        <button className="px-4 py-2 rounded" type="submit">
          Submit
        </button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">Profile created!</p>}
    </div>
  );
}
