package com.batterymonitor

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.BatteryManager
import android.widget.Toast

class BatteryLevelReceiver : BroadcastReceiver() {
    
    override fun onReceive(context: Context, intent: Intent) {
        when (intent.action) {
            Intent.ACTION_BATTERY_CHANGED -> {
                val level = intent.getIntExtra(BatteryManager.EXTRA_LEVEL, -1)
                val scale = intent.getIntExtra(BatteryManager.EXTRA_SCALE, -1)
                val batteryPercent = (level * 100 / scale.toFloat()).toInt()
                
                // This receiver can be used for background battery monitoring
                // Currently the main activity handles battery changes directly
            }
            
            Intent.ACTION_POWER_CONNECTED -> {
                Toast.makeText(context, "Charger connected", Toast.LENGTH_SHORT).show()
            }
            
            Intent.ACTION_POWER_DISCONNECTED -> {
                Toast.makeText(context, "Charger disconnected", Toast.LENGTH_SHORT).show()
            }
        }
    }
}