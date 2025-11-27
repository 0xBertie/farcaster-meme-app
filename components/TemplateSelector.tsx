"use client";

import { useState, useEffect } from 'react';
import { MemeTemplate } from '@/lib/db';

interface Props {
  onSelect: (template: MemeTemplate) => void;
}

export default function TemplateSelector({ onSelect }: Props) {
  const [templates, setTemplates] = useState<MemeTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    const response = await fetch('/api/templates');
    const data = await response.json();
    if (data.success) {
      setTemplates(data.templates);
    }
    setLoading(false);
  };

  if (loading) return <div className="text-center py-4">Loading templates...</div>;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h3 className="text-xl font-bold mb-4">🎭 Popular Templates</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {templates.map((template) => (
          <button key={template.id} onClick={() => onSelect(template)}
            className="group relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-purple-500 transition-colors">
            <img src={template.image_url} alt={template.name} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 text-center text-sm">
              {template.name}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
