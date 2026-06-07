from sqlalchemy.orm import Session
from models import User, Post, Comment, Like, MediaFile,Song
from schemas import UserCreate, PostCreate, CommentCreate
from auth import get_password_hash
import os

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user: UserCreate, role: str = "user"):
    hashed_password = get_password_hash(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        role=role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user_role(db: Session, user_id: int, new_role: str):
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        user.role = new_role
        db.commit()
        db.refresh(user)
    return user

def get_all_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(User).offset(skip).limit(limit).all()

def create_post(db: Session, post: PostCreate, author_id: int):
    db_post = Post(
        title=post.title,
        content=post.content,
        excerpt=post.excerpt,
        is_published=post.is_published,
        author_id=author_id
    )
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

def get_posts(db: Session, skip: int = 0, limit: int = 100, published_only: bool = True):
    query = db.query(Post)
    if published_only:
        query = query.filter(Post.is_published == True)
    return query.offset(skip).limit(limit).all()

def get_post_by_id(db: Session, post_id: int):
    return db.query(Post).filter(Post.id == post_id).first()

def update_post(db: Session, post_id: int, post_update: PostCreate):
    post = db.query(Post).filter(Post.id == post_id).first()
    if post:
        post.title = post_update.title
        post.content = post_update.content
        post.excerpt = post_update.excerpt
        post.is_published = post_update.is_published
        db.commit()
        db.refresh(post)
    return post

def delete_post(db: Session, post_id: int):
    post = db.query(Post).filter(Post.id == post_id).first()
    if post:
        for media in post.media_files:
            if os.path.exists(media.file_path):
                os.remove(media.file_path)
        db.delete(post)
        db.commit()
    return post

def create_comment(db: Session, comment: CommentCreate, user_id: int, post_id: int):
    db_comment = Comment(
        content=comment.content,
        user_id=user_id,
        post_id=post_id,
        parent_id=comment.parent_id,
        is_approved=False
    )
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

def get_comments_by_post(db: Session, post_id: int, only_approved: bool = True):
    query = db.query(Comment).filter(Comment.post_id == post_id)
    if only_approved:
        query = query.filter(Comment.is_approved == True)
    comments = query.all()
    
    # تنظیم replies برای هر کامنت
    for comment in comments:
        if comment.replies is None:
            comment.replies = []
    
    return comments

def approve_comment(db: Session, comment_id: int):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if comment:
        comment.is_approved = True
        db.commit()
        db.refresh(comment)
    return comment

def delete_comment(db: Session, comment_id: int):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if comment:
        db.delete(comment)
        db.commit()
    return comment

def like_post(db: Session, user_id: int, post_id: int):
    existing_like = db.query(Like).filter(
        Like.user_id == user_id,
        Like.post_id == post_id
    ).first()
    if existing_like:
        return None
    like = Like(user_id=user_id, post_id=post_id)
    db.add(like)
    db.commit()
    db.refresh(like)
    return like

def unlike_post(db: Session, user_id: int, post_id: int):
    like = db.query(Like).filter(
        Like.user_id == user_id,
        Like.post_id == post_id
    ).first()
    if like:
        db.delete(like)
        db.commit()
    return like

def get_post_likes_count(db: Session, post_id: int):
    return db.query(Like).filter(Like.post_id == post_id).count()

def has_user_liked(db: Session, user_id: int, post_id: int):
    return db.query(Like).filter(
        Like.user_id == user_id,
        Like.post_id == post_id
    ).first() is not None
# ========== عملیات موزیک ==========

def create_song(db: Session, title: str, artist: str, duration: int, file_path: str, file_size: int, uploaded_by: int, post_id: int = None):
    db_song = Song(
        title=title,
        artist=artist,
        duration=duration,
        file_path=file_path,
        file_size=file_size,
        uploaded_by=uploaded_by,
        post_id=post_id
    )
    db.add(db_song)
    db.commit()
    db.refresh(db_song)
    return db_song

def get_songs(db: Session, skip: int = 0, limit: int = 50):
    return db.query(Song).order_by(Song.created_at.desc()).offset(skip).limit(limit).all()

def get_song_by_id(db: Session, song_id: int):
    return db.query(Song).filter(Song.id == song_id).first()

def delete_song(db: Session, song_id: int):
    song = db.query(Song).filter(Song.id == song_id).first()
    if song:
        if os.path.exists(song.file_path):
            os.remove(song.file_path)
        db.delete(song)
        db.commit()
    return song

def increment_play_count(db: Session, song_id: int):
    song = db.query(Song).filter(Song.id == song_id).first()
    if song:
        song.play_count += 1
        db.commit()
    return song

def search_songs(db: Session, query_str: str):
    """جستجو در اسم آهنگ و خواننده"""
    return db.query(Song).filter(
        (Song.title.ilike(f"%{query_str}%")) | 
        (Song.artist.ilike(f"%{query_str}%"))
    ).all()