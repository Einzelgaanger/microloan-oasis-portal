
import React, { useState, useRef } from 'react';
import { Button } from './button';
import { Upload, X, Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  accept?: string;
  maxSize?: number; // size in bytes
  onFileSelected: (file: File | null) => void;
  currentFile: File | null;
  helperText?: string;
  className?: string;
}

export function FileUpload({
  accept,
  maxSize = 5 * 1024 * 1024, // Default 5MB
  onFileSelected,
  currentFile,
  helperText,
  className,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateFile = (file: File): boolean => {
    setError(null);
    
    // Validate file type if accept is provided
    if (accept) {
      const acceptedTypes = accept.split(',').map(type => type.trim());
      const fileType = file.type;
      const fileExtension = `.${file.name.split('.').pop()}`;
      
      const isValidType = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          // Check extension
          return fileExtension.toLowerCase() === type.toLowerCase();
        } else if (type.includes('*')) {
          // Check MIME type with wildcard
          const typeParts = type.split('/');
          const fileTypeParts = fileType.split('/');
          return typeParts[0] === fileTypeParts[0] && (typeParts[1] === '*' || typeParts[1] === fileTypeParts[1]);
        } else {
          // Exact MIME type match
          return fileType === type;
        }
      });
      
      if (!isValidType) {
        setError(`File type not accepted. Please upload ${accept.replace(/,/g, ' or ')}`);
        return false;
      }
    }
    
    // Validate file size
    if (file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / (1024 * 1024));
      setError(`File too large. Maximum size is ${maxSizeMB}MB.`);
      return false;
    }
    
    return true;
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        onFileSelected(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        onFileSelected(file);
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    onFileSelected(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} bytes`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className={cn("space-y-2", className)}>
      <input
        type="file"
        ref={fileInputRef}
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
      
      {!currentFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleFileDrop}
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
            isDragging
              ? "border-lending-primary bg-lending-primary/5"
              : "border-gray-300 hover:border-lending-primary/50 hover:bg-gray-50",
            error && "border-red-300 bg-red-50"
          )}
          onClick={handleButtonClick}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            {error ? (
              <AlertCircle className="h-10 w-10 text-red-500" />
            ) : (
              <Upload className="h-10 w-10 text-gray-400" />
            )}
            <div className="space-y-1">
              <p className={cn("text-sm font-medium", error ? "text-red-600" : "text-gray-700")}>
                {error || 'Click to upload or drag and drop'}
              </p>
              <p className="text-xs text-gray-500">
                {accept && `Accepted formats: ${accept}`}
                {maxSize && accept && ' · '}
                {maxSize && `Max size: ${formatFileSize(maxSize)}`}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center p-4 border rounded-lg bg-gray-50">
          <div className="bg-green-100 rounded-full p-2 mr-3">
            <Check className="h-4 w-4 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm text-gray-900 truncate">
              {currentFile.name}
            </p>
            <p className="text-xs text-gray-500">
              {formatFileSize(currentFile.size)}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="ml-2 text-gray-500 hover:text-red-600"
            onClick={removeFile}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      {helperText && !error && (
        <p className="text-xs text-gray-500">{helperText}</p>
      )}
    </div>
  );
}
