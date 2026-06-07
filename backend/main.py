from fastapi import FastAPI, Depends, HTTPException, status, File, UploadFile,Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import timedelta
from pathlib import Path
import uuid
from datetime import datetime

from database import engine, get_db
from models import Base, User, Post, Comment, MediaFile,Song
from schemas import *
from crud import *
from auth import *
from translate import translate_post_content
from upload import save_upload_file, delete_uploaded_file
from config import settings

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Blog System API", version="1.0.0")
import logging
logging.basicConfig(level=logging.DEBUG)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory="../uploads"), name="uploads")

@app.post("/api/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    if get_user_by_username(db, user.username):
        raise HTTPException(status_code=400, detail="Username already registered")
    if get_user_by_email(db, user.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    return create_user(db=db, user=user, role="user")

@app.post("/api/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@app.get("/api/admin/users", response_model=List[UserResponse])
def get_all_users_endpoint(
    skip: int = 0, limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_super_admin)
):
    return get_all_users(db, skip=skip, limit=limit)

@app.put("/api/admin/users/{user_id}/role")
def update_user_role_endpoint(
    user_id: int, role_update: UserUpdateRole,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_super_admin)
):
    target_user = db.query(User).filter(User.id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
    if target_user.role == "super_admin":
        raise HTTPException(status_code=403, detail="Cannot modify super admin")
    update_user_role(db, user_id, role_update.role)
    return {"message": "Role updated successfully"}

@app.post("/api/admin/users")
def create_admin_by_super(
    user: UserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_super_admin)
):
    if get_user_by_username(db, user.username):
        raise HTTPException(status_code=400, detail="Username already exists")
    return create_user(db=db, user=user, role="admin")

@app.post("/api/posts", response_model=PostResponse)
def create_post_endpoint(
    post: PostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_or_super)
):
    return create_post(db=db, post=post, author_id=current_user.id)

