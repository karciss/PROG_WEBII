package com.batterymonitor

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.media.MediaPlayer
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.os.BatteryManager
import android.os.Bundle
import android.os.PowerManager
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import com.batterymonitor.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityMainBinding
    private lateinit var batteryReceiver: BroadcastReceiver
    private lateinit var connectivityManager: ConnectivityManager
    private var mediaPlayer: MediaPlayer? = null
    private var wakeLock: PowerManager.WakeLock? = null
    
    private val LOW_BATTERY_THRESHOLD = 20
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        setupConnectivityManager()
        setupBatteryReceiver()
        setupClickListeners()
        
        // Initial battery and wifi status check
        checkBatteryStatus()
        checkWifiStatus()
    }
    
    private fun setupConnectivityManager() {
        connectivityManager = getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
    }
    
    private fun setupBatteryReceiver() {
        batteryReceiver = object : BroadcastReceiver() {
            override fun onReceive(context: Context?, intent: Intent?) {
                when (intent?.action) {
                    Intent.ACTION_BATTERY_CHANGED -> {
                        handleBatteryChanged(intent)
                    }
                    Intent.ACTION_POWER_CONNECTED -> {
                        handlePowerConnected()
                    }
                    Intent.ACTION_POWER_DISCONNECTED -> {
                        handlePowerDisconnected()
                    }
                }
            }
        }
        
        // Register for battery and charging status changes
        val filter = IntentFilter().apply {
            addAction(Intent.ACTION_BATTERY_CHANGED)
            addAction(Intent.ACTION_POWER_CONNECTED)
            addAction(Intent.ACTION_POWER_DISCONNECTED)
        }
        registerReceiver(batteryReceiver, filter)
    }
    
    private fun setupClickListeners() {
        binding.btnVideoPlayback.setOnClickListener {
            if (isWifiConnected()) {
                startVideoActivity()
            } else {
                Toast.makeText(this, getString(R.string.connect_wifi_message), Toast.LENGTH_LONG).show()
            }
        }
    }
    
    private fun handleBatteryChanged(intent: Intent) {
        val level = intent.getIntExtra(BatteryManager.EXTRA_LEVEL, -1)
        val scale = intent.getIntExtra(BatteryManager.EXTRA_SCALE, -1)
        val batteryPercent = (level * 100 / scale.toFloat()).toInt()
        
        updateBatteryDisplay(batteryPercent)
        
        // Check for low battery
        if (batteryPercent <= LOW_BATTERY_THRESHOLD && !isCharging()) {
            showLowBatteryWarning()
            startAlarm()
        } else {
            hideLowBatteryWarning()
        }
        
        // Update charging status
        val chargingStatus = intent.getIntExtra(BatteryManager.EXTRA_STATUS, -1)
        val isCharging = chargingStatus == BatteryManager.BATTERY_STATUS_CHARGING ||
                        chargingStatus == BatteryManager.BATTERY_STATUS_FULL
        updateChargingStatus(isCharging)
    }
    
    private fun handlePowerConnected() {
        updateChargingStatus(true)
        stopAlarm()
        hideLowBatteryWarning()
        Toast.makeText(this, "Charger connected - Alarm stopped", Toast.LENGTH_SHORT).show()
    }
    
    private fun handlePowerDisconnected() {
        updateChargingStatus(false)
        checkBatteryStatus() // Re-check if we need to start alarm
    }
    
    private fun updateBatteryDisplay(batteryPercent: Int) {
        binding.tvBatteryLevel.text = getString(R.string.battery_level, batteryPercent)
        binding.pbBatteryLevel.progress = batteryPercent
        
        // Change progress bar color based on battery level
        val color = when {
            batteryPercent <= LOW_BATTERY_THRESHOLD -> ContextCompat.getColor(this, R.color.red)
            batteryPercent <= 50 -> ContextCompat.getColor(this, R.color.orange)
            else -> ContextCompat.getColor(this, R.color.green)
        }
        binding.pbBatteryLevel.progressTintList = android.content.res.ColorStateList.valueOf(color)
    }
    
    private fun updateChargingStatus(isCharging: Boolean) {
        val statusText = if (isCharging) {
            getString(R.string.charging_status_connected)
        } else {
            getString(R.string.charging_status_disconnected)
        }
        binding.tvChargingStatus.text = statusText
        
        val color = if (isCharging) {
            ContextCompat.getColor(this, R.color.green)
        } else {
            ContextCompat.getColor(this, R.color.red)
        }
        binding.tvChargingStatus.setTextColor(color)
    }
    
    private fun showLowBatteryWarning() {
        binding.cvLowBatteryWarning.visibility = android.view.View.VISIBLE
    }
    
    private fun hideLowBatteryWarning() {
        binding.cvLowBatteryWarning.visibility = android.view.View.GONE
    }
    
    private fun startAlarm() {
        if (mediaPlayer == null) {
            try {
                // Use system notification sound as alarm
                val uri = android.provider.Settings.System.DEFAULT_ALARM_ALERT_URI
                mediaPlayer = MediaPlayer.create(this, uri)
                mediaPlayer?.isLooping = true
                mediaPlayer?.start()
                
                // Acquire wake lock to keep alarm running
                val powerManager = getSystemService(Context.POWER_SERVICE) as PowerManager
                wakeLock = powerManager.newWakeLock(
                    PowerManager.PARTIAL_WAKE_LOCK,
                    "BatteryMonitor::AlarmWakeLock"
                )
                wakeLock?.acquire(10 * 60 * 1000L /*10 minutes*/)
                
            } catch (e: Exception) {
                e.printStackTrace()
                Toast.makeText(this, "Could not start alarm sound", Toast.LENGTH_SHORT).show()
            }
        }
    }
    
    private fun stopAlarm() {
        mediaPlayer?.let {
            if (it.isPlaying) {
                it.stop()
            }
            it.release()
        }
        mediaPlayer = null
        
        wakeLock?.let {
            if (it.isHeld) {
                it.release()
            }
        }
        wakeLock = null
    }
    
    private fun checkBatteryStatus() {
        val batteryIntent = registerReceiver(null, IntentFilter(Intent.ACTION_BATTERY_CHANGED))
        batteryIntent?.let { handleBatteryChanged(it) }
    }
    
    private fun isCharging(): Boolean {
        val batteryIntent = registerReceiver(null, IntentFilter(Intent.ACTION_BATTERY_CHANGED))
        val chargingStatus = batteryIntent?.getIntExtra(BatteryManager.EXTRA_STATUS, -1) ?: -1
        return chargingStatus == BatteryManager.BATTERY_STATUS_CHARGING ||
               chargingStatus == BatteryManager.BATTERY_STATUS_FULL
    }
    
    private fun checkWifiStatus() {
        val isConnected = isWifiConnected()
        val statusText = if (isConnected) {
            getString(R.string.wifi_connected)
        } else {
            getString(R.string.wifi_disconnected)
        }
        binding.tvWifiStatus.text = statusText
        
        val color = if (isConnected) {
            ContextCompat.getColor(this, R.color.green)
        } else {
            ContextCompat.getColor(this, R.color.red)
        }
        binding.tvWifiStatus.setTextColor(color)
    }
    
    private fun isWifiConnected(): Boolean {
        val activeNetwork = connectivityManager.activeNetwork ?: return false
        val capabilities = connectivityManager.getNetworkCapabilities(activeNetwork) ?: return false
        return capabilities.hasTransport(NetworkCapabilities.TRANSPORT_WIFI)
    }
    
    private fun startVideoActivity() {
        val intent = Intent(this, VideoActivity::class.java)
        startActivity(intent)
    }
    
    override fun onResume() {
        super.onResume()
        checkWifiStatus() // Refresh WiFi status when returning to activity
    }
    
    override fun onDestroy() {
        super.onDestroy()
        unregisterReceiver(batteryReceiver)
        stopAlarm()
    }
}