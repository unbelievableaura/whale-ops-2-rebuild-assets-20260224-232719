import { useEffect, useMemo, useState } from "react";

type AssetItem = {
  path: string;
  ext: string;
  size: number;
  name: string;
};

type AssetManifest = {
  generatedAt: string;
  count: number;
  assets: AssetItem[];
};

const imageExts = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".ico", ".avif"]);
const videoExts = new Set([".mp4", ".webm"]);
const audioExts = new Set([".mp3", ".wav", ".ogg"]);

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
}

export default function Assets() {
  const [manifest, setManifest] = useState<AssetManifest | null>(null);

  useEffect(() => {
    fetch("/asset-manifest.json")
      .then((r) => r.json())
      .then((data) => setManifest(data))
      .catch(() => setManifest({ generatedAt: new Date().toISOString(), count: 0, assets: [] }));
  }, []);

  const grouped = useMemo(() => {
    const assets = manifest?.assets ?? [];
    return {
      images: assets.filter((a) => imageExts.has(a.ext)),
      videos: assets.filter((a) => videoExts.has(a.ext)),
      audio: assets.filter((a) => audioExts.has(a.ext)),
      other: assets.filter((a) => !imageExts.has(a.ext) && !videoExts.has(a.ext) && !audioExts.has(a.ext)),
    };
  }, [manifest]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-10 font-rajdhani">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="space-y-2 border-b border-zinc-800 pb-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-wide">PUNCH OPS · Asset Preview</h1>
          <p className="text-zinc-400">Standalone asset catalog page (direct URL only). Not linked from in-app navigation.</p>
          <p className="text-sm text-zinc-500">
            {manifest ? `${manifest.count} assets · Generated ${new Date(manifest.generatedAt).toLocaleString()}` : "Loading asset manifest..."}
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Images ({grouped.images.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {grouped.images.map((asset) => (
              <article key={asset.path} className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
                <img src={asset.path} alt={asset.name} className="w-full h-48 object-cover bg-black" loading="lazy" />
                <div className="p-3 text-xs space-y-1">
                  <p className="font-semibold break-all">{asset.name}</p>
                  <p className="text-zinc-400 break-all">{asset.path}</p>
                  <p className="text-zinc-500">{formatBytes(asset.size)}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Videos ({grouped.videos.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {grouped.videos.map((asset) => (
              <article key={asset.path} className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
                <video src={asset.path} controls className="w-full h-56 bg-black" preload="metadata" />
                <div className="p-3 text-xs space-y-1">
                  <p className="font-semibold break-all">{asset.name}</p>
                  <p className="text-zinc-400 break-all">{asset.path}</p>
                  <p className="text-zinc-500">{formatBytes(asset.size)}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Audio ({grouped.audio.length})</h2>
          <div className="space-y-3">
            {grouped.audio.map((asset) => (
              <article key={asset.path} className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-sm">
                <p className="font-semibold break-all">{asset.name}</p>
                <p className="text-zinc-400 break-all mb-2">{asset.path}</p>
                <audio src={asset.path} controls className="w-full" preload="metadata" />
              </article>
            ))}
          </div>
        </section>

        {grouped.other.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Other ({grouped.other.length})</h2>
            <ul className="space-y-2 text-sm text-zinc-300">
              {grouped.other.map((asset) => (
                <li key={asset.path} className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-3 break-all">
                  {asset.path}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
