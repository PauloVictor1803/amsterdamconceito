import React from 'react';
import DOMPurify from 'dompurify';
import { useStoreConfig } from '../context/StoreConfigContext';

interface EditableTextProps {
  field: string;
  defaultText?: string;
  className?: string;
}

export const EditableText: React.FC<EditableTextProps> = ({ field, defaultText = '', className }) => {
  const { config, loading } = useStoreConfig();

  let displayValue = defaultText;

  if (!loading && config && config[field] !== undefined) {
    const value = config[field];
    if (typeof value === 'string') {
      displayValue = value;
    }
  }

  const sanitizedHTML = DOMPurify.sanitize(displayValue);

  return (
    <span 
      className={className} 
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }} 
    />
  );
};
