"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Video, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SkeletonCard } from "@/components/ui/skeleton-card";

interface VideoItem {
  id: string;
  title: string;
  game: string;
  duration: string | null;
  url: string;
  thumbnailUrl: string | null;
}

export default function VideoPreviews() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await fetch("/api/videos");
        const data = await res.json();
        if (data.videos) {
          setVideos(data.videos);
        }
      } catch (err) {
        console.error("Failed to fetch videos:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchVideos();
  }, []);

  return (
    <section id="previews" className="relative section-padding">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-vivid-primary/[0.02] rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-vivid-primary/10 border border-vivid-primary/20 text-vivid-primary text-xs font-semibold uppercase tracking-wider mb-6">
            <Video className="w-3.5 h-3.5" />
            Previews
          </div>
          <h2 className="text-fluid-3xl font-bold mb-4 md:mb-6 text-balance">
            Watch It <span className="gradient-text">Dominate</span>
          </h2>
          <p className="text-vivid-textMuted text-fluid-base max-w-2xl mx-auto leading-relaxed px-4">
            Real gameplay footage showcasing VIVID&apos;s AI precision across multiple Roblox titles.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} className="aspect-video" />
            ))}
          </div>
        )}

        {/* Video Grid */}
        {!loading && videos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {videos.map((video, i) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group relative rounded-2xl overflow-hidden border aspect-video cursor-pointer border-vivid-border/50"
                style={{ background: "#0a0a0a" }}
                onClick={() => setActiveVideo(video)}
              >
                {/* Thumbnail or gradient fallback */}
                <div className="absolute inset-0 bg-gradient-to-br from-vivid-primary/5 to-transparent" />
                {video.thumbnailUrl && (
                  <Image
                    src={video.thumbnailUrl}
                    alt={video.title}
                    fill
                    className="object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                )}

                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-vivid-primary/20 flex items-center justify-center group-hover:bg-vivid-primary/30 group-hover:scale-110 transition-all duration-300">
                    <Play className="w-7 h-7 text-vivid-primary fill-vivid-primary/40 ml-1" />
                  </div>
                </div>

                {/* Info overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="text-white font-semibold text-sm">{video.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-vivid-textDim text-xs">{video.game}</span>
                    {video.duration && (
                      <>
                        <span className="text-vivid-textDim text-xs">•</span>
                        <span className="text-vivid-textDim text-xs">{video.duration}</span>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && videos.length === 0 && (
          <div className="text-center py-16">
            <Video className="w-12 h-12 text-vivid-textDim mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No Videos Yet</h3>
            <p className="text-vivid-textMuted text-sm max-w-md mx-auto">
              Gameplay preview videos will be added soon. Check back later!
            </p>
          </div>
        )}
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setActiveVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden border border-vivid-border/50 bg-vivid-bg"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <video
                src={activeVideo.url}
                controls
                autoPlay
                className="w-full h-full"
                poster={activeVideo.thumbnailUrl || undefined}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
