from database import SessionLocal
from models import User
from auth import get_password_hash

def create_superadmin():
    db = SessionLocal()
    
    try:
        print("=" * 40)
        print("ساخت سوپرادمین جدید")
        print("=" * 40)
        
        # گرفتن اطلاعات از کاربر
        username = input("نام کاربری (username): ").strip()
        email = input("ایمیل (email): ").strip()
        password = input("رمز عبور (password): ").strip()
        
        # اعتبارسنجی ساده
        if not username or not email or not password:
            print("همه فیلدها اجباری هستند!")
            return
        
        # چک کردن تکراری نبودن
        existing = db.query(User).filter(
            (User.username == username) | (User.email == email)
        ).first()
        
        if existing:
            print(f" کاربری با نام {existing.username} یا ایمیل {existing.email} قبلاً وجود دارد!")
            return
        
        # ساخت کاربر جدید
        new_user = User(
            username=username,
            email=email,
            hashed_password=get_password_hash(password),
            role="super_admin"
        )
        
        db.add(new_user)
        db.commit()
        
        print("\n سوپرادمین با موفقیت ساخته شد!")
        print(f"   نام کاربری: {username}")
        print(f"   ایمیل: {email}")
        print(f"   رمز عبور: {password}")
        print(f"   نقش: super_admin")
        
    except Exception as e:
        print(f" خطا: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_superadmin()