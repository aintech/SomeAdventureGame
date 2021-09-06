type Gif = {
  onerror: null; // fires on error
  onprogress: null; // fires a load progress event
  onloadall: null; // event fires when all frames have loaded and gif is ready
  paused: false; // true if paused
  playing: false; // true if playing
  waitTillDone: true; // If true onload will fire when all frames loaded, if false, onload will fire when first frame has loaded
  loading: false; // true if still loading
  firstFrameOnly: false; // if true only load the first frame
  width: null; // width in pixels
  height: null; // height in pixels
  frames: []; // array of frames
  comment: ""; // comments if found in file. Note I remember that some gifs have comments per frame if so this will be all comment concatenated
  length: 0; // gif length in ms (1/1000 second)
  currentFrame: 0; // current frame.
  frameCount: 0; // number of frames
  playSpeed: 1; // play speed 1 normal, 2 twice 0.5 half, -1 reverse etc...
  lastFrame: null; // temp hold last frame loaded so you can display the gif as it loads
  image: HTMLImageElement; // the current image at the currentFrame
  playOnLoad: true; // if true starts playback when loaded

  // functions
  onload: (event: any) => {}; // fire on load. Use waitTillDone = true to have load fire at end or false to fire on first frame
  load: (filename: String) => void; // call this to load a file
  cancel: (callback: any) => boolean; // call to stop loading
  play: () => void; // call to start play
  pause: () => void; // call to pause
  seek: (time: number) => void; // call to seek to time
  seekFrame: (frame: number) => void; // call to seek to frame
  togglePlay: () => void; // call to toggle play and pause state
};

export default Gif;
