import wallPic from '../textures/brickwork.jpeg';

async function createAudioPlayer(name: string) {
  const arrayBuffer = await import(`../audio/${name}`);
  const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
  const objectUrl = URL.createObjectURL(blob);
  return (volume?: number) => {
    const audio = new Audio(objectUrl);
    if (volume) {
      audio.volume = volume;
    }
    audio.play();
  };
}

const audios = {} as Record<string, (volume?: number) => void>;
(async function() {
  audios['Do'] = await createAudioPlayer('40.mp3');
  audios['Ri'] = await createAudioPlayer('42.mp3');
  audios['Mi'] = await createAudioPlayer('44.mp3');
  audios['Fa'] = await createAudioPlayer('45.mp3');
})();
// createAudioPlayer('tonbi.wav').then(play => play(0.9));

const wall = spatialDocument.getSpatialObjectById('box1');
createImageBitmap(new Blob([wallPic], { type: 'image/jpeg' })).then((bitmap) => {
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'yellow';
  ctx.fillRect(0, 0, 200, 100);

  ctx.drawImage(bitmap, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const wallTexture = new BABYLON.RawTexture(
    imageData.data,
    imageData.width,
    imageData.height,
    BABYLON.Engine.TEXTUREFORMAT_RGBA,
    spatialDocument.scene,
    false,
    false,
    BABYLON.Texture.TRILINEAR_SAMPLINGMODE);

  const wallMaterial = wall.asNativeType<BABYLON.Mesh>().material as BABYLON.StandardMaterial;
  wallMaterial.diffuseTexture = wallTexture;
});

const guiPlane = spatialDocument.getSpatialObjectById('gui');
const panel = guiPlane.shadowRoot;

const subChildren = panel.querySelectorAll('.sub');
for (let sub of subChildren) {
  const subElement = sub as HTMLElement;
  subElement.style.backgroundColor = 'rgba(20,33,33,.95)';
  subElement.style.height = '200px';
  subElement.style.width = '300px';
  subElement.style.marginLeft = '50px';
  subElement.style.fontSize = '80px';
  subElement.style.color = '#fff';
  subElement.style.textAlign = 'center';
  subElement.style.border = '15px solid yellow';
  subElement.style.borderRadius = '50px';
  subElement.style.paddingTop = '20px';

  /** Listen events */
  subElement.addEventListener('mouseenter', () => {
    subElement.style.backgroundColor = 'rgba(100,0,120,.95)';
  });
  subElement.addEventListener('mouseleave', () => {
    subElement.style.backgroundColor = 'rgba(60,33,33,.95)';
  });
  subElement.addEventListener('mouseup', () => {
    subElement.style.backgroundColor = 'rgba(30,33,33,.95)';
    const playAudio = audios[subElement.textContent];
    if (playAudio) {
      playAudio(1.0);
    }
  });
}
spatialDocument.watchInputEvent();
