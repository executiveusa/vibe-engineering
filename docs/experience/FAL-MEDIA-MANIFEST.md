# Fal media manifest

Generated for the Vibe Engineering Client Zero scroll journey.

## Model

- Endpoint: `bytedance/seedance-2.0/fast/text-to-video`
- Resolution: 720p
- Audio: disabled; the owner-controlled site soundtrack remains the only audio clock
- Palette direction: Quiet Signal — ink / paper / bone / oxide
- Delivery: external fal.media assets with long-lived CDN expiration requested at generation time

## Scene assets

| Slot | Format | Request | Seed | URL |
|---|---|---|---:|---|
| scene-idea desktop | 16:9 / 6s | `01a0675b-324b-7ce1-8f10-9923b20c6f8e` | 1069341268 | `https://v3b.fal.media/files/b/0aa8f1ad/YBHF-Mb0Xkohge5MB2s_-_video.mp4` |
| scene-bar desktop | 16:9 / 6s | `01a0675b-6110-70f0-a709-f43cb43fe3a7` | 105115933 | `https://v3b.fal.media/files/b/0aa8f195/heqaXnuwW5nRe3oXHYPWX_video.mp4` |
| scene-icm desktop | 16:9 / 6s | `01a0675b-9959-77f2-aaa0-48a00b408dbd` | 1025634558 | `https://v3b.fal.media/files/b/0aa8f199/aYMsqx6MKnnmmHOHFZxDS_video.mp4` |
| scene-verify desktop | 16:9 / 6s | `01a0675b-dc22-7d81-8e69-04ba119cdc6b` | 285630386 | `https://v3b.fal.media/files/b/0aa8f19b/R8zBT7p_00spX_fPX41wd_video.mp4` |
| scene-idea mobile | 9:16 / 6s | `01a0675c-1164-7c90-bba5-78497f8a0012` | 878743556 | `https://v3b.fal.media/files/b/0aa8f19a/5Bma_425CcaDzUkG5ThEH_video.mp4` |
| scene-bar mobile | 9:16 / 6s | `01a0675c-3aa2-78b3-8625-01a76ec9cd91` | 1971234698 | `https://v3b.fal.media/files/b/0aa8f1b7/PdmNBnqm4C6UxnoL4CGGu_video.mp4` |
| scene-icm mobile | 9:16 / 6s | `01a0675c-645c-7142-ad2f-6a8714efc980` | 1814436062 | `https://v3b.fal.media/files/b/0aa8f19e/1sj90rpprndqNLnN4Dhy0_video.mp4` |
| scene-verify mobile | 9:16 / 6s | `01a0675c-9163-7bd3-b6ea-cb2f8913fbe6` | 1785780161 | `https://v3b.fal.media/files/b/0aa8f1a5/WfC4CZSzryh7QogLI5E2k_video.mp4` |
| output-image | 9:16 / 4s | `01a06760-51cc-7db3-a769-6f17db2a2b66` | 441196989 | `https://v3b.fal.media/files/b/0aa8f1b9/C8G87G3BskHiQBWk1LUoJ_video.mp4` |

## Runtime contract

- Main scenes use native 16:9 desktop and native 9:16 mobile media.
- Output cards reuse the closest scene media when a dedicated card asset is unavailable; the image card has a dedicated render.
- Media only plays while substantially visible.
- Media is muted, looped and `playsInline`.
- `prefers-reduced-motion` pauses cinematic media and preserves the static illustrated layer underneath.
- The Fal layer is presentation-only. ICM, skills, API, MCP, CLI and release authority remain unchanged.
