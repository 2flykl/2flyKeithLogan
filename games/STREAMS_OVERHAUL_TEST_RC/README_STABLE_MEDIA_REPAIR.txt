STREAMS · STABLE MEDIA REPAIR

This build rolls back the last broken proportion change and repairs the two root problems:
- Player collision/hitbox stays at the last stable dimensions; only visual character size is +6%.
- Platforms use only the earlier clean digital-media assets plus the blue Attention Ball.
- No shoe, trophy, sunglasses, money-stack, or other generated polish prop is used as a platform.
- Money remains attached collectible reward art only.
- Platform source PNGs are tightly cropped offline, then rendered with preserved natural aspect ratio.
- Collision width and visible platform width are kept aligned without stretching the artwork.

Run START_STREAMS_STABLE_MEDIA_REPAIR.bat
