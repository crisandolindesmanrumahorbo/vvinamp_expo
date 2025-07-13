import TrackPlayer, { Event } from "react-native-track-player";

module.exports = async function () {
  // This service runs in a separate context
  console.log("TrackPlayer service started");

  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    console.log("Remote play event");
    TrackPlayer.play();
  });

  TrackPlayer.addEventListener(Event.RemotePause, () => {
    console.log("Remote pause event");
    TrackPlayer.pause();
  });

  TrackPlayer.addEventListener(Event.RemoteStop, () => {
    console.log("Remote stop event");
    TrackPlayer.stop();
  });

  TrackPlayer.addEventListener(Event.RemoteNext, () => {
    console.log("Remote next event");
    TrackPlayer.skipToNext();
  });

  TrackPlayer.addEventListener(Event.RemotePrevious, () => {
    console.log("Remote previous event");
    TrackPlayer.skipToPrevious();
  });

  TrackPlayer.addEventListener(Event.RemoteSeek, (event) => {
    console.log("Remote seek event:", event.position);
    TrackPlayer.seekTo(event.position);
  });

  TrackPlayer.addEventListener(Event.RemoteJumpForward, async (event) => {
    console.log("Remote jump forward event:", event.interval);
    const position = await TrackPlayer.getPosition();
    TrackPlayer.seekTo(position + event.interval);
  });

  TrackPlayer.addEventListener(Event.RemoteJumpBackward, async (event) => {
    console.log("Remote jump backward event:", event.interval);
    const position = await TrackPlayer.getPosition();
    TrackPlayer.seekTo(Math.max(0, position - event.interval));
  });

  TrackPlayer.addEventListener(Event.PlaybackError, (event) => {
    console.error("Playback error:", event);
  });

  TrackPlayer.addEventListener(Event.PlaybackState, (event) => {
    console.log("Playback state changed:", event.state);
  });

  TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, (event) => {
    console.log("Active track changed:", event.index);
  });
};
