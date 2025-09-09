# Battery Monitor Android App

This Android application monitors the device's battery level and provides WiFi-dependent video playback functionality.

## Features

### Battery Monitoring
- **Real-time battery level display** with visual progress bar
- **Color-coded battery indicator** (red for low battery ≤20%, orange for medium, green for high)
- **Low battery alarm** when battery drops below 20%
- **Charging status monitoring** with visual indicators
- **Automatic alarm stop** when charger is connected

### WiFi-dependent Video Playback
- **WiFi status monitoring** with real-time updates
- **Video playback** only available when connected to WiFi
- **Automatic video controls** with pause/resume functionality
- **Clear messaging** when WiFi is not available

## Requirements

- Android 7.0 (API level 24) or higher
- WiFi capability for video features
- Storage permission for media access

## Setup and Installation

### Prerequisites
1. Install Android Studio with latest SDK
2. Enable Developer Options on your Android device
3. Enable USB Debugging

### Building the App
```bash
cd battery-monitor-app
./gradlew build
```

### Installing on Device
```bash
./gradlew installDebug
```

## Permissions

The app requires the following permissions:
- `BATTERY_STATS` - Monitor battery level changes
- `WAKE_LOCK` - Keep alarm running when battery is low
- `ACCESS_NETWORK_STATE` - Check network connectivity
- `ACCESS_WIFI_STATE` - Monitor WiFi connection status
- `INTERNET` - Load video content

## Architecture

### Main Components

1. **MainActivity** - Battery monitoring interface with:
   - Battery level display and progress bar
   - Charging status indicator
   - Low battery warning with alarm
   - WiFi status display
   - Navigation to video screen

2. **VideoActivity** - WiFi-dependent video playback with:
   - Real-time WiFi status monitoring
   - ExoPlayer integration for smooth video playback
   - Automatic pause/resume based on WiFi connectivity
   - User-friendly messages for connection issues

3. **BatteryLevelReceiver** - Broadcast receiver for:
   - Battery level changes
   - Charging status updates
   - Power connection/disconnection events

### Key Features Implementation

#### Battery Monitoring
- Uses `BroadcastReceiver` to listen for `ACTION_BATTERY_CHANGED` events
- Implements `WakeLock` to ensure alarm continues during low battery
- Uses system alarm sound for notifications
- Color-coded UI feedback for different battery states

#### WiFi Monitoring
- Uses `ConnectivityManager` to check WiFi connectivity
- Real-time network state monitoring with broadcast receivers
- Automatic video player setup/teardown based on connectivity

#### Video Playback
- Integrates ExoPlayer for robust video playback
- Implements proper lifecycle management for media resources
- Handles network connectivity changes gracefully

## Usage

1. **Launch the app** - View current battery level and charging status
2. **Battery monitoring** - Watch real-time battery percentage and warnings
3. **Video playback** - Tap "Video Playback" button when connected to WiFi
4. **Low battery alarm** - Will sound when battery drops below 20%
5. **Charging detection** - Alarm automatically stops when charger is connected

## Testing

### Battery Testing
1. Disconnect charger to test battery monitoring
2. Use battery drain apps or wait for battery to drop below 20%
3. Connect charger to test alarm stop functionality

### WiFi Testing
1. Ensure device is connected to WiFi
2. Open video screen to test playback
3. Disable WiFi to test disconnection handling
4. Re-enable WiFi to test reconnection

## Technical Details

- **Language**: Kotlin
- **Minimum SDK**: API 24 (Android 7.0)
- **Target SDK**: API 34 (Android 14)
- **Architecture**: MVVM with ViewBinding
- **Media Framework**: ExoPlayer
- **Build System**: Gradle with Kotlin DSL

## Troubleshooting

### Common Issues
1. **Alarm not playing** - Check device volume and Do Not Disturb settings
2. **Video not loading** - Verify WiFi connection and internet access
3. **Battery level not updating** - Check app permissions in device settings

### Debug Build
```bash
./gradlew assembleDebug
```

### Release Build
```bash
./gradlew assembleRelease
```

## Future Enhancements

- Customizable battery threshold settings
- Video playlist support
- Background battery monitoring service
- Power usage statistics and analytics
- Integration with device power management settings