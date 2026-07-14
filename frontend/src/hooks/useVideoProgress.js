import { useEffect, useRef } from 'react';
import api from '../services/api';

export default function useVideoProgress(lessonId, userId, onProgressUpdate) {
  const videoRef = useRef(null);
  
  const accumulatedTimeRef = useRef(0);
  const lastTimeRef = useRef(null);
  
  const lessonIdRef = useRef(lessonId);
  const userIdRef = useRef(userId);
  const prevLessonIdRef = useRef(lessonId);

  // Sync refs to ensure window unload handlers always have the latest values without re-binding
  useEffect(() => {
    lessonIdRef.current = lessonId;
    userIdRef.current = userId;
  }, [lessonId, userId]);

  // Helper to send a progress heartbeat ping
  const sendPing = async (targetLessonId, watchTimeSeconds, status = 'in_progress') => {
    if (watchTimeSeconds <= 0) return;

    const storageKey = `lesson_progress_delta_${userId}_${targetLessonId}`;
    
    // Clear locally accumulated seconds before calling API to prevent race conditions / duplicate pings
    sessionStorage.removeItem(storageKey);
    if (String(targetLessonId) === String(lessonIdRef.current)) {
      accumulatedTimeRef.current = 0;
    }

    try {
      await api.post('/api/progress/ping', {
        lesson_id: targetLessonId,
        watch_time_seconds: watchTimeSeconds,
        status: status,
      });
      if (onProgressUpdate) {
        onProgressUpdate();
      }
    } catch (err) {
      console.error('Failed to send progress ping', err);
      // Restore watch time on failure so it can be retried on next event/pause
      if (String(targetLessonId) === String(lessonIdRef.current)) {
        accumulatedTimeRef.current += watchTimeSeconds;
        sessionStorage.setItem(storageKey, String(accumulatedTimeRef.current));
      }
    }
  };

  // Expose a manual progress flush function
  const flushProgress = async (status = 'in_progress') => {
    const watchTime = Math.round(accumulatedTimeRef.current);
    if (watchTime > 0) {
      await sendPing(lessonIdRef.current, watchTime, status);
    } else if (status === 'completed') {
      // In case we want to complete without additional watch time
      await api.post('/api/progress/ping', {
        lesson_id: lessonIdRef.current,
        watch_time_seconds: 0,
        status: 'completed',
      });
      if (onProgressUpdate) {
        onProgressUpdate();
      }
    }
  };

  // 1. Handle lesson change: flush the previous lesson's progress
  useEffect(() => {
    const oldLessonId = prevLessonIdRef.current;
    if (oldLessonId && String(oldLessonId) !== String(lessonId)) {
      const oldStorageKey = `lesson_progress_delta_${userId}_${oldLessonId}`;
      const oldAccumulatedStr = sessionStorage.getItem(oldStorageKey);
      const oldAccumulated = oldAccumulatedStr ? parseFloat(oldAccumulatedStr) : 0;
      
      if (oldAccumulated > 0) {
        sendPing(oldLessonId, Math.round(oldAccumulated));
      }
    }

    prevLessonIdRef.current = lessonId;
    
    // Initialize or load accumulated progress for the new lesson
    const storageKey = `lesson_progress_delta_${userId}_${lessonId}`;
    const stored = sessionStorage.getItem(storageKey);
    accumulatedTimeRef.current = stored ? parseFloat(stored) : 0;
    lastTimeRef.current = null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId, userId]);

  // 2. Attach video event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      lastTimeRef.current = video.currentTime;
    };

    const handlePause = () => {
      lastTimeRef.current = null;
      const watchTime = Math.round(accumulatedTimeRef.current);
      if (watchTime > 0) {
        sendPing(lessonIdRef.current, watchTime);
      }
    };

    const handleSeeking = () => {
      // Reset last time to prevent jumping from calculating as watch progress
      lastTimeRef.current = null;
    };

    const handleTimeUpdate = () => {
      const currentTime = video.currentTime;
      if (lastTimeRef.current !== null) {
        const delta = currentTime - lastTimeRef.current;
        // Count normal playback progress (rejecting seeks or skips)
        if (delta > 0 && delta < 2) {
          accumulatedTimeRef.current += delta;
          const storageKey = `lesson_progress_delta_${userIdRef.current}_${lessonIdRef.current}`;
          sessionStorage.setItem(storageKey, String(accumulatedTimeRef.current));
        }
      }
      lastTimeRef.current = currentTime;

      // Send delta update automatically every 30 seconds of accumulated watch time
      if (accumulatedTimeRef.current >= 30) {
        sendPing(lessonIdRef.current, Math.round(accumulatedTimeRef.current));
      }
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('seeking', handleSeeking);
    video.addEventListener('seeked', handleSeeking);
    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('seeking', handleSeeking);
      video.removeEventListener('seeked', handleSeeking);
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]); // Re-attach when lesson changes (video element is remounted/rekeyed)

  // 3. Handle window beforeunload / pagehide events to flush progress before exit
  useEffect(() => {
    const handleUnload = () => {
      const watchTime = Math.round(accumulatedTimeRef.current);
      if (watchTime <= 0) return;

      const payload = {
        lesson_id: lessonIdRef.current,
        watch_time_seconds: watchTime,
        status: 'in_progress',
      };

      // Keepalive allows the request to outlive the closing of the page
      fetch('/api/progress/ping', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
        keepalive: true,
        credentials: 'include',
      });

      const storageKey = `lesson_progress_delta_${userIdRef.current}_${lessonIdRef.current}`;
      sessionStorage.removeItem(storageKey);
      accumulatedTimeRef.current = 0;
    };

    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('pagehide', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      window.removeEventListener('pagehide', handleUnload);
    };
  }, []);

  return {
    videoRef,
    flushProgress,
  };
}
