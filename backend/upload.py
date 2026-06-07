import os
import uuid
from pathlib import Path
from typing import Optional
from fastapi import UploadFile, HTTPException
from datetime import datetime

# ========== تغییر مسیر به بیرون از پوشه backend ==========
UPLOAD_DIR = Path("../uploads")
IMAGE_DIR = UPLOAD_DIR / "images"
AUDIO_DIR = UPLOAD_DIR / "audio"
VIDEO_DIR = UPLOAD_DIR / "videos"

# ایجاد پوشه‌ها (اگه وجود ندارن)
for dir_path in [IMAGE_DIR, AUDIO_DIR, VIDEO_DIR]:
    dir_path.mkdir(parents=True, exist_ok=True)

# ========== تنظیمات اعتبارسنجی فایل ==========
ALLOWED_EXTENSIONS = {
    'image': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    'audio': ['.mp3', '.wav', '.ogg', '.m4a'],
    'video': ['.mp4', '.avi', '.mov', '.mkv', '.webm']
}

MAX_FILE_SIZES = {
    'image': 10 * 1024 * 1024,   # 10 MB
    'audio': 50 * 1024 * 1024,   # 50 MB
    'video': 200 * 1024 * 1024,  # 200 MB
}

def get_file_type(filename: str) -> Optional[str]:
    ext = Path(filename).suffix.lower()
    for file_type, extensions in ALLOWED_EXTENSIONS.items():
        if ext in extensions:
            return file_type
    return None

def validate_file(file: UploadFile, file_type: str):
    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS.get(file_type, []):
        raise HTTPException(
            status_code=400,
            detail=f"پسوند مجاز نیست. پسوندهای مجاز: {', '.join(ALLOWED_EXTENSIONS[file_type])}"
        )

def get_mime_type(extension: str) -> str:
    mime_types = {
        '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
        '.gif': 'image/gif', '.webp': 'image/webp', '.mp3': 'audio/mpeg',
        '.wav': 'audio/wav', '.ogg': 'audio/ogg', '.mp4': 'video/mp4',
        '.avi': 'video/x-msvideo', '.mov': 'video/quicktime', '.mkv': 'video/x-matroska', '.webm': 'video/webm'
    }
    return mime_types.get(extension, 'application/octet-stream')

# ========== توابع ذخیره‌سازی ==========

async def save_file_local(upload_file: UploadFile, file_type: str, user_id: int) -> dict:
    original_filename = upload_file.filename
    ext = Path(original_filename).suffix.lower()
    unique_filename = f"{uuid.uuid4().hex}_{datetime.now().strftime('%Y%m%d_%H%M%S')}{ext}"
    
    if file_type == 'image':
        save_dir = IMAGE_DIR
    elif file_type == 'audio':
        save_dir = AUDIO_DIR
    else:
        save_dir = VIDEO_DIR
    
    file_path = save_dir / unique_filename
    
    with open(file_path, "wb") as buffer:
        chunk_size = 1024 * 1024
        total_size = 0
        max_size = MAX_FILE_SIZES[file_type]
        
        while chunk := await upload_file.read(chunk_size):
            total_size += len(chunk)
            if total_size > max_size:
                if file_path.exists():
                    file_path.unlink()
                raise HTTPException(
                    status_code=400,
                    detail=f"حجم فایل بیشتر از حد مجاز است. حداکثر {max_size // (1024*1024)} مگابایت"
                )
            buffer.write(chunk)
    
    return {
        "filename": original_filename,
        "file_path": str(file_path),
        "file_type": file_type,
        "file_size": total_size,
        "mime_type": upload_file.content_type or get_mime_type(ext),
        "url": f"/uploads/{file_type}s/{unique_filename}",
        "is_cloud": False
    }

async def save_upload_file(upload_file: UploadFile, file_type: str, user_id: int) -> dict:
    validate_file(upload_file, file_type)
    return await save_file_local(upload_file, file_type, user_id)

def delete_file_local(file_path: str) -> bool:
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            return True
    except Exception as e:
        print(f"Error deleting local file: {e}")
    return False

def delete_uploaded_file(file_path: str, is_cloud: bool = False) -> bool:
    return delete_file_local(file_path)