@app.get("/api/posts", response_model=List[PostResponse])
def get_all_posts_endpoint(
    skip: int = 0, limit: int = 20,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    if current_user and current_user.role in ["admin", "super_admin"]:
        posts = db.query(Post).offset(skip).limit(limit).all()
    else:
        posts = get_posts(db, skip=skip, limit=limit, published_only=True)
    
    for post in posts:
        post.likes_count = get_post_likes_count(db, post.id)
        post.comments_count = len(db.query(Comment).filter(Comment.post_id == post.id, Comment.is_approved == True).all())
        post.media_files = db.query(MediaFile).filter(MediaFile.post_id == post.id).all()
        for media in post.media_files:
            file_type_dir = f"{media.file_type}s"
            file_name = Path(media.file_path).name
            media.url = f"/uploads/{file_type_dir}/{file_name}"
    return posts

@app.get("/api/posts/{post_id}", response_model=PostResponse)
def get_post_endpoint(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    post = get_post_by_id(db, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if not post.is_published:
        if not current_user or current_user.role not in ["admin", "super_admin"]:
            raise HTTPException(status_code=403, detail="Access denied")
    post.likes_count = get_post_likes_count(db, post_id)
    post.comments_count = len(db.query(Comment).filter(Comment.post_id == post_id, Comment.is_approved == True).all())
    post.media_files = db.query(MediaFile).filter(MediaFile.post_id == post_id).all()
    for media in post.media_files:
        file_type_dir = f"{media.file_type}s"
        file_name = Path(media.file_path).name
        media.url = f"/uploads/{file_type_dir}/{file_name}"
    return post

@app.put("/api/posts/{post_id}", response_model=PostResponse)
def update_post_endpoint(
    post_id: int, post_update: PostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_or_super)
):
    post = get_post_by_id(db, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return update_post(db, post_id, post_update)

@app.delete("/api/posts/{post_id}")
def delete_post_endpoint(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_or_super)
):
    post = get_post_by_id(db, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    delete_post(db, post_id)
    return {"message": "Post deleted successfully"}

@app.post("/api/posts/{post_id}/comments", response_model=CommentResponse)
def create_comment_endpoint(
    post_id: int, comment: CommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    post = get_post_by_id(db, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return create_comment(db, comment, current_user.id, post_id)

@app.get("/api/posts/{post_id}/comments", response_model=List[CommentResponse])
def get_post_comments_endpoint(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    only_approved = True
    if current_user and current_user.role in ["admin", "super_admin"]:
        only_approved = False
    comments = get_comments_by_post(db, post_id, only_approved=only_approved)
    
    comment_dict = {c.id: c for c in comments}
    root_comments = []
    for comment in comments:
        if comment.parent_id:
            parent = comment_dict.get(comment.parent_id)
            if parent:
                if not hasattr(parent, 'replies'):
                    parent.replies = []
                parent.replies.append(comment)
        else:
            root_comments.append(comment)
    return root_comments

@app.put("/api/admin/comments/{comment_id}/approve")
def approve_comment_endpoint(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_or_super)
):
    comment = approve_comment(db, comment_id)
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    return {"message": "Comment approved successfully"}

@app.delete("/api/comments/{comment_id}")
def delete_comment_endpoint(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    if current_user.id != comment.user_id and current_user.role not in ["admin", "super_admin"]:
        raise HTTPException(status_code=403, detail="Access denied")
    delete_comment(db, comment_id)
    return {"message": "Comment deleted successfully"}

@app.post("/api/posts/{post_id}/like")
def like_post_endpoint(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    post = get_post_by_id(db, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    like = like_post(db, current_user.id, post_id)
    if not like:
        raise HTTPException(status_code=400, detail="Already liked")
    return {"message": "Post liked successfully"}

@app.delete("/api/posts/{post_id}/like")
def unlike_post_endpoint(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    unlike_post(db, current_user.id, post_id)
    return {"message": "Post unliked successfully"}

@app.post("/api/translate")
async def translate_post_endpoint(
    request: TranslateRequest,
    db: Session = Depends(get_db)
):
    post = get_post_by_id(db, request.post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    translated = await translate_post_content(post.title, post.content, request.target_lang)
    return translated

@app.post("/api/upload/{file_type}")
async def upload_file_endpoint(
    file_type: str,
    file: UploadFile = File(...),
    post_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_or_super)
):
    if file_type not in ['image', 'audio', 'video']:
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    file_info = await save_upload_file(file, file_type, current_user.id)
    
    media = MediaFile(
        filename=file_info['filename'],
        file_path=file_info['file_path'],
        file_type=file_info['file_type'],
        file_size=file_info['file_size'],
        mime_type=file_info['mime_type'],
        uploaded_by=current_user.id,
        post_id=post_id
    )
    db.add(media)
    db.commit()
    db.refresh(media)
    
    return {
        "id": media.id,
        "filename": media.filename,
        "url": file_info['url'],
        "file_type": media.file_type,
        "file_size": media.file_size,
        "message": "File uploaded successfully"
    }

@app.post("/api/posts/{post_id}/media/{media_id}")
def attach_media_to_post_endpoint(
    post_id: int, media_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_or_super)
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    media = db.query(MediaFile).filter(MediaFile.id == media_id).first()
    if not media:
        raise HTTPException(status_code=404, detail="Media not found")
    if media.uploaded_by != current_user.id and current_user.role != "super_admin":
        raise HTTPException(status_code=403, detail="Access denied")
    media.post_id = post_id
    db.commit()
    return {"message": "Media attached to post successfully"}

@app.delete("/api/media/{media_id}")
def delete_media_endpoint(
    media_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_or_super)
):
    media = db.query(MediaFile).filter(MediaFile.id == media_id).first()
    if not media:
        raise HTTPException(status_code=404, detail="Media not found")
    if media.uploaded_by != current_user.id and current_user.role != "super_admin":
        raise HTTPException(status_code=403, detail="Access denied")
    delete_uploaded_file(media.file_path)
    db.delete(media)
    db.commit()
    return {"message": "Media deleted successfully"}

@app.get("/api/posts/{post_id}/media", response_model=List[MediaFileResponse])
def get_post_media_endpoint(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    post = get_post_by_id(db, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if not post.is_published:
        if not current_user or current_user.role not in ["admin", "super_admin"]:
            raise HTTPException(status_code=403, detail="Access denied")
    
    media_files = db.query(MediaFile).filter(MediaFile.post_id == post_id).all()
    for media in media_files:
        file_type_dir = f"{media.file_type}s"
        file_name = Path(media.file_path).name
        media.url = f"/uploads/{file_type_dir}/{file_name}"
    return media_files
# ==================== مسیرهای موزیک ====================

@app.post("/api/songs/upload")
async def upload_song(
    title: str = Form(...),
    artist: str = Form(...),
    duration: Optional[int] = Form(None),
    file: UploadFile = File(...),
    post_id: Optional[int] = Form(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_or_super)
):
    """آپلود آهنگ جدید"""
    
    ext = Path(file.filename).suffix.lower()
    if ext not in ['.mp3', '.wav', '.ogg', '.m4a']:
        raise HTTPException(status_code=400, detail="فرمت مجاز نیست. فقط mp3, wav, ogg, m4a")
    
    # تغییر مسیر به ../uploads/songs
    unique_filename = f"song_{uuid.uuid4().hex}_{datetime.now().strftime('%Y%m%d_%H%M%S')}{ext}"
    song_dir = Path("../uploads/songs")
    song_dir.mkdir(parents=True, exist_ok=True)
    file_path = song_dir / unique_filename
    
    total_size = 0
    with open(file_path, "wb") as buffer:
        while chunk := await file.read(1024 * 1024):
            total_size += len(chunk)
            if total_size > 50 * 1024 * 1024:
                file_path.unlink()
                raise HTTPException(status_code=400, detail="حداکثر حجم 50 مگابایت")
            buffer.write(chunk)
    
    db_song = create_song(
        db=db,
        title=title,
        artist=artist,
        duration=duration,
        file_path=str(file_path),
        file_size=total_size,
        uploaded_by=current_user.id,
        post_id=post_id
    )
    
    # آدرس URL برای دسترسی
    return {
        "id": db_song.id,
        "title": db_song.title,
        "artist": db_song.artist,
        "url": f"/uploads/songs/{unique_filename}"
    }

@app.get("/api/songs", response_model=List[SongResponse])
def get_all_songs(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """لیست همه آهنگ‌ها"""
    return get_songs(db, skip, limit)

@app.get("/api/songs/{song_id}", response_model=SongResponse)
def get_song(song_id: int, db: Session = Depends(get_db)):
    """گرفتن یک آهنگ با آیدی"""
    song = get_song_by_id(db, song_id)
    if not song:
        raise HTTPException(status_code=404, detail="آهنگ یافت نشد")
    return song

@app.post("/api/songs/{song_id}/play")
def play_song(song_id: int, db: Session = Depends(get_db)):
    """افزایش تعداد پخش"""
    song = increment_play_count(db, song_id)
    if not song:
        raise HTTPException(status_code=404, detail="آهنگ یافت نشد")
    return {"message": "پخش ثبت شد", "play_count": song.play_count}

@app.get("/api/songs/top/popular", response_model=List[SongResponse])
def get_popular_songs(limit: int = 10, db: Session = Depends(get_db)):
    """پربازدیدترین آهنگ‌ها"""
    return db.query(Song).order_by(Song.play_count.desc()).limit(limit).all()

@app.get("/api/songs/search/{query}", response_model=List[SongResponse])
def search_songs_endpoint(query: str, db: Session = Depends(get_db)):
    """جستجو در آهنگ‌ها و خواننده‌ها"""
    return search_songs(db, query)

@app.delete("/api/songs/{song_id}")
def delete_song_endpoint(
    song_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_or_super)
):
    """حذف آهنگ"""
    song = delete_song(db, song_id)
    if not song:
        raise HTTPException(status_code=404, detail="آهنگ یافت نشد")
    return {"message": "آهنگ حذف شد"}