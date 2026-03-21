private fun makePhoneCall(number: String) {
    val intent = Intent(Intent.ACTION_CALL)
    intent.data = Uri.parse("tel:$number")
    
    // Check if permission is granted
    if (ContextCompat.checkSelfPermission(this, Manifest.permission.CALL_PHONE) == PackageManager.PERMISSION_GRANTED) {
        startActivity(intent)
    } else {
        // Request permission
        ActivityCompat.requestPermissions(this, arrayOf(Manifest.permission.CALL_PHONE), 1)
    }
}

