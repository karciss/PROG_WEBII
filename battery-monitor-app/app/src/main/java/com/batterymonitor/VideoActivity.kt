package com.batterymonitor

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.media3.common.MediaItem
import androidx.media3.common.Player
import androidx.media3.exoplayer.ExoPlayer
import com.batterymonitor.databinding.ActivityVideoBinding

class VideoActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityVideoBinding
    private lateinit var connectivityManager: ConnectivityManager
    private var exoPlayer: ExoPlayer? = null
    private var networkReceiver: BroadcastReceiver? = null
    
    // Sample video URL - in a real app this would come from your video source
    private val videoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityVideoBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        connectivityManager = getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
        
        setupClickListeners()
        setupNetworkReceiver()
        checkWifiAndSetupVideo()
    }
    
    private fun setupClickListeners() {
        binding.btnBack.setOnClickListener {
            finish()
        }
    }
    
    private fun setupNetworkReceiver() {
        networkReceiver = object : BroadcastReceiver() {
            override fun onReceive(context: Context?, intent: Intent?) {
                checkWifiAndSetupVideo()
            }
        }
        
        val filter = IntentFilter(ConnectivityManager.CONNECTIVITY_ACTION)
        registerReceiver(networkReceiver, filter)
    }
    
    private fun checkWifiAndSetupVideo() {
        val isWifiConnected = isWifiConnected()
        updateWifiStatus(isWifiConnected)
        
        if (isWifiConnected) {
            showVideoPlayer()
            initializePlayer()
        } else {
            hideVideoPlayer()
            releasePlayer()
        }
    }
    
    private fun updateWifiStatus(isConnected: Boolean) {
        if (isConnected) {
            binding.tvWifiStatusBanner.text = getString(R.string.wifi_connected)
            binding.tvWifiStatusBanner.setBackgroundColor(ContextCompat.getColor(this, R.color.green))
        } else {
            binding.tvWifiStatusBanner.text = getString(R.string.wifi_disconnected)
            binding.tvWifiStatusBanner.setBackgroundColor(ContextCompat.getColor(this, R.color.red))
        }
    }
    
    private fun showVideoPlayer() {
        binding.playerView.visibility = android.view.View.VISIBLE
        binding.cvNoWifiMessage.visibility = android.view.View.GONE
        binding.tvVideoStatus.text = "Video player ready"
    }
    
    private fun hideVideoPlayer() {
        binding.playerView.visibility = android.view.View.GONE
        binding.cvNoWifiMessage.visibility = android.view.View.VISIBLE
        binding.tvVideoStatus.text = "WiFi required for video playback"
    }
    
    private fun initializePlayer() {
        if (exoPlayer == null) {
            exoPlayer = ExoPlayer.Builder(this).build().also { player ->
                binding.playerView.player = player
                
                // Set up player listener
                player.addListener(object : Player.Listener {
                    override fun onPlaybackStateChanged(playbackState: Int) {
                        updateVideoStatus(playbackState)
                    }
                    
                    override fun onPlayerError(error: androidx.media3.common.PlaybackException) {
                        Toast.makeText(
                            this@VideoActivity,
                            "Video playback error: ${error.message}",
                            Toast.LENGTH_LONG
                        ).show()
                        binding.tvVideoStatus.text = "Playback error"
                    }
                })
                
                // Create media item and prepare player
                val mediaItem = MediaItem.fromUri(videoUrl)
                player.setMediaItem(mediaItem)
                player.prepare()
            }
        }
    }
    
    private fun updateVideoStatus(playbackState: Int) {
        val statusText = when (playbackState) {
            Player.STATE_IDLE -> "Player idle"
            Player.STATE_BUFFERING -> "Buffering..."
            Player.STATE_READY -> "Ready to play"
            Player.STATE_ENDED -> "Playback ended"
            else -> "Unknown state"
        }
        binding.tvVideoStatus.text = statusText
    }
    
    private fun releasePlayer() {
        exoPlayer?.let { player ->
            player.release()
        }
        exoPlayer = null
        binding.playerView.player = null
    }
    
    private fun isWifiConnected(): Boolean {
        val activeNetwork = connectivityManager.activeNetwork ?: return false
        val capabilities = connectivityManager.getNetworkCapabilities(activeNetwork) ?: return false
        return capabilities.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) &&
               capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
    }
    
    override fun onStart() {
        super.onStart()
        if (isWifiConnected()) {
            initializePlayer()
        }
    }
    
    override fun onResume() {
        super.onResume()
        exoPlayer?.playWhenReady = true
    }
    
    override fun onPause() {
        super.onPause()
        exoPlayer?.playWhenReady = false
    }
    
    override fun onStop() {
        super.onStop()
        exoPlayer?.playWhenReady = false
    }
    
    override fun onDestroy() {
        super.onDestroy()
        networkReceiver?.let { unregisterReceiver(it) }
        releasePlayer()
    }
}