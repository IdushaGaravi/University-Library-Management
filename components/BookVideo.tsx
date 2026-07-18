"use client";

import React from "react";
import { Video, ImageKitProvider } from "@imagekit/next";
import config from "@/lib/config";

const {
  env: {
    imagekit: { urlEndpoint },
  },
} = config;

const BookVideo = ({ videoUrl }: { videoUrl: string }) => {
  return (
    <ImageKitProvider urlEndpoint={urlEndpoint}>
      <Video src={videoUrl} controls={true} className="w-full rounded-xl" />
    </ImageKitProvider>
  );
};

export default BookVideo;