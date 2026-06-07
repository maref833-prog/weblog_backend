// components/MusicPlaylist.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX,
  Heart,
  Clock,
  Music,
  ListMusic
} from "lucide-react";
import Image from "next/image";

interface Song {
  id: number;
  title: string;
  artist: string;
  duration: string;
  cover: string;
  audio: string;
  plays: string;
}

export default function MusicPlaylist() {
  const [currentSong, setCurrentSong] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [likedSongs, setLikedSongs] = useState<number[]>([]);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const songs: Song[] = [
    {
      id: 1,
      title: "Midnight Dreams",
      artist: "Sarah Johnson",
      duration: "3:45",
      cover: "/musics/1.jpg",
      audio: "/musicss/m1.mp3",
      plays: "1.2M",
    },
    {
      id: 2,
      title: "Electric Sunrise",
      artist: "The Wave",
      duration: "4:12",
      cover: "/musics/2.jpg",
      audio: "/musics/m1.mp3",
      plays: "892K",
    },
    {
      id: 3,
      title: "Ocean Waves",
      artist: "Deep Blue",
      duration: "3:58",
      cover: "/musics/3.jpg",
      audio: "/musics/m1.mp3",
      plays: "2.1M",
    },
    {
      id: 4,
      title: "City Lights",
      artist: "Urban Soul",
      duration: "4:30",
      cover: "/musics/4.jpg",
      audio: "/musics/m1.mp3",
      plays: "567K",
    },
    {
      id: 5,
      title: "Mountain High",
      artist: "Nature Sounds",
      duration: "5:02",
      cover: "/musics/5.jpg",
      audio: "/musics/m1.mp3",
      plays: "3.4M",
    },
    {
      id: 6,
      title: "Midnight Dreams",
      artist: "Sarah Johnson",
      duration: "3:45",
      cover: "/musics/1.jpg",
      audio: "/musicss/m1.mp3",
      plays: "1.2M",
    },
    {
      id: 7,
      title: "Electric Sunrise",
      artist: "The Wave",
      duration: "4:12",
      cover: "/musics/2.jpg",
      audio: "/musics/m1.mp3",
      plays: "892K",
    },
    {
      id: 8,
      title: "Ocean Waves",
      artist: "Deep Blue",
      duration: "3:58",
      cover: "/musics/3.jpg",
      audio: "/musics/m1.mp3",
      plays: "2.1M",
    },
    {
      id: 9,
      title: "City Lights",
      artist: "Urban Soul",
      duration: "4:30",
      cover: "/musics/4.jpg",
      audio: "/musics/m1.mp3",
      plays: "567K",
    },
    {
      id: 10,
      title: "Mountain High",
      artist: "Nature Sounds",
      duration: "5:02",
      cover: "/musics/5.jpg",
      audio: "/musics/m1.mp3",
      plays: "3.4M",
    },
  ];

  // توابع مورد نیاز
  const playNext = () => {
    const nextIndex = (currentSong + 1) % songs.length;
    setCurrentSong(nextIndex);
  };

  const playPrevious = () => {
    const prevIndex = (currentSong - 1 + songs.length) % songs.length;
    setCurrentSong(prevIndex);
  };

  // تنظیم event listenerها هنگام تغییر آهنگ
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setCurrentTime(0);
    };
    
    const handleEnded = () => {
      playNext();
    };
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    
    // اگر در حالت پخش بودیم، آهنگ جدید رو پخش کن
    if (isPlaying) {
      audio.play().catch(error => {
        console.log("Playback error:", error);
        setIsPlaying(false);
      });
    }
    
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentSong]);

  // همگام‌سازی وضعیت پخش
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(error => {
        console.log("Playback error:", error);
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // همگام‌سازی mute
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = isMuted;
  }, [isMuted]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current && !isNaN(time)) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value);
    if (audioRef.current && !isNaN(volume)) {
      audioRef.current.volume = volume;
    }
  };

  const toggleLike = (songId: number) => {
    if (likedSongs.includes(songId)) {
      setLikedSongs(likedSongs.filter(id => id !== songId));
    } else {
      setLikedSongs([...likedSongs, songId]);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || !isFinite(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
      {/* Section Header */}
      <div className="text-center mb-12 md:mb-16">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs sm:text-sm mb-4">
          <Music className="w-4 h-4" />
          <span>Featured Playlist</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent mb-4">
          Music Playlist
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
          Curated tracks for your listening pleasure
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Now Playing Section */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-secondary/50 to-secondary/30 rounded-2xl p-6 sticky top-24">
            <div className="text-center">
              {/* Album Art */}
              <div className="relative w-48 h-48 mx-auto mb-6 rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={songs[currentSong].cover}
                  alt={songs[currentSong].title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Song Info */}
              <h3 className="text-xl font-bold mb-1">{songs[currentSong].title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{songs[currentSong].artist}</p>

              {/* Audio Element */}
              <audio
                key={currentSong}
                ref={audioRef}
                src={songs[currentSong].audio}
                preload="metadata"
              />

              {/* Progress Bar */}
              <div className="mb-4">
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4 mb-4">
                <button
                  onClick={playPrevious}
                  className="p-2 rounded-full hover:bg-secondary transition-colors"
                >
                  <SkipBack className="w-5 h-5" />
                </button>
                <button
                  onClick={togglePlay}
                  className="p-4 bg-primary text-primary-foreground rounded-full hover:scale-105 transition-transform"
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </button>
                <button
                  onClick={playNext}
                  className="p-2 rounded-full hover:bg-secondary transition-colors"
                >
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>

              {/* Volume Control */}
              <div className="flex items-center justify-center gap-2">
                <button onClick={toggleMute} className="p-1">
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  defaultValue={1}
                  onChange={handleVolumeChange}
                  className="w-24 h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Playlist Section */}
        <div className="lg:col-span-2">
          <div className="bg-background border border-border rounded-2xl overflow-hidden">
            {/* Playlist Header */}
            <div className="p-4 border-b border-border bg-secondary/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ListMusic className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Playlist • {songs.length} songs</h3>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Duration</span>
                </div>
              </div>
            </div>

            {/* Song List */}
            <div className="divide-y divide-border overflow-y-auto scrollbar-thin h-96">
              {songs.map((song, index) => (
                <div
                  key={song.id}
                  className={`group flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors cursor-pointer ${
                    currentSong === index ? "bg-primary/10" : ""
                  }`}
                  onClick={() => {
                    setCurrentSong(index);
                    setIsPlaying(true);
                  }}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {/* Song Number or Play Button */}
                    <div className="w-8 text-center flex-shrink-0">
                      {currentSong === index && isPlaying ? (
                        <div className="flex gap-0.5 justify-center">
                          <div className="w-1 h-3 bg-primary animate-pulse" />
                          <div className="w-1 h-4 bg-primary animate-pulse delay-75" />
                          <div className="w-1 h-2 bg-primary animate-pulse delay-150" />
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground group-hover:hidden">
                          {index + 1}
                        </span>
                      )}
                      <Play className="w-4 h-4 hidden group-hover:block text-primary" />
                    </div>

                    {/* Song Cover */}
                    <div className="relative w-10 h-10 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={song.cover}
                        alt={song.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Song Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{song.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    {/* Play Count */}
                    <span className="text-xs text-muted-foreground hidden md:block">
                      {song.plays}
                    </span>

                    {/* Like Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(song.id);
                      }}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          likedSongs.includes(song.id)
                            ? "fill-red-500 text-red-500"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>

                    {/* Duration */}
                    <span className="text-xs text-muted-foreground w-12 text-right">
                      {song.duration}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* View All Music Button */}
          <div className="text-center mt-8">
            <button className="inline-flex items-center gap-2 px-6 py-2 md:px-8 md:py-3 bg-secondary text-secondary-foreground rounded-full hover:bg-secondary/80 transition-all duration-300 text-sm md:text-base font-medium group">
              <span>Explore Full Library</span>
              <Music className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}