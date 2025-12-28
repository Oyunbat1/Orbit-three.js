# VR Testing Guide for Solar System

This guide explains how to test the VR capabilities of the Solar System application directly in your web browser.

## Virtual World Confirmation

**Yes, you are correct.** A VR project creates a "fully virtual world." The user is immersed in a computer-generated environment (in this case, space) rather than seeing the real world augmented (which would be AR). We achieve this by replacing the entire visual field with our 3D scene, which includes the new galaxy starfield background.

## How to Test in Browser

Since most development happens on a desktop without a VR headset constantly attached, you can use browser extensions and developer tools to simulate a VR device.

### Method 1: WebXR API Emulator (Recommended)

This browser extension allows you to simulate a VR headset (like a Meta Quest) and controllers within Chrome or Firefox.

1.  **Install the Extension**:
    *   [Chrome/Edge Store Link](https://chrome.google.com/webstore/detail/webxr-api-emulator/mjddjgeghkdijejnciaefnkjmkafnnje)
    *   [Firefox Add-on Link](https://addons.mozilla.org/en-US/firefox/addon/webxr-api-emulator/)

2.  **Open the Application**:
    *   Run your app (`npm run dev`) and visit `http://localhost:3000`.

3.  **Open DevTools**:
    *   Press `F12` or right-click and select "Inspect".
    *   Look for the **"WebXR"** tab in the DevTools panel (you might need to click `>>` to see more tabs).

4.  **Select a Device**:
    *   In the WebXR panel, select "Meta Quest 2" or similar from the list.
    *   This will tell the browser "I have a VR headset connected."

5.  **Enter VR**:
    *   Click the "Enter VR" button in your 3D scene (automatically provided by `@react-three/xr`).
    *   You should see a stereoscopic view (two lenses).

6.  **Control the Camera**:
    *   Use the emulator controls in the DevTools panel to rotate the "headset" and move around to simulate looking at the galaxy background.

### Method 2: Chrome Sensors (Basic Orientation)

If you just want to test if the background moves when you move your "device" (like a phone), you can use Chrome's Sensor tools.

1.  Open DevTools (`F12`).
2.  Press `Ctrl+Shift+P` (Cmd+Shift+P on Mac) to open the Command Palette.
3.  Type `Sensors` and select **"Show Sensors"**.
4.  In the Sensors tab that appears at the bottom, look for **"Orientation"**.
5.  You can select a preset (e.g., "Landscape Left") or manually rotate the alpha/beta/gamma values to simulate moving a phone throughout the virtual space.

## Verifying the Galaxy Background

When in VR mode (using Method 1):
1.  Look around by rotating the headset controls.
2.  You should see the galaxy image surrounding you in all directions.
3.  It should feel distant (infinite depth), meaning as you move your head position slightly, the stars don't move relative to you (Skybox effect), but they do rotate when you turn your head.
