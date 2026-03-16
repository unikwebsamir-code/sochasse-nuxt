<?php
/**
 * Upload & Unzip Script
 * Upload this file to your server, then use it to upload and extract ZIP files
 */

$message = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['zip_file'])) {
    $upload_dir = __DIR__ . '/uploads/';
    
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0755, true);
    }
    
    $file = $_FILES['zip_file'];
    $filename = basename($file['name']);
    
    // Validate file
    if ($file['error'] !== UPLOAD_ERR_OK) {
        $error = 'Upload error: ' . $file['error'];
    } elseif (pathinfo($filename, PATHINFO_EXTENSION) !== 'zip') {
        $error = 'Only ZIP files are allowed';
    } elseif ($file['size'] > 50 * 1024 * 1024) {
        $error = 'File too large (max 50MB)';
    } else {
        $upload_path = $upload_dir . $filename;
        
        if (move_uploaded_file($file['tmp_name'], $upload_path)) {
            // Unzip the file
            $zip = new ZipArchive;
            $extract_to = __DIR__ . '/sochasse/';
            
            if (!is_dir($extract_to)) {
                mkdir($extract_to, 0755, true);
            }
            
            if ($zip->open($upload_path) === TRUE) {
                $zip->extractTo($extract_to);
                $zip->close();
                
                // Delete the zip file after extraction
                unlink($upload_path);
                
                $message = 'Successfully extracted: ' . $filename;
            } else {
                $error = 'Failed to open ZIP file';
            }
        } else {
            $error = 'Failed to upload file';
        }
    }
}

// List extracted files
$extract_to = __DIR__ . '/sochasse/';
$files = [];
if (is_dir($extract_to)) {
    $files = scandir($extract_to);
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Upload & Unzip Project</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            margin-bottom: 20px;
        }
        .form-group {
            margin-bottom: 20px;
        }
        label {
            display: block;
            margin-bottom: 8px;
            font-weight: bold;
            color: #555;
        }
        input[type="file"] {
            padding: 10px;
            border: 2px dashed #ccc;
            border-radius: 4px;
            width: 100%;
            box-sizing: border-box;
        }
        button {
            background: #1a5f2a;
            color: white;
            padding: 12px 30px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
        }
        button:hover {
            background: #2d7a3d;
        }
        .message {
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 20px;
        }
        .success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        .file-list {
            margin-top: 30px;
        }
        .file-list h3 {
            color: #333;
            margin-bottom: 15px;
        }
        .file-list ul {
            list-style: none;
            padding: 0;
        }
        .file-list li {
            padding: 8px 12px;
            background: #f9f9f9;
            margin-bottom: 5px;
            border-radius: 4px;
        }
        .instructions {
            background: #e7f3ff;
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 20px;
            border-left: 4px solid #2196F3;
        }
        .instructions ol {
            margin: 10px 0;
            padding-left: 20px;
        }
        .instructions li {
            margin-bottom: 8px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📦 Upload & Unzip Project</h1>
        
        <div class="instructions">
            <strong>Instructions:</strong>
            <ol>
                <li>First, zip your project folder locally</li>
                <li>Upload this PHP file to your server via FTP</li>
                <li>Open this page in browser: <code>http://your-server-ip/unzip.php</code></li>
                <li>Upload your ZIP file using the form below</li>
                <li>Files will be extracted to <code>sochasse/</code> folder</li>
            </ol>
        </div>
        
        <?php if ($message): ?>
            <div class="message success"><?= htmlspecialchars($message) ?></div>
        <?php endif; ?>
        
        <?php if ($error): ?>
            <div class="message error"><?= htmlspecialchars($error) ?></div>
        <?php endif; ?>
        
        <form method="POST" enctype="multipart/form-data">
            <div class="form-group">
                <label for="zip_file">Select ZIP File:</label>
                <input type="file" name="zip_file" id="zip_file" accept=".zip" required>
            </div>
            <button type="submit">Upload & Extract</button>
        </form>
        
        <?php if (!empty($files)): ?>
            <div class="file-list">
                <h3>📁 Extracted Files (sochasse/):</h3>
                <ul>
                    <?php foreach ($files as $file): ?>
                        <?php if ($file !== '.' && $file !== '..'): ?>
                            <li><?= htmlspecialchars($file) ?></li>
                        <?php endif; ?>
                    <?php endforeach; ?>
                </ul>
            </div>
        <?php endif; ?>
    </div>
</body>
</html>
