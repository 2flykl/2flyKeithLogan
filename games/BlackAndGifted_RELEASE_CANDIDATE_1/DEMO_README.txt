BLACK & GIFTED — RC20.3 START FIX

Launch with START_DEMO.bat.

This build fixes a startup exception in RC20.2 caused by a stale reference to the removed BAG_VIDEO_CUE object. That error occurred after clicking ENTER THE MUSEUM, which is why the button changed to RETRY ENTERING while the title screen stayed visible.

Videos remain external local media under assets/videos and are loaded lazily by scene.
