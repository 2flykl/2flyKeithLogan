# Stereo controls and speaker lighting — 2026-09-18

Music Page 2 now uses transparent semantic button targets aligned to the original photographed stereo controls. The added raised buttons and VOL badge are removed. The existing photograph is reused; no new image download or library is required.

The photographed volume dial face is rendered from the same cached scene image and rotates through a 270-degree range. Pointer dragging tracks angular motion with pointer capture. Arrow keys change volume by 2%, Page Up/Down by 10%, and Home/End set the limits. HUD and on-stereo volume buttons step by 5%. All paths clamp between 0% and 100%, unmute intentionally, update the shared audio element and synchronize the HUD. The mobile dial has an invisible 44px target around its original-size face.

Two LED rings follow the woofer surrounds. Both share Ice Blue, Amber, Violet, Rose, Mint, and Off settings. They pulse gently during unmuted playback and dim when stopped, paused or muted. This is a playback-state animation, not frequency/beat analysis. Reduced-motion preferences disable the pulse. LED color remains selected across route changes in the current page session.

Validation: syntax and whitespace checks; desktop screenshot inspection; real playback from the photographed button; previous/next disc; stop at zero; rotary pointer drag from 20% to 53%; keyboard control; volume clamps at 0 and 100%; 5% volume steps; LED color changes and Off display; phone HUD screenshot and 44px controls with no horizontal overflow. Existing binder and video route checked after changes. No physical-phone testing or subjective listening claim.
