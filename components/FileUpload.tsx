'use client';

import config from '@/lib/config';
import { cn } from '@/lib/utils';
import { Image as IKImage, ImageKitProvider, upload, Video } from '@imagekit/next';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

const { env: { imagekit : { publicKey, urlEndpoint }}} = config;

const authenticator = async () => {
  try {
    const response = await fetch('/api/auth/imagekit');

    if(!response.ok) {
      const errorText = await response.text();

      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();
    const { signature, expire, token } = data;

    return { token, expire, signature};

  } catch (error: any) {
    throw new Error(`Authentication request failed: ${error.message}`)
  }
}

interface Props {
  type: 'image' | 'video';
  accept: string;
  placeholder: string;
  folder: string;
  variant: 'dark' | 'light';
  onFileChange: (filePath: string) => void;
  value?: string;
}

const FileUpload = ({ type, accept, placeholder, folder, variant, onFileChange, value }: Props) => {
  const ikUploadRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<{ filePath: string | null }>({filePath: value ?? null });
  const [progress, setProgress] = useState(0);

  const styles = {
    button: variant === 'dark' ? 'bg-dark-300' : 'bg-light-600 border-gray-100 border',
    placeholder: variant === 'dark' ? 'text-light-100' : 'text-slate-500',
    text: variant === 'dark' ? 'text-light-100' : 'text-dark-400',
  }

  const onError = (error: any) => {
    console.log(error);

    toast(`${type} upload failed`, {
      description: `Your ${type} could not be uploaded. Please try again.`,
      //variant: 'destructive'
    })
  };

  const onSuccess = (res: any) => {
    setFile(res);
    onFileChange(res.filePath);

    toast(`${type} uploaded successfully`, {
      description: `${res.filePath} uploaded successfully!`,
    })
  };

  const onValidate = (file: File) => {
    if(type === 'image') {
      if(file.size > 20 * 1024 * 1024) {
        toast({
          title: 'File size too large',
          description: 'Please upload a file that is less than 20MB in size',
          variant: 'destructive'
        });

        return false;
      } 
    } else if (type === 'video') {
        if(file.size > 50 * 1024 *1024) {
          toast({
            title: 'File size too large',
            description: 'Please upload a file that is less than 50MB in size',
            variant: 'destructive'
          });

          return false;
      }
    }

    return true;
  }

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!onValidate(selectedFile)) return;

    setProgress(0);

    try {
      const { token, expire, signature } = await authenticator();

      const result = await upload({
        file: selectedFile,
        fileName: selectedFile.name,
        publicKey,
        signature,
        expire,
        token,
        folder,
        onProgress: (event) => {
          const percent = Math.round((event.loaded / event.total) * 100);
          setProgress(percent);
        },
      });

      onSuccess(result);
    } catch (error) {
      onError(error);
    }
  };

  return (
    <ImageKitProvider urlEndpoint={urlEndpoint}>
      <input 
        ref={ikUploadRef} 
        type='file' 
        className='hidden'
        accept={accept}
        onChange={handleChange} />

      <button 
        className={cn('upload-btn', styles.button)} 
        onClick={(e) => {
          e.preventDefault();

          if(ikUploadRef.current) {
            ikUploadRef.current?.click();
          }
        }}
      >
        <Image src='/icons/upload.svg' alt='upload-icon' width={20} height={20} className='object-contain' />

        <p className={cn('text-base', styles.placeholder)}>{placeholder}</p>

        {file && (
          <p className={cn('upload-filename', styles.text)}>{file.filePath}</p>
        )}

        {file && <p className='upload-filename'>{file.filePath}</p>}
      </button>

      {progress > 0 && progress !== 100 && (
        <div className='w-full rounded-full bg-green-200'>
          <div className='progress' style={{ width: `${progress}%`}}>
            {progress}%
          </div>
        </div>
      )}

      {file && (
        (type === 'image' ? (
          <IKImage 
            alt={file.filePath}
            src={file.filePath}
            width={500}
            height={300}
          />
        ): type === 'video' ? (
          <Video 
            src={file.filePath}
            controls={true}
            className='h-96 w-full rounded-xl'
          />
        ) : null)
      )}
    </ImageKitProvider>
  )
}

export default FileUpload