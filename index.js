const ytdl = require('@justherza/ytdl-me');
const ytsr = require('youtube-sr').default;
const zip = require("adm-zip");
const fs = require('fs');
const name = process.argv[2];

async function run(q) {
  const r = await ytsr.search(q, { limit: 1 }).then(x => x[0].id);
  const v = await ytdl.download(
    {
      yt_link: "https://music.youtube.com/watch?v=" + r,
      yt_format: "mp3",
      saveId: true
    }
  );
  return Buffer.from(await fetch(v.media).then(x => x.arrayBuffer()));
}


if (!name || !fs.existsSync(name)) {
  console.error('Please specify a text file with song names.');
  process.exit();
}
console.log('Downloading... (may take a very long time!)');

let s = fs.readFileSync(name, { encoding: 'utf-8' }).split('\n');
Promise.all(s.map(async x => [x, await run(x)])).then(x => {
  let z = new zip();
  x.forEach(y =>
    z.addFile(y[0] + '.mp3', y[1])
  );
  z.writeZip(name.replace(/\.\w{1,4}$/, '') + '.zip');
});