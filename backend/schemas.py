from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime
from typing import Optional, List

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    role: str
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class UserUpdateRole(BaseModel):
    role: str

class PostBase(BaseModel):
    title: str
    content: str
    is_published: bool = True
    excerpt: Optional[str] = None

class PostCreate(PostBase):
    pass

class MediaFileResponse(BaseModel):
    id: int
    filename: str
    file_path: str
    file_type: str
    file_size: int
    mime_type: str
    url: str
    uploaded_by: int
    post_id: Optional[int]
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class PostResponse(PostBase):
    id: int
    created_at: datetime
    updated_at: datetime
    author_id: int
    author: UserResponse
    likes_count: int = 0
    comments_count: int = 0
    media_files: List[MediaFileResponse] = []
    
    model_config = ConfigDict(from_attributes=True)

class CommentBase(BaseModel):
    content: str
    parent_id: Optional[int] = None

class CommentCreate(CommentBase):
    pass

class CommentResponse(CommentBase):
    id: int
    is_approved: bool
    created_at: datetime
    user_id: int
    post_id: int
    author: UserResponse
    replies: List['CommentResponse'] = []
    
    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class TranslateRequest(BaseModel):
    post_id: int
    target_lang: str

class TranslateResponse(BaseModel):
    title: str
    content: str

CommentResponse.model_rebuild()

# ========== اسکیماهای موزیک (ساده) ==========

class SongBase(BaseModel):
    title: str
    artist: str
    duration: Optional[int] = None

class SongCreate(SongBase):
    pass

class SongResponse(SongBase):
    id: int
    file_path: str
    file_size: Optional[int]
    play_count: int
    uploaded_by: int
    post_id: Optional[int]
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True) 