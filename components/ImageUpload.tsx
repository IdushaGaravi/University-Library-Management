'use client';

import config from '@/lib/config';
import { Image as IKImage, ImageKitProvider, upload } from '@imagekit/next';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

const { env: { imagekit : { publicKey, urlEndpoint }}} = config;

const authenticator = async () => {
  try {
    const response = await fetch(`${config.env.apiEndpoint}/api/auth/imagekit`);

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
    throw new Error('Authentication request failed: ${error.message}')
  }
}

const ImageUpload = ({ onFileChange }: { onFileChange: (filePath: string) => void }) => {
  const ikUploadRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<{ filePath: string } | null>(null);

  const onError = (error: any) => {
    console.log(error);

    toast("Image upload failed", {
      description: 'Your image could not be uploaded. Please try again.',
    })
  };

  const onSuccess = (res: any) => {
    setFile(res);
    onFileChange(res.filePath);

    toast("Image uploaded successfully", {
      description: `${res.filePath} uploaded successfully!`,
    })
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    try {
      const { token, expire, signature } = await authenticator();

      const result = await upload({
        file: selectedFile,
        fileName: selectedFile.name,
        publicKey,
        signature,
        expire,
        token,
      });

      onSuccess(result);
    } catch (error) {
      onError(error);
    }
  };

  return (
    <ImageKitProvider publicKey={publicKey} urlEndpoint={urlEndpoint} authenticator={authenticator}>
      <input ref={ikUploadRef} type='file' className='hidden' onChange={handleChange} />

      <button className='upload-btn' onClick={(e) => {
        e.preventDefault();

        if(ikUploadRef.current) {
          ikUploadRef.current?.click();
        }
      }}>
        <Image src='/icons/upload.svg' alt='upload-icon' width={20} height={20} className='object-contain' />

        <p className='text-base text-light-100'>Upload a File</p>

        {file && <p className='upload-filename'>{file.filePath}</p>}
      </button>

      {file && (
        <IKImage 
          alt={file.filePath}
          src={file.filePath}
          width={500}
          height={300}
        />
      )}
    </ImageKitProvider>
  )
}

export default ImageUpload